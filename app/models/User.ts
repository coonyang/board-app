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
    refreshToken: {
      type: String,
      default: null,
    },
    level: { type: Number, default: 1 },
    exp: { type: Number, default: 0 },
    dailyExpGained: { type: Number, default: 0 },
    dailyExpDate: { type: String, default: null },
  },
  { timestamps: true },
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
