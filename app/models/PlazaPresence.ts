import mongoose from "mongoose";

const PlazaPresenceSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  room: { type: Number, required: true, default: 1 },
  nickname: { type: String, required: true },
  x: { type: Number, default: 50 },
  y: { type: Number, default: 50 },
  direction: {
    type: String,
    enum: ["up", "down", "left", "right"],
    default: "down",
  },
  color: { type: String, required: true },
  message: { type: String, default: null },
  messageAt: { type: Date, default: null },
  updatedAt: { type: Date, default: Date.now, expires: 20 },
});

PlazaPresenceSchema.index({ room: 1, updatedAt: 1 });

export const PlazaPresence =
  mongoose.models.PlazaPresence ||
  mongoose.model("PlazaPresence", PlazaPresenceSchema);
