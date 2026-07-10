import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/middleware/globalErrorHandler.js";
import notFound from "./app/middleware/notFound.js";
import router from "./app/routes/index.js";
import env from "./app/config/env.js";

const app: Application = express();

// CORS configuration
const allowedOrigins = Array.from(
  new Set([
    "https://meal-bridge-frontend-pi.vercel.app",
    env.client_url.replace(/\/$/, ""),
    ...env.allowed_origins,
  ])
).filter(Boolean);

if (env.NODE_ENV === "development") {
  console.log("Allowed CORS origins:", allowedOrigins);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, "");

      if (
        allowedOrigins.includes(normalizedOrigin) ||
        (env.NODE_ENV === "development" && normalizedOrigin.startsWith("http://localhost"))
      ) {
        return callback(null, true);
      }

      console.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
