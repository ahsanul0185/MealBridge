import { Request } from "express";
import { IAuthUser } from "../middleware/checkAuth.js";

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }
  }
}
