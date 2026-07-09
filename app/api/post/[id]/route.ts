import { connectToDb } from "@/lib/utils";
import { Post } from "@/app/models/Post";
import { requireUser } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireUser();
  const { id } = await params;

  const body = await req.json();

  const { title, content, category } = body;

  if (!title || !content) {
    return Response.json({ error: "need-input" }, { status: 400 });
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
    category: category || post.category || "자유",
  });

  return Response.json({ ok: true });
}
