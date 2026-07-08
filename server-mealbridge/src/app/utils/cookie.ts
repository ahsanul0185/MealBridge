import { Response } from "express";

export const setCookie = (res: Response, name: string, value: string, options?: any) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    ...options,
  });
};

export const clearCookie = (res: Response, name: string) => {
  res.clearCookie(name);
};
