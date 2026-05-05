import ErrorMessage from "../components/ErrorMessage";
import WriteClient from "../components/WriteClient";
import { cookies } from "next/headers";

export default async function Write({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const error = searchParams?.error;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return (
    <div className="p-8">
      {!token ? (
        <ErrorMessage error="need-login" />
      ) : (
        <>
          <ErrorMessage error={error} />
          <h2 className="text-2xl font-bold mb-4">새 글 작성</h2>
          <WriteClient />
        </>
      )}
    </div>
  );
}
