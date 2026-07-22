import { connectToDb } from "@/lib/utils";
import { requireUser } from "@/lib/auth";
import { ROOM_CAPACITY } from "@/lib/plazaConfig";
import { PlazaPresence } from "@/app/models/PlazaPresence";

export async function GET() {
  await requireUser();

  await connectToDb();

  const activeSince = new Date(Date.now() - 15 * 1000);

  const counts = await PlazaPresence.aggregate([
    { $match: { updatedAt: { $gte: activeSince } } },
    { $group: { _id: "$room", count: { $sum: 1 } } },
  ]);
  const countByRoom = new Map<number, number>(
    counts.map((c) => [c._id, c.count]),
  );

  const maxRoom = Math.max(1, ...Array.from(countByRoom.keys()));
  const rooms = [];
  for (let room = 1; room <= maxRoom + 1; room++) {
    rooms.push({ room, count: countByRoom.get(room) ?? 0 });
  }

  return Response.json({ rooms, capacity: ROOM_CAPACITY });
}
