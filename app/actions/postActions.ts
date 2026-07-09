"use server";

import { connectToDb } from "@/lib/utils";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { del } from "@vercel/blob";
import { cookies } from "next/headers";

export async function createPost(formData: FormData) {
  const user = await requireUser();

  const title = formData.get("title");
  const content = formData.get("content");
  const category = formData.get("category");
  const imageUrlsRaw = formData.get("imageUrls");
  if (
    typeof title !== "string" ||
    typeof content !== "string" ||
    !title ||
    !content
  ) {
    redirect("/write?error=need-input");
  }

  const imageUrls = imageUrlsRaw ? JSON.parse(imageUrlsRaw as string) : [];

  await connectToDb();
  await Post.create({
    title,
    content,
    category: typeof category === "string" && category ? category : "자유",
    authorId: user.userId,
    imageUrls,
  });

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

  if (post.imageUrls && post.imageUrls.length > 0) {
    try {
      await Promise.all(post.imageUrls.map((url: string) => del(url)));
    } catch (err) {
      console.error("Blob 삭제 실패:", err);
    }
  }
  await Comment.deleteMany({ postId: id });
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

export async function increaseView(postId: string) {
  await connectToDb();

  const cookieStore = await cookies();

  const viewed = cookieStore.get(`viewed-${postId}`);

  if (viewed) return;

  await Post.updateOne(
    { _id: postId },
    {
      $inc: { views: 1 },
    },
  );

  cookieStore.set(`viewed-${postId}`, "true", {
    maxAge: 60 * 60,
  });
}

export async function likePost(postId: string) {
  const user = await requireUser();

  await connectToDb();

  const post = await Post.findById(postId);

  if (!post) return;

  const alreadyLiked = post.likedBy.includes(user.userId);

  if (alreadyLiked) {
    // 좋아요 취소
    await Post.findByIdAndUpdate(postId, {
      $inc: { likes: -1 },
      $pull: { likedBy: user.userId },
    });
  } else {
    // 좋아요 추가
    await Post.findByIdAndUpdate(postId, {
      $inc: { likes: 1 },
      $push: { likedBy: user.userId },
    });
  }

  revalidatePath(`/detail/${postId}`);
}
