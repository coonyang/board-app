import { loginUser } from "../actions/authActions";
import Link from "next/link";
import ErrorMessage from "../components/ErrorMessage";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="p-8 max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center tracking-tighter">
          로그인
        </h1>
        <ErrorMessage error={error} />
        <form action={loginUser} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">아이디</label>
            <input
              name="username"
              type="text"
              placeholder="아이디를 입력하세요"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white p-3 rounded-lg font-bold hover:bg-gray-800 transition-colors mt-2"
          >
            로그인
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          계정이 없으신가요?{" "}
          <Link
            href="/register"
            className="text-black font-bold hover:underline"
          >
            회원가입 하러가기
          </Link>
        </div>
      </div>
    </div>
  );
}
