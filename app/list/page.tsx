import { connectToDb } from "@/lib/utils";
import { Post } from "@/app/models/Post";
import Link from "next/link";
import { Search } from "lucide-react";
import { PostCard, WriteButton } from "coonyang-library";
import Pagination from "../components/Pagination";
import { POST_CATEGORIES } from "@/lib/postCategories";

const SORTS: Record<string, Record<string, 1 | -1>> = {
  latest: { createdAt: -1 },
  popular: { likes: -1 },
  views: { views: -1 },
};

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default async function List({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    sort?: string;
    category?: string;
  }>;
}) {
  await connectToDb();

  const params = await searchParams;
  const parsedPage = Number(params.page ?? 1);
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage >= 1 ? Math.floor(parsedPage) : 1;
  const perPage = 10;
  const q = params.q?.trim() ?? "";
  const sort = SORTS[params.sort ?? ""] ? params.sort! : "latest";
  const category = (POST_CATEGORIES as readonly string[]).includes(
    params.category ?? "",
  )
    ? params.category
    : undefined;

  const filter: Record<string, unknown> = {};
  if (q) {
    const safeQ = escapeRegex(q);
    filter.$or = [
      { title: { $regex: safeQ, $options: "i" } },
      { content: { $regex: safeQ, $options: "i" } },
    ];
  }
  if (category) {
    filter.category = category;
  }

  const [posts, totalCount] = await Promise.all([
    Post.find(filter)
      .sort(SORTS[sort])
      .skip((currentPage - 1) * perPage)
      .limit(perPage),
    Post.countDocuments(filter),
  ]);

  const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, "");
  const hasImage = (html: string) => html.includes("<img");

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    const merged = { q, sort, category, page: undefined, ...overrides };
    if (merged.q) next.set("q", merged.q);
    if (merged.sort && merged.sort !== "latest") next.set("sort", merged.sort);
    if (merged.category) next.set("category", merged.category);
    if (merged.page && merged.page !== "1") next.set("page", merged.page);
    const qs = next.toString();
    return `/list${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-fg">게시판 목록</h1>
        <Link href="/write">
          <WriteButton>글쓰기</WriteButton>
        </Link>
      </div>

      <form className="flex flex-wrap items-center gap-2" action="/list">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="제목/내용 검색"
            className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-fg outline-none placeholder:text-muted focus:ring-2 focus:ring-accent"
          />
        </div>
        {category && <input type="hidden" name="category" value={category} />}
        <select
          name="sort"
          defaultValue={sort}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="latest">최신순</option>
          <option value="popular">인기순</option>
          <option value="views">조회순</option>
        </select>
        <button
          type="submit"
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface-2"
        >
          검색
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Link
          href={buildHref({ category: undefined })}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            !category
              ? "bg-accent text-accent-fg"
              : "border border-border text-muted hover:text-fg"
          }`}
        >
          전체
        </Link>
        {POST_CATEGORIES.map((c) => (
          <Link
            key={c}
            href={buildHref({ category: c })}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              category === c
                ? "bg-accent text-accent-fg"
                : "border border-border text-muted hover:text-fg"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="grid gap-4">
        {posts.length === 0 ? (
          <p className="text-muted">
            {q || category
              ? "검색 결과가 없습니다."
              : "등록된 글이 없습니다. 첫 글을 작성해보세요!"}
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
      <Pagination
        currentPage={currentPage}
        perPage={perPage}
        totalCount={totalCount}
        buildHref={buildHref}
      />
    </div>
  );
}
