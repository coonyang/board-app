import "./globals.css";

import { connectToDb } from "@/lib/utils";
import Banner from "./components/Banner";

export default async function Home() {
  await connectToDb();

  return (
    <div className="p-8 space-y-8">
      <Banner />

      {/* 헤더 영역 */}
      <div>
        <h1 className="text-3xl font-bold">환영합니다!!</h1>
        <p className="text-gray-600 mt-1">게시판 사이트 입니다.</p>
      </div>

      {/* 인기 게시글 */}
      <section className="mt-6">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl font-bold">🔥 인기 게시글</h2>
          <span className="text-sm text-gray-400 cursor-pointer hover:text-gray-600">
            더보기 →
          </span>
        </div>

        <div className="grid gap-3">
          {/* 임시 데이터 (나중에 DB로 교체) */}
          {[
            { title: "Next.js 15 정리", views: 120 },
            { title: "React 상태관리 비교", views: 98 },
            { title: "게시판 UI 개선 후기", views: 76 },
          ].map((post, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <span className="font-medium">{post.title}</span>
              <span className="text-sm text-gray-400">조회 {post.views}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
