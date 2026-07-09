import ErrorMessage from "../components/ErrorMessage";
import WriteClient from "../components/WriteClient";
import { cookies } from "next/headers";

export default async function Write({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  return (
    <div className="mx-auto max-w-2xl p-8">
      {!token ? (
        <ErrorMessage error="need-login" />
      ) : (
        <>
          <ErrorMessage error={error} />
          <h2 className="mb-4 text-2xl font-bold text-fg">새 글 작성</h2>
          <WriteClient />
        </>
      )}
    </div>
  );
}
