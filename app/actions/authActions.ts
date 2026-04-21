"use server";

import bcrypt from "bcrypt";
import { connectToDb } from "@/lib/utils";
import { User } from "../models/User";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const nickname = formData.get("nickname") as string;

  if (!username || !password) return;

  await connectToDb();

  const exists = await User.findOne({ username });

  if (exists) {
    throw new Error("이미 존재하는 아이디");
  }

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    username,
    password: hashed,
    nickname,
  });

  redirect("/login");
}
