"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function DarkMode({ currentTheme }: { currentTheme: string }) {
  const router = useRouter();

  const toggleTheme = () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    Cookies.set("theme", newTheme, { expires: 365 });

    router.refresh();
  };

  return (
    <button onClick={toggleTheme}>
      {currentTheme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
