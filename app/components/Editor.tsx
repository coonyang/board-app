"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { upload } from "@vercel/blob/client";
import { useEffect } from "react";
export default function Editor({
  content,
  setContent,
}: {
  content: string;
  setContent: (value: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content,
    immediatelyRender: false,
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const addImage = async (file: File) => {
    const blob = await upload(`${crypto.randomUUID()}-${file.name}`, file, {
      access: "public",
      handleUploadUrl: "/api/upload-url",
    });

    editor?.chain().focus().setImage({ src: blob.url }).run();
  };

  if (!editor) return null;

  return (
    <>
      <div className="rounded-lg border border-border bg-bg p-3">
        <div className="prose prose-neutral dark:prose-invert min-h-[200px] max-w-none">
          <EditorContent editor={editor} />
        </div>
      </div>
      <label className="mb-2 inline-block cursor-pointer rounded-lg border border-border px-3 py-2 text-sm text-fg transition-colors hover:bg-surface-2">
        이미지 추가
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) addImage(file);
          }}
        />
      </label>
    </>
  );
}
