import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    authorId: String,
    title: String,
    content: String,
    category: {
      type: String,
      enum: ["자유", "질문", "정보", "잡담"],
      default: "자유",
    },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    likedBy: {
      type: [String],
      default: [],
    },
    imageUrls: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
