import { connectToDb } from "@/lib/utils";
import { userIdToColor } from "@/lib/color";
import { requireUser } from "@/lib/auth";
import { PlazaPresence } from "@/app/models/PlazaPresence";

const DIRECTIONS = ["up", "down", "left", "right"];

export async function POST(req: Request) {
  const user = await requireUser();

  const body = await req.json();
  const x = Number(body.x);
  const y = Number(body.y);
  const room = Number(body.room) || 1;
  const direction = DIRECTIONS.includes(body.direction)
    ? body.direction
    : "down";

  if (Number.isNaN(x) || Number.isNaN(y)) {
    return Response.json({ error: "invalid-position" }, { status: 400 });
  }

  await connectToDb();

  await PlazaPresence.findOneAndUpdate(
    { userId: user.userId },
    {
      userId: user.userId,
      room,
      nickname: user.nickname,
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
      direction,
      color: userIdToColor(user.userId),
      updatedAt: new Date(),
    },
    { upsert: true },
  );

  return Response.json({ ok: true });
}
