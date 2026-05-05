import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { isMyToken } from "@/lib/auth";
import { connectToDb } from "@/lib/utils";
import { Post } from "@/app/models/Post";

export async function POST(req: Request) {
  const body = await req.json();
  const { title, content, imageUrls } = body;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!title || !content) {
    return Response.json({ error: "need-input" }, { status: 400 });
  }

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

  const newPost = await Post.create({
    title,
    content,
    imageUrls,
    authorId: user.userId,
  });

  return Response.json(newPost);
}
