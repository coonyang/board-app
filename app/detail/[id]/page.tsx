import { connectToDb } from "../../../lib/utils";
import { Post } from "../../models/Post";
import Link from "next/link";
import { deletePost } from "../../actions/postActions";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export default async function DetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  await connectToDb();

  const { id } = await params;

  const post = await Post.findById(id);

  if (!post) {
    return <div>해당 게시글을 찾을 수 없습니다.</div>;
  }

  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  let user = null;

  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        nickname: string;
        role: string;
      };
    } catch {
      user = null;
    }
  }

  return (
    <div className="p-8">
      <Link
        href="/list"
        className="inline-block mb-4 text-sm font-medium text-gray-600 hover:text-black"
      >
        ← 목록으로 돌아가기
      </Link>
      <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
      <div className="flex justify-between items-center text-gray-500">
        <p className="text-sm">{post.createdAt.toLocaleString()}</p>
        {(user?.userId === post.authorId || user?.role === "admin") && (
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
        )}
      </div>

      <hr className="my-4" />
      <div className="text-lg leading-relaxed">{post.content}</div>
    </div>
  );
}
