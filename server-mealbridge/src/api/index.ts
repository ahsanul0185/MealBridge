import type { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../app.js";
import connectDB from "../app/config/db.js";

const handler = async (req: VercelRequest, res: VercelResponse) => {
  await connectDB();
  return app(req, res);
};

export default handler;
