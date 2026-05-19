"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

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

    const res = await fetch(url, {
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
        className="border p-2 rounded"
      />

      <Editor content={content} setContent={setContent} />

      <button className="bg-blue-500 text-white p-2 rounded">
        {postId ? "수정 완료" : "발행하기"}
      </button>
    </form>
  );
}
