import { Request, Response, NextFunction } from "express";
import AppError from "../errorHelpers/AppError.js";

export const checkAuth = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError(401, "You are not logged in. Please log in to get access."));
  }
  next();
};
