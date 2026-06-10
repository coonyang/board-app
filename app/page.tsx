import "./globals.css";

import { connectToDb } from "@/lib/utils";
import Banner from "./components/Banner";
import { Post } from "./models/Post";
import { Types } from "mongoose";
import { StatsCard } from "coonyang-library";
import { User } from "./models/User";

export type PostType = {
  _id: Types.ObjectId;

  authorId: string;

  title: string;
  content: string;

  likes: number;
  views: number;

  createdAt: Date;
  updatedAt: Date;
};

export default async function Home() {
  await connectToDb();

  const popularPosts = await Post.find().sort({ views: -1 }).limit(5);
  const latestPosts = await Post.find().sort({ createdAt: -1 }).limit(5);

  const postCount = await Post.countDocuments();
  const userCount = await User.countDocuments();

  return (
    <div className="p-8 space-y-8">
      <Banner />
      <div className="grid grid-cols-2 gap-4">
        <StatsCard title="게시글" value={postCount} icon={<span>📄</span>} />
        <StatsCard title="회원 수" value={userCount} icon={<span>👤</span>} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="space-y-3">
          <h2 className="text-xl font-bold">🔥 인기 게시글</h2>

          {popularPosts.map((post: PostType) => (
            <a
              key={post._id.toString()}
              href={`/detail/${post._id.toString()}`}
              className="block p-4 border rounded-xl hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <span>{post.title}</span>
                <span className="text-sm text-gray-400">
                  조회 {post.views ?? 0}
                </span>
              </div>
            </a>
          ))}
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold">최신 게시글</h2>

          {latestPosts.map((post: PostType) => (
            <a
              key={post._id.toString()}
              href={`/detail/${post._id.toString()}`}
              className="block p-4 border rounded-xl hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <span>{post.title}</span>
              </div>
            </a>
          ))}
        </section>
      </div>
    </div>
  );
}
