import { connectToDb } from "../../../lib/utils";
import { Post } from "../../models/Post";
import { User } from "../../models/User";
import Link from "next/link";
import {
  deletePost,
  createComment,
  deleteComment,
  likePost,
} from "../../actions/postActions";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import {
  ArrowLeft,
  Heart,
  MessageSquare,
  Pencil,
  Trash2,
} from "lucide-react";
import ErrorMessage from "../../components/ErrorMessage";
import { isMyToken } from "@/lib/auth";
import { Comment } from "../../models/Comment";
import ViewTracker from "@/app/components/ViewTracker";
import LevelBadge from "@/app/components/LevelBadge";

export const dynamic = "force-dynamic";

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

  if (!post) {
    return (
      <div className="p-8 text-center text-muted">
        해당 게시글을 찾을 수 없습니다.
      </div>
    );
  }

  const comments = await Comment.find({ postId: id }).sort({ createdAt: -1 });

  const commentAuthorIds = [...new Set(comments.map((c) => c.authorId))];
  const commentAuthors = await User.find({
    _id: { $in: commentAuthorIds },
  }).select("level");
  const commentAuthorLevels = new Map(
    commentAuthors.map((a) => [a._id.toString(), a.level ?? 1]),
  );

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
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

  const isLiked = user ? post.likedBy?.includes(user.userId) : false;

  return (
    <div className="mx-auto max-w-4xl p-4">
      <ViewTracker postId={id} />
      <ErrorMessage error={error} />

      <Link
        href="/list"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft size={15} />
        목록으로 돌아가기
      </Link>

      <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <span className="mb-2 inline-block rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
          {post.category ?? "자유"}
        </span>
        <h1 className="mb-4 text-4xl font-extrabold text-fg">{post.title}</h1>

        <div className="mb-6 flex items-center justify-between border-b border-border pb-4 text-muted">
          <p className="text-sm">작성일: {post.createdAt.toLocaleString()}</p>

          <div className="flex items-center gap-4">
            <form action={likePost.bind(null, post._id.toString())}>
              <button
                type="submit"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isLiked ? "text-danger" : "hover:text-danger"
                }`}
              >
                <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                {post.likes ?? 0}
              </button>
            </form>
            {(user?.userId === post.authorId || user?.role === "admin") && (
              <div className="flex items-center gap-3">
                <Link
                  href={`/edit/${id}`}
                  className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-accent"
                >
                  <Pencil size={15} />
                  수정
                </Link>

                <form action={deletePost.bind(null, id)}>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-danger"
                  >
                    <Trash2 size={15} />
                    삭제
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 min-h-[200px] text-lg leading-relaxed">
          <div
            className="prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 text-xl font-bold text-fg">
            <MessageSquare size={18} />
            댓글 ({comments.length})
          </h3>

          {comments.map((comment) => (
            <div
              key={comment._id.toString()}
              className="border-b border-border pb-4"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="flex items-center text-sm font-bold text-fg">
                  <LevelBadge
                    level={commentAuthorLevels.get(comment.authorId) ?? 1}
                  />
                  {comment.nickname}
                </span>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-muted">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>

                  {(user?.userId === comment.authorId ||
                    user?.role === "admin") && (
                    <form
                      action={deleteComment.bind(
                        null,
                        comment._id.toString(),
                        id,
                      )}
                    >
                      <button
                        type="submit"
                        className="flex items-center gap-1 text-xs font-medium text-muted transition-colors hover:text-danger"
                      >
                        <Trash2 size={12} />
                        삭제
                      </button>
                    </form>
                  )}
                </div>
              </div>

              <p className="text-fg/90">{comment.content}</p>
            </div>
          ))}

          {comments.length === 0 && (
            <p className="text-muted">등록된 댓글이 없습니다.</p>
          )}
        </div>
        <h3 className="mb-4 mt-6 text-xl font-bold text-fg">댓글 작성</h3>
        <form action={createCommentWithId} className="flex flex-col gap-3">
          <textarea
            name="content"
            className="w-full rounded-lg border border-border bg-bg p-4 text-fg outline-none placeholder:text-muted focus:ring-2 focus:ring-accent"
            placeholder={user ? "댓글을 입력하세요." : "로그인이 필요합니다."}
            rows={3}
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-accent px-6 py-2 font-medium text-accent-fg transition-colors hover:bg-accent-hover"
            >
              댓글 등록
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
