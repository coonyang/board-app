import { connectToDb } from "@/lib/utils";
import { userIdToColor } from "@/lib/color";
import { requireUser } from "@/lib/auth";
import { ROOM_CAPACITY } from "@/lib/plazaConfig";
import { PlazaPresence } from "@/app/models/PlazaPresence";

export async function POST(req: Request) {
  const user = await requireUser();

  const body = await req.json().catch(() => ({}));
  const requestedRoom = Number(body.room) || null;

  await connectToDb();

  const activeSince = new Date(Date.now() - 15 * 1000);

  const counts = await PlazaPresence.aggregate([
    {
      $match: {
        updatedAt: { $gte: activeSince },
        userId: { $ne: user.userId },
      },
    },
    { $group: { _id: "$room", count: { $sum: 1 } } },
  ]);
  const countByRoom = new Map<number, number>(
    counts.map((c) => [c._id, c.count]),
  );

  let room: number;
  if (requestedRoom) {
    if ((countByRoom.get(requestedRoom) ?? 0) >= ROOM_CAPACITY) {
      return Response.json({ error: "room-full" }, { status: 409 });
    }
    room = requestedRoom;
  } else {
    room = 1;
    while ((countByRoom.get(room) ?? 0) >= ROOM_CAPACITY) {
      room++;
    }
  }

  await PlazaPresence.findOneAndUpdate(
    { userId: user.userId },
    {
      userId: user.userId,
      room,
      nickname: user.nickname,
      color: userIdToColor(user.userId),
      updatedAt: new Date(),
    },
    { upsert: true, setDefaultsOnInsert: true },
  );

  return Response.json({ room });
}
