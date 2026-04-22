import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";

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
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login?error=need-login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (isMyToken(decoded)) {
      return decoded;
    }

    throw new Error("Invalid token structure");
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Auth Error:", error);
    redirect("/login?error=invalid-login");
  }
}
