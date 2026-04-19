import { createPost } from "../actions/postActions";

export default function Write() {
  return (
    <div className="p-8">
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
