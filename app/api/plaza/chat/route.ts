import { connectToDb } from "@/lib/utils";
import { userIdToColor } from "@/lib/color";
import { requireUser } from "@/lib/auth";
import { PlazaPresence } from "@/app/models/PlazaPresence";
import { PlazaMessage } from "@/app/models/PlazaMessage";

export async function POST(req: Request) {
  const user = await requireUser();

  const body = await req.json();
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const room = Number(body.room) || 1;

  if (!content) {
    return Response.json({ error: "need-input" }, { status: 400 });
  }

  if (content.length > 200) {
    return Response.json({ error: "too-long" }, { status: 400 });
  }

  await connectToDb();

  const now = new Date();

  await Promise.all([
    PlazaMessage.create({
      userId: user.userId,
      room,
      nickname: user.nickname,
      content,
    }),
    PlazaPresence.findOneAndUpdate(
      { userId: user.userId },
      {
        userId: user.userId,
        room,
        nickname: user.nickname,
        color: userIdToColor(user.userId),
        message: content,
        messageAt: now,
        updatedAt: now,
      },
      { upsert: true, setDefaultsOnInsert: true },
    ),
  ]);

  return Response.json({ ok: true });
}
