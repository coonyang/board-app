"use server";

import bcrypt from "bcrypt";
import { connectToDb } from "@/lib/utils";
import { User } from "../models/User";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function registerUser(formData: FormData) {
  const username = (formData.get("username") as string).trim();
  const password = formData.get("password") as string;
  const nickname = (formData.get("nickname") as string)?.trim() || username;
  const valid = /^[a-zA-Z0-9가-힣]{2,}$/.test(username);
  if (!valid) {
    redirect("/register?error=invalid-username");
  }

  if (/[ㄱ-ㅎㅏ-ㅣ]/.test(username)) {
    redirect("/register?error=invalid-username");
  }

  if (!/[a-zA-Z가-힣]/.test(username)) {
    redirect("/register?error=invalid-username");
  }

  if (!username || !password) return;

  if (/\s/.test(password)) {
    redirect("/register?error=invalid-password");
  }

  if (username.length < 2) {
    redirect("/register?error=username-too-short");
  }

  if (password.length < 6) {
    redirect("/register?error=password-too-short");
  }

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
  const accessToken = jwt.sign(
    {
      userId: user._id.toString(),
      nickname: user.nickname,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    {
      userId: user._id.toString(),
      nickname: user.nickname,
      role: user.role,
    },
    process.env.REFRESH_SECRET!,
    { expiresIn: "30d" },
  );

  user.refreshToken = refreshToken;
  await user.save();

  const cookieStore = await cookies();

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  redirect("/");
}
export async function logoutUser() {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (refreshToken) {
    await connectToDb();

    await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
  }

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  redirect("/login");
}
