import { createPost } from "../actions/postActions";
import ErrorMessage from "../components/ErrorMessage";

export default async function Write({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="p-8">
      <ErrorMessage error={error} />
      <h2 className="text-2xl font-bold mb-4">새 글 작성</h2>
      <form action={createPost} className="flex flex-col gap-3">
        <input
          name="title"
          placeholder="제목을 입력해주세요"
          className="border p-2 rounded"
          required
        ></input>
        <textarea
          name="content"
          placeholder="내용을 입력해주세요"
          className="border p-2 rounded h-40"
          required
        ></textarea>
        <input
          type="file"
          name="image"
          accept="image/*"
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded font-bold"
        >
          발행하기
        </button>
      </form>
    </div>
  );
}
