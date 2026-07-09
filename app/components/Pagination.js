import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  perPage,
  totalCount,
  buildHref,
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const hrefFor = (page) =>
    buildHref ? buildHref({ page: String(page) }) : `/list?page=${page}`;

  const btnStyle =
    "inline-flex items-center gap-1 px-4 py-2 border border-border rounded-lg transition-colors text-sm font-medium";
  const activeStyle = "text-fg hover:bg-surface-2";
  const disabledStyle = "text-muted/50 cursor-not-allowed";

  return (
    <div className="mb-10 mt-16 flex w-full items-center justify-center gap-6">
      {hasPrev ? (
        <Link
          href={hrefFor(currentPage - 1)}
          className={`${btnStyle} ${activeStyle}`}
        >
          <ChevronLeft size={16} />
          이전
        </Link>
      ) : (
        <span className={`${btnStyle} ${disabledStyle}`}>
          <ChevronLeft size={16} />
          이전
        </span>
      )}

      <div className="flex items-center gap-1.5 text-sm text-muted">
        <span className="text-base font-semibold text-fg">{currentPage}</span>
        <span>/ {totalPages} 페이지</span>
      </div>

      {hasNext ? (
        <Link
          href={hrefFor(currentPage + 1)}
          className={`${btnStyle} ${activeStyle}`}
        >
          다음
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className={`${btnStyle} ${disabledStyle}`}>
          다음
          <ChevronRight size={16} />
        </span>
      )}
    </div>
  );
}
