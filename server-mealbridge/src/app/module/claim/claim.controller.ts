import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import claimService from "./claim.service.js";

const getMyClaims = catchAsync(async (req: Request, res: Response) => {
  const ngoId = req.user!.userId;
  const result = await claimService.getMyClaims(ngoId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My claims fetched successfully",
    data: result,
  });
});

const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const ngoId = req.user!.userId;
  const { pickup_status } = req.body;
  const result = await claimService.updateStatus(req.params.id, ngoId, pickup_status);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Pickup status updated successfully",
    data: result,
  });
});

const markPickedUp = catchAsync(async (req: Request, res: Response) => {
  const ngoId = req.user!.userId;
  const result = await claimService.markPickedUp(req.params.id, ngoId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Food marked as picked up",
    data: result,
  });
});

const claimController = {
  getMyClaims,
  updateStatus,
  markPickedUp,
};

export default claimController;
