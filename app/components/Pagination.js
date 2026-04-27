import Link from "next/link";

export default function Pagination({ currentPage, perPage, postCount }) {
  const hasPrev = currentPage > 1;

  const hasNext = postCount === perPage;

  const btnStyle = "px-4 py-2 border rounded-md transition-colors";
  const activeStyle = "hover:bg-gray-100";
  const disabledStyle = "text-gray-300 cursor-not-allowed";

  return (
    <div className="flex justify-center items-center gap-6 mt-16 mb-10 w-full">
      {hasPrev ? (
        <Link
          href={`/list?page=${currentPage - 1}`}
          className={`${btnStyle} ${activeStyle}`}
        >
          이전
        </Link>
      ) : (
        <span className={`${btnStyle} ${disabledStyle}`}>이전</span>
      )}

      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold dark:text-white">
          {currentPage}
        </span>
        <span className="dark:text-white">페이지</span>
      </div>

      {hasNext ? (
        <Link
          href={`/list?page=${currentPage + 1}`}
          className={`${btnStyle} ${activeStyle}`}
        >
          다음
        </Link>
      ) : (
        <span className={`${btnStyle} ${disabledStyle}`}>다음</span>
      )}
    </div>
  );
}
