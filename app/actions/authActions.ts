"use server";

import bcrypt from "bcrypt";
import { connectToDb } from "@/lib/utils";
import { User } from "../models/User";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function registerUser(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const nickname = formData.get("nickname") as string;

  if (!username || !password) return;

  await connectToDb();

  const exists = await User.findOne({ username });

  if (exists) {
    redirect("/register?error=exists");
  }

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    username,
    password: hashed,
    nickname,
  });

  redirect("/login");
}

export async function loginUser(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    redirect("/login?error=invalid-login");
  }

  await connectToDb();

  const user = await User.findOne({ username });
  if (!user) {
    redirect("/login?error=not-found");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    redirect("/login?error=wrong-password");
  }

  // console.log(`${user.nickname}님 로그인 성공!`);
  const token = jwt.sign(
    {
      userId: user._id.toString(),
      nickname: user.nickname,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" },
  );

  const cookieStore = await cookies();

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/");
}
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/login");
}
