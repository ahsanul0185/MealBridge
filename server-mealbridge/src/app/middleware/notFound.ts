import { Request, Response, NextFunction } from "express";
import AppError from "../errorHelpers/AppError.js";

const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(404, `Cannot find ${req.originalUrl} on this server!`));
};

export default notFound;
