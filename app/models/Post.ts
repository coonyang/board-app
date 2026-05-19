import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    authorId: String,
    title: String,
    content: String,
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    likedBy: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
