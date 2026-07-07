import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import authService from "./auth.service.js";
import User from "../../models/User.js";

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully",
    data: result,
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
  getProfile,
};

export default authController;
