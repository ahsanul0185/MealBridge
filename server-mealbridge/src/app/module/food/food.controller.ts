import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";

const createFood = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Food post created successfully",
    data: null,
  });
});

const getAvailableFood = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Available food fetched successfully",
    data: [],
  });
});

const getFoodById = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Food post fetched successfully",
    data: null,
  });
});

const getMyPosts = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My posts fetched successfully",
    data: [],
  });
});

const updateFood = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Food post updated successfully",
    data: null,
  });
});

const cancelFood = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Food post cancelled successfully",
    data: null,
  });
});

const getClaimInfo = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Claim info fetched successfully",
    data: null,
  });
});

const markHandedOver = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Food marked as handed over",
    data: null,
  });
});

const claimFood = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Food claimed successfully",
    data: null,
  });
});

const foodController = {
  createFood,
  getAvailableFood,
  getFoodById,
  getMyPosts,
  updateFood,
  cancelFood,
  getClaimInfo,
  markHandedOver,
  claimFood,
};

export default foodController;
