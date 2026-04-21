"use server";

import { connectToDb } from "@/lib/utils";
import { Post } from "../models/Post";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const title = formData.get("title");
  const content = formData.get("content");

  if (!title || !content) return;

  await connectToDb();

  await Post.create({ title, content });

  revalidatePath("/list");
  redirect("/list");
}

export async function deletePost(id: string) {
  await connectToDb();

  await Post.findByIdAndDelete(id);

  revalidatePath("/list");
  redirect("/list");
}
