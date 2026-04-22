import { connectToDb } from "../../../lib/utils";
import { Post } from "../../models/Post";
import Link from "next/link";
import { deletePost, createComment } from "../../actions/postActions"; // 경로 확인
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import ErrorMessage from "../../components/ErrorMessage";
import { isMyToken } from "@/lib/auth";
import { Comment } from "../../models/Comment";

export default async function DetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  await connectToDb();
  const post = await Post.findById(id);
  const comments = await Comment.find({ postId: id }).sort({ createdAt: -1 });

  if (!post) {
    return (
      <div className="p-8 text-center">해당 게시글을 찾을 수 없습니다.</div>
    );
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
    } catch {
      user = null;
    }
  }

  const createCommentWithId = createComment.bind(null, id);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <ErrorMessage error={error} />

      <Link
        href="/list"
        className="inline-block mb-4 text-sm text-gray-500 hover:text-black transition-colors"
      >
        ← 목록으로 돌아가기
      </Link>

      <h1 className="text-4xl font-extrabold mb-4">{post.title}</h1>

      <div className="flex justify-between items-center text-gray-400 mb-6 pb-4 border-b">
        <p className="text-sm">작성일: {post.createdAt.toLocaleString()}</p>

        {(user?.userId === post.authorId || user?.role === "admin") && (
          <div className="flex gap-4">
            <Link
              href={`/edit/${id}`}
              className="text-sm font-semibold hover:text-blue-500 transition-colors"
            >
              수정
            </Link>
            <form action={deletePost.bind(null, id)}>
              <button
                type="submit"
                className="text-sm font-semibold hover:text-red-500 transition-colors"
              >
                삭제
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="text-lg leading-relaxed mb-12 min-h-[200px]">
        {post.content}
      </div>

      <hr className="my-8" />

      <section>
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-bold">댓글 ({comments.length})</h3>

          {comments.map((comment) => (
            <div key={comment._id.toString()} className="border-b pb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm">{comment.nickname}</span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}

          {comments.length === 0 && (
            <p className="text-gray-400">등록된 댓글이 없습니다.</p>
          )}
        </div>
        <h3 className="text-xl font-bold mb-4 mt-4">댓글 작성</h3>
        <form action={createCommentWithId} className="flex flex-col gap-3">
          <textarea
            name="content"
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder={user ? "댓글을 입력하세요." : "로그인이 필요합니다."}
            rows={3}
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              댓글 등록
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
