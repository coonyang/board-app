import { connectToDb } from "@/lib/utils";
import { calculateLevel, DAILY_EXP_CAP } from "@/lib/levels";
import { User } from "@/app/models/User";

const todayKey = () => new Date().toISOString().slice(0, 10);

/**
 * userId에게 amount만큼 EXP를 지급(또는 회수, amount < 0)하고 레벨을 재계산한다.
 * 양수 지급만 하루 DAILY_EXP_CAP 상한의 대상이며, 회수(음수)는 상한과 무관하게 그대로 반영한다.
 */
export async function grantExp(userId: string, amount: number): Promise<void> {
  await connectToDb();

  const user = await User.findById(userId);
  if (!user) return;

  const today = todayKey();
  if (user.dailyExpDate !== today) {
    user.dailyExpDate = today;
    user.dailyExpGained = 0;
  }

  let actualAmount = amount;
  if (amount > 0) {
    const remaining = Math.max(0, DAILY_EXP_CAP - (user.dailyExpGained ?? 0));
    actualAmount = Math.min(amount, remaining);
    user.dailyExpGained = (user.dailyExpGained ?? 0) + actualAmount;
  }

  user.exp = Math.max(0, (user.exp ?? 0) + actualAmount);
  user.level = calculateLevel(user.exp);

  await user.save();
}
