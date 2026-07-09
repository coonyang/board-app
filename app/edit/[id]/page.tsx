import { connectToDb } from "../../../lib/utils";
import { Post } from "../../models/Post";
import ErrorMessage from "../../components/ErrorMessage";
import WriteClient from "@/app/components/WriteClient";

export default async function EditPage({
  params,
  searchParams,
}: {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await connectToDb();
  const { id } = await params;
  const post = await Post.findById(id);
  const { error } = await searchParams;
  return (
    <div className="mx-auto max-w-2xl p-8">
      <ErrorMessage error={error} />

      <h1 className="mb-6 text-3xl font-bold text-fg">게시글 수정</h1>

      <WriteClient
        initialTitle={post.title}
        initialContent={post.content}
        postId={id}
      />
    </div>
  );
}
