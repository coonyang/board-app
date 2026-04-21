import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    authorId: {
      type: String,
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

export const Post =
  mongoose.models.Post || mongoose.model("Post", PostSchema, "post");
