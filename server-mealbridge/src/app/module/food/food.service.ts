import mongoose from "mongoose";
import FoodPost from "../../models/FoodPost.js";
import Claim from "../../models/Claim.js";
import AppError from "../../errorHelpers/AppError.js";

const createFood = async (payload: any, restaurantId: string, imageUrl?: string) => {
  const food = await FoodPost.create({
    ...payload,
    restaurant_id: restaurantId,
    image_url: imageUrl || undefined,
  });
  return food;
};

const getAvailableFood = async (
  filters: { area?: string; food_type?: string },
  pagination: { skip: number; limit: number }
) => {
  const query: any = { status: "Available" };

  if (filters.area) {
    query.area = { $regex: filters.area, $options: "i" };
  }
  if (filters.food_type) {
    query.food_type = filters.food_type;
  }

  // Exclude expired items from available listing
  query.safe_until_time = { $gte: new Date() };

  // Base query without filters for global stats (always unfiltered by area/type)
  const globalQuery: any = {
    status: "Available",
    safe_until_time: { $gte: new Date() },
  };

  const [total, food, globalStats] = await Promise.all([
    FoodPost.countDocuments(query),
    FoodPost.find(query)
      .populate("restaurant_id", "name email phone area")
      .sort({ created_at: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    FoodPost.aggregate([
      { $match: globalQuery },
      {
        $group: {
          _id: null,
          totalServings: { $sum: "$quantity" },
          restaurantIds: { $addToSet: "$restaurant_id" },
        },
      },
      {
        $project: {
          totalServings: 1,
          restaurantsCount: { $size: "$restaurantIds" },
        },
      },
    ]),
  ]);

  const { totalServings = 0, restaurantsCount = 0 } = globalStats[0] ?? {};

  return { data: food, total, totalServings, restaurantsCount };
};

const getFoodById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid food post ID");
  }

  const food = await FoodPost.findById(id).populate(
    "restaurant_id",
    "name email phone area address"
  );

  if (!food) {
    throw new AppError(404, "Food post not found");
  }

  return food;
};

const getMyPosts = async (
  restaurantId: string,
  pagination: { skip: number; limit: number }
) => {
  const query = { restaurant_id: restaurantId };
  const total = await FoodPost.countDocuments(query);
  const posts = await FoodPost.find(query)
    .populate("claimed_by", "name email phone area")
    .sort({ created_at: -1 })
    .skip(pagination.skip)
    .limit(pagination.limit);

  return { data: posts, total };
};

const updateFood = async (id: string, restaurantId: string, payload: any, imageUrl?: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid food post ID");
  }

  const food = await FoodPost.findOne({ _id: id, restaurant_id: restaurantId });
  if (!food) {
    throw new AppError(404, "Food post not found or you do not have permission");
  }

  // Only allow update if not picked up yet
  if (food.status === "Picked up" || food.status === "Cancelled") {
    throw new AppError(400, "Cannot update a food post that is already picked up or cancelled");
  }

  if (imageUrl) {
    payload.image_url = imageUrl;
  }

  Object.assign(food, payload);
  await food.save();
  return food;
};

const cancelFood = async (id: string, restaurantId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid food post ID");
  }

  const food = await FoodPost.findOne({ _id: id, restaurant_id: restaurantId });
  if (!food) {
    throw new AppError(404, "Food post not found or you do not have permission");
  }

  if (food.status === "Picked up") {
    throw new AppError(400, "Cannot cancel a food post that has already been picked up");
  }

  if (food.status === "Cancelled") {
    throw new AppError(400, "Food post is already cancelled");
  }

  food.status = "Cancelled";
  await food.save();
  return food;
};

const getClaimInfo = async (id: string, restaurantId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid food post ID");
  }

  const food = await FoodPost.findOne({ _id: id, restaurant_id: restaurantId });
  if (!food) {
    throw new AppError(404, "Food post not found or you do not have permission");
  }

  if (!food.claimed_by) {
    return { claimed: false, message: "This food post has not been claimed yet" };
  }

  const claim = await Claim.findOne({ food_post_id: id }).populate(
    "ngo_id",
    "name email phone area address"
  );

  if (!claim) {
    return { claimed: false, message: "Claim record not found" };
  }

  return {
    claimed: true,
    ngo: claim.ngo_id,
    claim_time: claim.claim_time,
    pickup_status: claim.pickup_status,
    picked_up_time: claim.picked_up_time,
  };
};

const markHandedOver = async (id: string, restaurantId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid food post ID");
  }

  const food = await FoodPost.findOne({ _id: id, restaurant_id: restaurantId });
  if (!food) {
    throw new AppError(404, "Food post not found or you do not have permission");
  }

  if (food.status !== "Claimed" && food.status !== "On the way") {
    throw new AppError(400, "Food can only be marked as handed over when it is claimed or on the way");
  }

  // Restaurant marks as handed over — this transitions to "On the way" if it was Claimed
  if (food.status === "Claimed") {
    food.status = "On the way";
  }

  await food.save();

  // Also update claim pickup_status if needed
  const claim = await Claim.findOne({ food_post_id: id });
  if (claim && claim.pickup_status === "Claimed") {
    claim.pickup_status = "On the way";
    await claim.save();
  }

  return food;
};

const claimFood = async (id: string, ngoId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid food post ID");
  }

  const food = await FoodPost.findById(id);
  if (!food) {
    throw new AppError(404, "Food post not found");
  }

  // Check expiry
  if (new Date(food.safe_until_time) < new Date()) {
    throw new AppError(400, "This food post has expired and cannot be claimed");
  }

  if (food.status !== "Available") {
    throw new AppError(400, "This food post is no longer available for claim");
  }

  // Update food post
  food.status = "Claimed";
  food.claimed_by = new mongoose.Types.ObjectId(ngoId);
  await food.save();

  // Create claim record
  const claim = await Claim.create({
    food_post_id: id,
    ngo_id: ngoId,
    claim_time: new Date(),
    pickup_status: "Claimed",
  });

  return { food, claim };
};

const foodService = {
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

export default foodService;
