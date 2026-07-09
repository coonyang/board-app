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
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="mb-6 text-center text-3xl font-bold tracking-tight text-fg">
          로그인
        </h1>
        <ErrorMessage error={error} />
        <form action={loginUser} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-muted">아이디</label>
            <input
              name="username"
              type="text"
              placeholder="아이디를 입력하세요"
              className="rounded-lg border border-border bg-bg p-3 text-fg outline-none transition-all placeholder:text-muted focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-muted">비밀번호</label>
            <input
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              className="rounded-lg border border-border bg-bg p-3 text-fg outline-none transition-all placeholder:text-muted focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded-lg bg-accent p-3 font-bold text-accent-fg transition-colors hover:bg-accent-hover"
          >
            로그인
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted">
          계정이 없으신가요?{" "}
          <Link
            href="/register"
            className="font-bold text-accent hover:underline"
          >
            회원가입 하러가기
          </Link>
        </div>
      </div>
    </div>
  );
}
