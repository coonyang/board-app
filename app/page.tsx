import "./globals.css";

import { connectToDb } from "@/lib/utils";

export default async function Home() {
  await connectToDb();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">환영합니다!!</h1>
      <p>게시판 사이트 입니다.</p>
    </div>
  );
}
