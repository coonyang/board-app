import mongoose from "mongoose";

const DB_URI = process.env.MONGODB_URI || "";

export const connectToDb = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }
    const db = await mongoose.connect(DB_URI);
    const isConnected = db.connections[0].readyState;
    console.log("몽고디비와의 연결상태:", mongoose.connection.readyState);
  } catch (error) {
    console.log(error);
    throw new Error("몽고디비와 연결이 실패되었습니다.");
  }
};
