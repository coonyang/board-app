import { connectToDb } from "@/lib/utils";
import { requireUser } from "@/lib/auth";
import { PlazaPresence } from "@/app/models/PlazaPresence";

export async function POST() {
  const user = await requireUser();

  await connectToDb();

  await PlazaPresence.deleteOne({ userId: user.userId });

  return Response.json({ ok: true });
}
