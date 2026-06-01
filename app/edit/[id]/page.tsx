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
    <div className="p-8 max-w-2xl mx-auto">
      <ErrorMessage error={error} />

      <h1 className="text-3xl font-bold mb-6">게시글 수정</h1>

      <WriteClient
        initialTitle={post.title}
        initialContent={post.content}
        postId={id}
      />
    </div>
  );
}
