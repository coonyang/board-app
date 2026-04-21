import { revalidatePath } from "next/cache";
import { connectToDb } from "../../../lib/utils";
import { Post } from "../../models/Post";
import Link from "next/link";
import { deletePost } from "../../actions/postActions";

export default async function DetailPage({ params }) {
  await connectToDb();

  const { id } = await params;

  const post = await Post.findById(id);

  if (!post) {
    return <div>해당 게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <div className="flex justify-between items-center text-gray-500">
        <p className="text-sm">{post.createdAt.toLocaleString()}</p>

        <div className="flex gap-4 items-center">
          <Link
            href={`/edit/${id}`}
            className="hover:text-blue-600 transition-colors text-sm font-medium"
          >
            수정
          </Link>

          <form action={deletePost.bind(null, id)}>
            <button
              type="submit"
              className="hover:text-red-600 transition-colors text-sm font-medium"
            >
              삭제
            </button>
          </form>
        </div>
      </div>
      <hr className="my-4" />
      <div className="text-lg leading-relaxed">{post.content}</div>
    </div>
  );
}
