import "./globals.css";

import { connectToDb } from "@/lib/utils";
import Banner from "./components/Banner";
import { Post } from "./models/Post";

export default async function Home() {
  await connectToDb();

  const popularPosts = await Post.find().sort({ views: -1 }).limit(5);

  return (
    <div className="p-8 space-y-8">
      <Banner />

      <div className="p-4 space-y-6">
        <h2 className="text-xl font-bold">🔥 인기 게시글</h2>

        <div className="space-y-3">
          {popularPosts.map((post: any) => (
            <a
              key={post._id}
              href={`/detail/${post._id}`}
              className="block p-4 border rounded-xl hover:shadow-md hover:border-gray-300 transition"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{post.title}</span>
                <span className="text-sm text-gray-400">
                  조회 {post.views ?? 0}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
