import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, Heart, MessageSquare } from "lucide-react";
import { StatsCard, PostCard } from "coonyang-library";
import { connectToDb } from "@/lib/utils";
import { requireUser } from "@/lib/auth";
import { Post } from "@/app/models/Post";
import { Comment } from "@/app/models/Comment";
import { User } from "@/app/models/User";

const TABS = [
  { key: "posts", label: "내가 쓴 글" },
  { key: "comments", label: "내가 쓴 댓글" },
  { key: "liked", label: "좋아요 한 글" },
] as const;

const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, "");
const hasImage = (html: string) => html.includes("<img");

export default async function MyPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await requireUser();
  const { tab: tabParam } = await searchParams;
  const tab = TABS.some((t) => t.key === tabParam) ? tabParam! : "posts";

  await connectToDb();

  const [profile, postCount, commentCount, likesAgg] = await Promise.all([
    User.findById(user.userId),
    Post.countDocuments({ authorId: user.userId }),
    Comment.countDocuments({ authorId: user.userId }),
    Post.aggregate([
      { $match: { authorId: user.userId } },
      { $group: { _id: null, total: { $sum: "$likes" } } },
    ]),
  ]);

  if (!profile) {
    redirect("/login");
  }

  const totalLikes = likesAgg[0]?.total ?? 0;

  let posts: any[] = [];
  let comments: any[] = [];

  if (tab === "posts") {
    posts = await Post.find({ authorId: user.userId })
      .sort({ createdAt: -1 })
      .limit(30);
  } else if (tab === "liked") {
    posts = await Post.find({ likedBy: user.userId })
      .sort({ createdAt: -1 })
      .limit(30);
  } else {
    comments = await Comment.find({ authorId: user.userId })
      .sort({ createdAt: -1 })
      .limit(30);
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4">
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-fg">
            {profile.nickname.slice(0, 1)}
          </div>
          <div>
            <p className="text-lg font-bold text-fg">
              {profile.nickname}
              {profile.role === "admin" && (
                <span className="ml-2 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                  관리자
                </span>
              )}
            </p>
            <p className="text-sm text-muted">
              @{profile.username} · {new Date(profile.createdAt).toLocaleDateString()}{" "}
              가입
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard title="작성한 글" value={postCount} icon={<FileText />} />
        <StatsCard title="받은 좋아요" value={totalLikes} icon={<Heart />} />
        <StatsCard title="작성한 댓글" value={commentCount} icon={<MessageSquare />} />
      </div>

      <div className="flex gap-2 border-b border-border">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/mypage?tab=${t.key}`}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? "border-b-2 border-accent text-fg"
                : "text-muted hover:text-fg"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="grid gap-4">
        {tab === "comments" ? (
          comments.length === 0 ? (
            <p className="text-muted">작성한 댓글이 없습니다.</p>
          ) : (
            comments.map((c) => (
              <Link
                key={c._id.toString()}
                href={`/detail/${c.postId}`}
                className="rounded-xl border border-border bg-surface p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <p className="text-fg">{c.content}</p>
                <p className="mt-2 text-xs text-muted">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </Link>
            ))
          )
        ) : posts.length === 0 ? (
          <p className="text-muted">
            {tab === "liked"
              ? "좋아요 한 글이 없습니다."
              : "작성한 글이 없습니다."}
          </p>
        ) : (
          posts.map((post) => (
            <Link key={post._id.toString()} href={`/detail/${post._id}`}>
              <PostCard
                title={post.title}
                excerpt={stripHtml(post.content)}
                category={post.category}
                hasImage={hasImage(post.content)}
                views={post.views ?? 0}
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
