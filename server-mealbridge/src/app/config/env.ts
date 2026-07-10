import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env.NODE_ENV || "development",
  port: process.env.PORT || "5000",
  client_url: process.env.CLIENT_URL || "http://localhost:5173",
  database_url: process.env.MONGO_URI || "mongodb://localhost:27017/mealbridge",
  jwt_secret: process.env.JWT_SECRET || "defaultsecret",
  jwt_expires_in: process.env.JWT_EXPIRES_IN || "7d",
  upload_folder: process.env.UPLOAD_FOLDER || "uploads",
};
