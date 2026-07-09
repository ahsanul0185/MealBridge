import mongoose from "mongoose";
import app from "./app.js";
import config from "./app/config/env.js";
import connectDB from "./app/config/db.js";

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start server
    const port = config.port;
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port} in ${config.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err);
  mongoose.connection.close().then(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err);
  process.exit(1);
});
