import "./globals.css";

import { connectToDb } from "@/lib/utils";

export default async function Home() {
  await connectToDb();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">연결 확인 중...</h1>
      <p>터미널에 '연결상태: 1'이 뜨는지 확인해보세요!</p>
    </div>
  );
}
