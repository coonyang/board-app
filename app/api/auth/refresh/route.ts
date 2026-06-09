import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@/app/models/User";
import { connectToDb } from "@/lib/utils";

export async function POST() {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  await connectToDb();

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as any;

  const user = await User.findById(decoded.userId);

  if (!user || user.refreshToken !== refreshToken) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const newAccessToken = jwt.sign(
    {
      userId: user._id.toString(),
      nickname: user.nickname,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "15m",
    },
  );

  cookieStore.set("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return Response.json({ success: true });
}
