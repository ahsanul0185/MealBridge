import mongoose from "mongoose";
import config from "./env.js";

const connectDB = async (): Promise<void> => {
  // Reuse existing connection when running in serverless environments (Vercel)
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(config.database_url);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${(error as Error).message}`);
    // Throw instead of process.exit so serverless functions don't hard-crash
    throw error;
  }
};

export default connectDB;
