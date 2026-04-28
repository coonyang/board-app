import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    nickname: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
