import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../errorHelpers/AppError.js";
import config from "../config/env.js";

export interface IAuthUser {
  userId: string;
  email: string;
  role: "restaurant" | "ngo";
}

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }
  }
}

const checkAuth = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError(401, "You are not logged in. Please log in to get access."));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt_secret) as IAuthUser;
    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError(401, "Invalid token. Please log in again."));
  }
};

export default checkAuth;
