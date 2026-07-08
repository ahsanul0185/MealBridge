import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";

const getMyClaims = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My claims fetched successfully",
    data: [],
  });
});

const updateStatus = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Pickup status updated successfully",
    data: null,
  });
});

const markPickedUp = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Food marked as picked up",
    data: null,
  });
});

const claimController = {
  getMyClaims,
  updateStatus,
  markPickedUp,
};

export default claimController;
