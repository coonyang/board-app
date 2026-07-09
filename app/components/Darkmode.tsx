"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";

export default function DarkMode({ currentTheme }: { currentTheme: string }) {
  const router = useRouter();
  const isDark = currentTheme === "dark";

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";

    Cookies.set("theme", newTheme, { expires: 365 });

    router.refresh();
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:bg-surface-2 hover:text-fg"
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
