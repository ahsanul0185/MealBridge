import { Request, Response, NextFunction } from "express";
import AppError from "../errorHelpers/AppError.js";

const restrictTo = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError(403, "You do not have permission to perform this action."));
    }
    next();
  };
};

export default restrictTo;
