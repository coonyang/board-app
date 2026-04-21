"use server";

import { connectToDb } from "@/lib/utils";
import { Post } from "../models/Post";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function createPost(formData: FormData) {
  const title = formData.get("title");
  const content = formData.get("content");
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("로그인 필요");
  }

  let user;

  try {
    user = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      nickname: string;
    };
  } catch {
    throw new Error("유효하지 않은 로그인");
  }

  if (!title || !content) return;

  await connectToDb();

  await Post.create({ title, content, authorId: user.userId });

  revalidatePath("/list");
  redirect("/list");
}

export async function updatePost(id: string, formData: FormData) {
  const title = formData.get("title");
  const content = formData.get("content");

  if (!title || !content) {
    throw new Error("입력 필요");
  }

  await connectToDb();

  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("로그인 필요");
  }

  const user = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: string;
    nickname: string;
    role: string;
  };

  const post = await Post.findById(id);

  if (!post) {
    throw new Error("게시글 없음");
  }

  if (post.authorId !== user.userId) {
    throw new Error("수정 권한 없음");
  }

  await Post.findByIdAndUpdate(id, { title, content });

  revalidatePath(`/detail/${id}`);
  redirect(`/detail/${id}`);
}

export async function deletePost(id: string) {
  await connectToDb();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("로그인 필요");
  }

  const user = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: string;
    nickname: string;
    role: string;
  };

  const post = await Post.findById(id);

  if (!post) {
    throw new Error("게시글 없음");
  }

  if (post.authorId !== user.userId && user.role !== "admin") {
    throw new Error("권한 없음");
  }

  await Post.findByIdAndDelete(id);

  revalidatePath("/list");
  redirect("/list");
}
