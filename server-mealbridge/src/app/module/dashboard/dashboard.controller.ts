import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";

import dashboardService from "./dashboard.service.js";

const getRestaurantDashboard = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.getRestaurantDashboard(req.user!.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Restaurant dashboard fetched successfully",
    data: result,
  });
});

const getNgoDashboard = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "NGO dashboard fetched successfully",
    data: {
      availableFoodCount: 0,
      claimedPickups: 0,
      onTheWayPickups: 0,
      completedPickups: 0,
      totalPlatesCollected: 0,
    },
  });
});

const dashboardController = {
  getRestaurantDashboard,
  getNgoDashboard,
};

export default dashboardController;
