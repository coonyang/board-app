"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";

export default function WriteClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const uploadImages = async (files: File[]) => {
    return await Promise.all(
      files.map(async (file) => {
        const blob = await upload(`${crypto.randomUUID()}-${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload-url",
        });
        return blob.url;
      }),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const imageUrls = await uploadImages(files);

    await fetch("/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        imageUrls,
      }),
    });

    window.location.href = "/list";
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
        className="border p-2 rounded"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용"
        className="border p-2 rounded h-40"
      />

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <button className="bg-blue-500 text-white p-2 rounded">발행하기</button>
    </form>
  );
}
