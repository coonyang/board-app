"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { upload } from "@vercel/blob/client";

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
      <div className="border p-2 rounded">
        <div className="prose max-w-none min-h-[200px] ">
          <EditorContent editor={editor} />
        </div>
      </div>
      <label className="cursor-pointer border p-2 rounded inline-block mb-2">
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
