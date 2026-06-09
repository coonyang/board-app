import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import { connectToDb } from "@/lib/utils";
import { User } from "@/app/models/User";

export interface MyToken extends JwtPayload {
  userId: string;
  nickname: string;
  role?: string;
}

export function isMyToken(payload: any): payload is MyToken {
  return (
    payload !== null &&
    typeof payload === "object" &&
    typeof payload.userId === "string" &&
    typeof payload.nickname === "string"
  );
}

export async function requireUser(): Promise<MyToken> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  const refreshToken = cookieStore.get("refreshToken")?.value;

  try {
    const decoded = jwt.verify(accessToken!, process.env.JWT_SECRET!);

    if (isMyToken(decoded)) {
      return decoded;
    }

    throw new Error();
  } catch {
    if (!refreshToken) {
      redirect("/login");
    }

    await connectToDb();

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET!);

    if (!isMyToken(decoded)) {
      redirect("/login");
    }

    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      redirect("/login");
    }

    return {
      userId: user._id.toString(),
      nickname: user.nickname,
      role: user.role,
    };
  }
}
