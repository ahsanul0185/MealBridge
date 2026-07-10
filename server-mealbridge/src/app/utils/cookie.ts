import { Response } from "express";
import env from "../config/env.js";

const isProduction = env.NODE_ENV === "production";

export const setCookie = (res: Response, name: string, value: string, options?: any) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    ...options,
  });
};

export const clearCookie = (res: Response, name: string) => {
  res.clearCookie(name, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
};
