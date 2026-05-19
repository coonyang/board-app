import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import { isMyToken } from "@/lib/auth";
import { connectToDb } from "@/lib/utils";
import { Post } from "@/app/models/Post";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const body = await req.json();

  const { title, content } = body;

  if (!title || !content) {
    return Response.json({ error: "need-input" }, { status: 400 });
  }

  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  let user = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);

      if (isMyToken(decoded)) {
        user = decoded;
      }
    } catch {}
  }

  if (!user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  await connectToDb();

  const post = await Post.findById(id);

  if (!post) {
    return Response.json({ error: "not-found" }, { status: 404 });
  }

  if (post.authorId !== user.userId && user.role !== "admin") {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  await Post.findByIdAndUpdate(id, {
    title,
    content,
  });

  return Response.json({ ok: true });
}
