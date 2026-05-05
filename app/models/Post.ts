import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    authorId: String,
    title: String,
    content: String,
    imageUrls: [String],
  },
  { timestamps: true },
);

export const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
