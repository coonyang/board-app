import mongoose from "mongoose";

const PlazaMessageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  room: { type: Number, required: true, default: 1 },
  nickname: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 },
});

PlazaMessageSchema.index({ room: 1, createdAt: -1 });

export const PlazaMessage =
  mongoose.models.PlazaMessage ||
  mongoose.model("PlazaMessage", PlazaMessageSchema);
