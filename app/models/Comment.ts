import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    postId: { type: String, required: true },
    authorId: { type: String, required: true },
    nickname: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

export const Comment =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
