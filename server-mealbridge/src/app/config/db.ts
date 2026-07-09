import mongoose from "mongoose";
import config from "./env.js";

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.database_url);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;
