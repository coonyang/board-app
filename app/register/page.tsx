import { registerUser } from "../actions/authActions";
import ErrorMessage from "../components/ErrorMessage";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">회원가입</h1>
      <ErrorMessage error={error} />

      <form action={registerUser} className="flex flex-col gap-3">
        <input
          name="username"
          placeholder="아이디"
          className="border p-2 rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          className="border p-2 rounded"
          required
        />

        <input
          name="nickname"
          className="border p-2 rounded"
          placeholder="닉네임"
        />

        <button type="submit" className="bg-black text-white p-2 rounded">
          가입
        </button>
      </form>
    </div>
  );
}
