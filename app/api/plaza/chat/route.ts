import { connectToDb } from "@/lib/utils";
import { userIdToColor } from "@/lib/color";
import { requireUser } from "@/lib/auth";
import { isValidRoom, roomHasCapacity } from "@/lib/plazaRoom";
import { PlazaPresence } from "@/app/models/PlazaPresence";
import { PlazaMessage } from "@/app/models/PlazaMessage";

export async function POST(req: Request) {
  const user = await requireUser();

  const body = await req.json().catch(() => null);
  if (!body) {
    return Response.json({ error: "invalid-body" }, { status: 400 });
  }

  const content = typeof body.content === "string" ? body.content.trim() : "";
  const roomRaw = Number(body.room);
  const room = isValidRoom(roomRaw) ? roomRaw : 1;

  if (!content) {
    return Response.json({ error: "need-input" }, { status: 400 });
  }

  if (content.length > 200) {
    return Response.json({ error: "too-long" }, { status: 400 });
  }

  await connectToDb();

  const existing = await PlazaPresence.findOne({ userId: user.userId });
  if (existing?.room !== room && !(await roomHasCapacity(room, user.userId))) {
    return Response.json({ error: "room-full" }, { status: 409 });
  }

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
