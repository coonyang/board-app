import ErrorMessage from "../components/ErrorMessage";
import WriteClient from "../components/WriteClient";

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

      <WriteClient />
    </div>
  );
}
