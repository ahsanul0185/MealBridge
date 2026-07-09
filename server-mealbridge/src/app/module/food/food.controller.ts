import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import foodService from "./food.service.js";
import { getPagination, getPaginationMeta } from "../../utils/paginate.js";

const createFood = catchAsync(async (req: Request, res: Response) => {
  const restaurantId = req.user!.userId;
  const imageUrl = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    : undefined;

  const result = await foodService.createFood(req.body, restaurantId, imageUrl);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Food post created successfully",
    data: result,
  });
});

const getAvailableFood = catchAsync(async (req: Request, res: Response) => {
  const { area, food_type } = req.query as { area?: string; food_type?: string };
  const { page, limit, skip } = getPagination(req);
  const { data, total } = await foodService.getAvailableFood({ area, food_type }, { skip, limit });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Available food fetched successfully",
    meta: getPaginationMeta({ page, limit, total }),
    data,
  });
});

const getFoodById = catchAsync(async (req: Request, res: Response) => {
  const result = await foodService.getFoodById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Food post fetched successfully",
    data: result,
  });
});

const getMyPosts = catchAsync(async (req: Request, res: Response) => {
  const restaurantId = req.user!.userId;
  const { page, limit, skip } = getPagination(req);
  const { data, total } = await foodService.getMyPosts(restaurantId, { skip, limit });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My posts fetched successfully",
    meta: getPaginationMeta({ page, limit, total }),
    data,
  });
});

const updateFood = catchAsync(async (req: Request, res: Response) => {
  const restaurantId = req.user!.userId;
  const result = await foodService.updateFood(req.params.id, restaurantId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Food post updated successfully",
    data: result,
  });
});

const cancelFood = catchAsync(async (req: Request, res: Response) => {
  const restaurantId = req.user!.userId;
  const result = await foodService.cancelFood(req.params.id, restaurantId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Food post cancelled successfully",
    data: result,
  });
});

const getClaimInfo = catchAsync(async (req: Request, res: Response) => {
  const restaurantId = req.user!.userId;
  const result = await foodService.getClaimInfo(req.params.id, restaurantId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Claim info fetched successfully",
    data: result,
  });
});

const markHandedOver = catchAsync(async (req: Request, res: Response) => {
  const restaurantId = req.user!.userId;
  const result = await foodService.markHandedOver(req.params.id, restaurantId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Food marked as handed over",
    data: result,
  });
});

const claimFood = catchAsync(async (req: Request, res: Response) => {
  const ngoId = req.user!.userId;
  const result = await foodService.claimFood(req.params.id, ngoId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Food claimed successfully",
    data: result,
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
