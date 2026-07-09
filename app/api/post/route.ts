import { connectToDb } from "@/lib/utils";
import { Post } from "@/app/models/Post";
import { requireUser } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { title, content, category, imageUrls } = body;
  const user = await requireUser();

  if (!title || !content) {
    return Response.json({ error: "need-input" }, { status: 400 });
  }

  await connectToDb();

  const newPost = await Post.create({
    title,
    content,
    category: category || "자유",
    imageUrls,
    authorId: user.userId,
  });

  return Response.json(newPost);
}
