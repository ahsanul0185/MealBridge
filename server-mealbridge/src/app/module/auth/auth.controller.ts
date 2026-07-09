import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import authService from "./auth.service.js";
import User from "../../models/User.js";
import { setCookie, clearCookie } from "../../utils/cookie.js";

const COOKIE_NAME = "token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

const setTokenCookie = (res: Response, token: string) => {
  setCookie(res, COOKIE_NAME, token, {
    maxAge: COOKIE_MAX_AGE,
  });
};

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  setTokenCookie(res, result.token);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: { user: result.user },
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  setTokenCookie(res, result.token);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully",
    data: { user: result.user },
  });
});

const logout = catchAsync(async (_req: Request, res: Response) => {
  clearCookie(res, COOKIE_NAME);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged out successfully",
    data: null,
  });
});

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile fetched successfully",
    data: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address,
      area: user.area,
      created_at: user.created_at,
    },
  });
});

const authController = {
  register,
  login,
  logout,
  getProfile,
};

export default authController;
