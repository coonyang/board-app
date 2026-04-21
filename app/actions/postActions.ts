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

export async function deletePost(id: string) {
  await connectToDb();

  await Post.findByIdAndDelete(id);

  revalidatePath("/list");
  redirect("/list");
}
