import { connectToDb } from "@/lib/utils";
import { Post } from "@/app/models/Post";
import Link from "next/link";
import Pagination from "../components/Pagination";

export default async function List({ searchParams }) {
  await connectToDb();

  const search = await searchParams;
  const currentPage = Number(search?.page) || 1;
  const perPage = 10;
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * perPage)
    .limit(perPage);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">게시판 목록</h1>
        <Link
          href="/write"
          className="bg-black text-white px-4 py-2 rounded-md font-bold"
        >
          글쓰기
        </Link>
      </div>

      <div className="grid gap-4">
        {posts.length === 0 ? (
          <p className="text-gray-500">
            등록된 글이 없습니다. 첫 글을 작성해보세요!
          </p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id.toString()}
              className="relative border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Link
                href={`/detail/${post._id}`}
                className="text-xl font-bold hover:underline"
              >
                {post.title}
              </Link>
              <Link
                href={`/edit/${post._id}`}
                className="absolute top-4 right-4 text-sm text-gray-400 hover:text-blue-600 border border-gray-200 px-2 py-1 rounded"
              >
                수정
              </Link>
              <p className="text-gray-600 mt-2 line-clamp-2">{post.content}</p>
            </div>
          ))
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        perPage={perPage}
        postCount={posts.length}
      />
    </div>
  );
}
