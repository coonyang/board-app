"use server";

import { connectToDb } from "@/lib/utils";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export async function createPost(formData: FormData) {
  const user = await requireUser();

  const title = formData.get("title");
  const content = formData.get("content");

  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    !title ||
    !content
  ) {
    redirect("/write?error=need-input");
  }

  await connectToDb();
  await Post.create({ title, content, authorId: user.userId });

  revalidatePath("/list");
  redirect("/list");
}

export async function updatePost(id: string, formData: FormData) {
  const user = await requireUser();

  const title = formData.get("title");
  const content = formData.get("content");

  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    !title ||
    !content
  ) {
    redirect(`/edit/${id}?error=need-input`);
  }

  await connectToDb();
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
  const user = await requireUser();

  await connectToDb();
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
  const user = await requireUser();
  const content = formData.get("content");

  if (typeof content !== "string" || !content || content.trim() === "") {
    redirect(`/detail/${postId}?error=need-input`);
  }

  await connectToDb();

  await Comment.create({
    postId,
    authorId: user.userId,
    nickname: user.nickname,
    content,
  });

  revalidatePath(`/detail/${postId}`);
}

export async function deleteComment(commentId: string, postId: string) {
  const user = await requireUser();
  await connectToDb();

  const comment = await Comment.findById(commentId);
  if (!comment) return;

  if (comment.authorId !== user.userId && user.role !== "admin") {
    redirect(`/detail/${postId}?error=forbidden`);
  }

  await Comment.findByIdAndDelete(commentId);
  revalidatePath(`/detail/${postId}`);
}
