import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import claimService from "./claim.service.js";
import { getPagination, getPaginationMeta } from "../../utils/paginate.js";

const getClaimById = catchAsync(async (req: Request, res: Response) => {
  const ngoId = req.user!.userId;
  const result = await claimService.getClaimById(req.params.id, ngoId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Claim fetched successfully",
    data: result,
  });
});

const getMyClaims = catchAsync(async (req: Request, res: Response) => {
  const ngoId = req.user!.userId;
  const { page, limit, skip } = getPagination(req);
  const { status, search, donor, from, to } = req.query as Record<string, string | undefined>;

  const { data, total, stats } = await claimService.getMyClaims(ngoId, { skip, limit }, {
    status,
    search,
    donor,
    from,
    to,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My claims fetched successfully",
    meta: getPaginationMeta({ page, limit, total }),
    data: {
      items: data,
      stats,
    },
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
  getClaimById,
  getMyClaims,
  updateStatus,
  markPickedUp,
};

export default claimController;
