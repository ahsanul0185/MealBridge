import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/middleware/globalErrorHandler.js";
import notFound from "./app/middleware/notFound.js";
import router from "./app/routes/index.js";
import env from "./app/config/env.js";

const app: Application = express();

// Middlewares
app.use(cors({ origin: ["http://localhost:5173", env.client_url], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files for uploads
app.use("/uploads", express.static(env.upload_folder));

// Health check
app.get("/", (_req, res) => {
  res.json({ message: "MealBridge API is running" });
});

// API Routes
app.use("/api", router);

// Not found handler
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

export default app;
