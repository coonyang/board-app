"use server";

import { connectToDb } from "@/lib/utils";
import { Post } from "../models/Post";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Comment } from "../models/Comment";

export async function createPost(formData: FormData) {
  const title = formData.get("title");
  const content = formData.get("content");
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login?error=need-login");
  }

  let user;

  try {
    user = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      nickname: string;
    };
  } catch {
    redirect("/login?error=invalid-login2");
  }

  if (!title || !content) {
    redirect("/write?error=need-input");
  }

  await connectToDb();

  await Post.create({ title, content, authorId: user.userId });

  revalidatePath("/list");
  redirect("/list");
}

export async function updatePost(id: string, formData: FormData) {
  const title = formData.get("title");
  const content = formData.get("content");

  if (!title || !content) {
    redirect(`/edit/${id}?error=need-input`);
  }

  await connectToDb();

  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login?error=need-login");
  }

  const user = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: string;
    nickname: string;
    role: string;
  };

  const post = await Post.findById(id);

  if (!post) {
    redirect("/list?error=not-found");
  }

  if (post.authorId !== user.userId) {
    redirect(`/detail/${id}?error=forbidden`);
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
    redirect("/login?error=need-login");
  }

  const user = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: string;
    nickname: string;
    role: string;
  };

  const post = await Post.findById(id);

  if (!post) {
    redirect("/list?error=not-found");
  }

  if (post.authorId !== user.userId && user.role !== "admin") {
    redirect(`/detail/${id}?error=forbidden`);
  }

  await Post.findByIdAndDelete(id);

  revalidatePath("/list");
  redirect("/list");
}

export async function createComment(postId: string, formData: FormData) {
  const content = formData.get("content");

  if (!content) {
    redirect(`/detail/${postId}?error=need-input`);
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect(`/detail/${postId}?error=need-login`);
  }

  const user = jwt.verify(token, process.env.JWT_SECRET!) as unknown as {
    userId: string;
    nickname: string;
    role?: string;
  };

  await connectToDb();

  await Comment.create({
    postId,
    authorId: user.userId,
    nickname: user.nickname,
    content,
  });
  revalidatePath(`/detail/${postId}`);
}
