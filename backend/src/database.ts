import mongoose from "mongoose";

export async function connectDB(uri: string) {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch {
    process.exit(1);
  }
}
