import { PlazaPresence } from "@/app/models/PlazaPresence";
import { ROOM_CAPACITY } from "@/lib/plazaConfig";

export const PLAZA_ACTIVE_WINDOW_MS = 15 * 1000;

export function isValidRoom(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 1;
}

export async function roomHasCapacity(
  room: number,
  excludeUserId: string,
): Promise<boolean> {
  const activeSince = new Date(Date.now() - PLAZA_ACTIVE_WINDOW_MS);

  const count = await PlazaPresence.countDocuments({
    room,
    userId: { $ne: excludeUserId },
    updatedAt: { $gte: activeSince },
  });

  return count < ROOM_CAPACITY;
}
