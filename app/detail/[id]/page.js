import { connectToDb } from "../../../lib/utils";
import { Post } from "../../models/Post";

export default async function DetailPage({ params }) {
  await connectToDb();

  const { id } = await params;

  const post = await Post.findById(id);

  if (!post) {
    return <div>해당 게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-gray-500 mt-2">{post.createdAt.toLocaleString()}</p>
      <hr className="my-4" />
      <div className="text-lg leading-relaxed">{post.content}</div>
    </div>
  );
}
