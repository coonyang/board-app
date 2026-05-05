import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    authorId: String,
    title: String,
    content: String,
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
