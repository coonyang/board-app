export const MAX_LEVEL = 5;
export const DAILY_EXP_CAP = 100;

// 레벨 n에 도달하기 위해 필요한 누적 EXP. 인덱스 0 = Lv1(0 EXP)부터 시작.
// Lv1: 0~99, Lv2: 100~299, Lv3: 300~599, Lv4: 600~999, Lv5: 1000~
export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000] as const;

export function calculateLevel(exp: number): number {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (exp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    }
  }
  return Math.min(level, MAX_LEVEL);
}

export type LevelProgress = {
  level: number;
  exp: number;
  levelFloor: number;
  nextLevelThreshold: number | null;
  expIntoLevel: number;
  expNeededForNext: number | null;
  isMaxLevel: boolean;
};

export function getLevelProgress(exp: number): LevelProgress {
  const level = calculateLevel(exp);
  const levelFloor = LEVEL_THRESHOLDS[level - 1];
  const isMaxLevel = level >= MAX_LEVEL;
  const nextLevelThreshold = isMaxLevel ? null : LEVEL_THRESHOLDS[level];

  return {
    level,
    exp,
    levelFloor,
    nextLevelThreshold,
    expIntoLevel: exp - levelFloor,
    expNeededForNext: isMaxLevel ? null : nextLevelThreshold! - exp,
    isMaxLevel,
  };
}
