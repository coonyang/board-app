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
    e.target.value = "";
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
      <label
        htmlFor="file-upload"
        className="cursor-pointer rounded p-2 border"
      >
        📁 파일 선택
      </label>
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between border p-2 mb-1 rounded"
            >
              <span className="text-sm">{file.name}</span>

              <button
                type="button"
                onClick={() =>
                  setFiles((prev) => prev.filter((_, idx) => idx !== i))
                }
                className="text-red-500 text-sm"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        id="file-upload"
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        placeholder="파일 선택"
        style={{ display: "none" }}
      />

      <button className="bg-blue-500 text-white p-2 rounded">발행하기</button>
    </form>
  );
}
