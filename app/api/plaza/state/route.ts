import { connectToDb } from "@/lib/utils";
import { requireUser } from "@/lib/auth";
import { PlazaPresence } from "@/app/models/PlazaPresence";
import { PlazaMessage } from "@/app/models/PlazaMessage";

export async function GET(req: Request) {
  const user = await requireUser();

  const { searchParams } = new URL(req.url);
  const room = Number(searchParams.get("room")) || 1;

  await connectToDb();

  const activeSince = new Date(Date.now() - 15 * 1000);

  const [players, messages] = await Promise.all([
    PlazaPresence.find({ room, updatedAt: { $gte: activeSince } }),
    PlazaMessage.find({ room }).sort({ createdAt: -1 }).limit(50),
  ]);

  return Response.json({
    userId: user.userId,
    room,
    players: players.map((p) => ({
      userId: p.userId,
      nickname: p.nickname,
      level: p.level ?? 1,
      x: p.x,
      y: p.y,
      direction: p.direction,
      color: p.color,
      message:
        p.message && p.messageAt && Date.now() - p.messageAt.getTime() < 5000
          ? p.message
          : null,
    })),
    messages: messages.reverse().map((m) => ({
      userId: m.userId,
      nickname: m.nickname,
      content: m.content,
      createdAt: m.createdAt,
    })),
  });
}
