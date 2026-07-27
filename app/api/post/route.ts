import { connectToDb } from "@/lib/utils";
import { Post } from "@/app/models/Post";
import { requireUser } from "@/lib/auth";
import { POST_CATEGORIES } from "@/lib/postCategories";
import { grantExp } from "@/lib/grantExp";

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
    category: POST_CATEGORIES.includes(category) ? category : "자유",
    imageUrls,
    authorId: user.userId,
  });

  await grantExp(user.userId, 10);

  return Response.json(newPost);
}
