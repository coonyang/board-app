import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { connectToDb } from "@/lib/utils";
import { Post } from "@/app/models/Post";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const cookieStore = await cookies();

  const viewed = cookieStore.get(`viewed-${id}`);

  if (viewed) {
    return NextResponse.json({ ok: true });
  }

  await connectToDb();

  await Post.updateOne(
    { _id: id },
    {
      $inc: { views: 1 },
    },
  );

  cookieStore.set(`viewed-${id}`, "true", {
    maxAge: 60 * 60,
  });

  return NextResponse.json({ ok: true });
}
