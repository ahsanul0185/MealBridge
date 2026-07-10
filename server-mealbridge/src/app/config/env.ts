import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim().replace(/\/$/, ""))
  : process.env.CLIENT_URL
    ? [process.env.CLIENT_URL.replace(/\/$/, "")]
    : ["http://localhost:5173"];

export default {
  NODE_ENV: process.env.NODE_ENV || "development",
  port: process.env.PORT || "5000",
  client_url: process.env.CLIENT_URL || "http://localhost:5173",
  allowed_origins: allowedOrigins,
  database_url: process.env.MONGO_URI || "mongodb://localhost:27017/mealbridge",
  jwt_secret: process.env.JWT_SECRET || "defaultsecret",
  jwt_expires_in: process.env.JWT_EXPIRES_IN || "7d",
  upload_folder:
    process.env.VERCEL === "1"
      ? "/tmp/mealbridge-uploads"
      : process.env.UPLOAD_FOLDER || "uploads",
};
