export const POST_CATEGORIES = ["자유", "질문", "정보", "잡담"] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];
