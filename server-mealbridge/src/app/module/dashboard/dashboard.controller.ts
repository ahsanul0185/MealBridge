import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";

const getRestaurantDashboard = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Restaurant dashboard fetched successfully",
    data: {
      totalPosts: 0,
      availablePosts: 0,
      claimedPosts: 0,
      pickedUpPosts: 0,
      expiredPosts: 0,
      totalPlates: 0,
    },
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
