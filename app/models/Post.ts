import mongoose from "mongoose";
import { POST_CATEGORIES } from "@/lib/postCategories";

const PostSchema = new mongoose.Schema(
  {
    authorId: String,
    title: String,
    content: String,
    category: {
      type: String,
      enum: POST_CATEGORIES,
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
