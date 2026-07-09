"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const Editor = dynamic(() => import("./Editor"), {
  ssr: false,
});

export default function WriteClient({
  initialTitle = "",
  initialContent = "",
  postId,
}: {
  initialTitle?: string;
  initialContent?: string;
  postId?: string;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = postId ? `/api/post/${postId}` : "/api/post";

    const method = postId ? "PUT" : "POST";

    const res = await fetchWithAuth(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
      }),
    });

    if (!res.ok) {
      alert("제목과 내용을 입력해주세요");
      return;
    }

    const data = await res.json();

    window.location.href = postId ? `/detail/${postId}` : `/detail/${data._id}`;
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
        className="rounded-lg border border-border bg-bg p-3 text-fg outline-none transition-all placeholder:text-muted focus:ring-2 focus:ring-accent"
      />

      <Editor content={content} setContent={setContent} />

      <button className="rounded-lg bg-accent p-3 font-bold text-accent-fg transition-colors hover:bg-accent-hover">
        {postId ? "수정 완료" : "발행하기"}
      </button>
    </form>
  );
}
