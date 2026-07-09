import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Link from "next/link";
import { LogIn, UserPlus, Users } from "lucide-react";
import PlazaClient from "./components/plaza/PlazaClient";
import { isMyToken } from "@/lib/auth";

export default async function Home() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  let user: { userId: string; nickname: string } | null = null;

  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET || "");
      if (isMyToken(decoded)) {
        user = { userId: decoded.userId, nickname: decoded.nickname };
      }
    } catch {
      user = null;
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
          <Users size={32} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-fg">만남의 광장</h1>
          <p className="text-muted">
            로그인하면 캐릭터를 움직이고 실시간으로 채팅할 수 있어요.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface-2"
          >
            <LogIn size={16} />
            로그인
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover"
          >
            <UserPlus size={16} />
            회원가입
          </Link>
        </div>
      </div>
    );
  }

  return <PlazaClient userId={user.userId} nickname={user.nickname} />;
}
