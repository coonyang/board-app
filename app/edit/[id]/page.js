import { connectToDb } from "../../../lib/utils";
import { Post } from "../../models/Post";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { updatePost } from "../../actions/postActions";

export default async function EditPage({ params }) {
  await connectToDb();
  const { id } = await params;
  const post = await Post.findById(id);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">게시글 수정</h1>

      <form action={updatePost.bind(null, id)} className="flex flex-col gap-4">
        <div>
          <label className="block mb-2 font-semibold">제목</label>
          <input
            type="text"
            name="title"
            defaultValue={post.title}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">내용</label>
          <textarea
            name="content"
            defaultValue={post.content}
            rows={10}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            수정 완료
          </button>

          <Link
            href={`/detail/${id}`}
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 text-center"
          >
            취소
          </Link>
        </div>
      </form>
    </div>
  );
}
