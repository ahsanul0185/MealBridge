import mongoose from "mongoose";
import Claim from "../../models/Claim.js";
import FoodPost from "../../models/FoodPost.js";
import AppError from "../../errorHelpers/AppError.js";

const getMyClaims = async (
  ngoId: string,
  pagination: { skip: number; limit: number }
) => {
  const query = { ngo_id: ngoId };
  const total = await Claim.countDocuments(query);
  const claims = await Claim.find(query)
    .populate({
      path: "food_post_id",
      populate: {
        path: "restaurant_id",
        select: "name email phone area address",
      },
    })
    .sort({ created_at: -1 })
    .skip(pagination.skip)
    .limit(pagination.limit);

  return { data: claims, total };
};

const updateStatus = async (claimId: string, ngoId: string, pickupStatus: string) => {
  if (!mongoose.Types.ObjectId.isValid(claimId)) {
    throw new AppError(400, "Invalid claim ID");
  }

  if (pickupStatus !== "On the way" && pickupStatus !== "Picked up") {
    throw new AppError(400, "Invalid pickup status. Must be 'On the way' or 'Picked up'");
  }

  const claim = await Claim.findOne({ _id: claimId, ngo_id: ngoId });
  if (!claim) {
    throw new AppError(404, "Claim not found or you do not have permission");
  }

  // Prevent going backwards
  const statusOrder = ["Claimed", "On the way", "Picked up"];
  const currentIndex = statusOrder.indexOf(claim.pickup_status);
  const newIndex = statusOrder.indexOf(pickupStatus);

  if (newIndex < currentIndex) {
    throw new AppError(400, "Cannot revert pickup status to a previous state");
  }

  if (newIndex === currentIndex) {
    throw new AppError(400, "Food is already in this status");
  }

  claim.pickup_status = pickupStatus as "On the way" | "Picked up";
  await claim.save();

  // Sync FoodPost status
  const food = await FoodPost.findById(claim.food_post_id);
  if (food) {
    if (pickupStatus === "On the way" && food.status !== "Picked up") {
      food.status = "On the way";
      await food.save();
    } else if (pickupStatus === "Picked up") {
      food.status = "Picked up";
      await food.save();
    }
  }

  return claim;
};

const markPickedUp = async (claimId: string, ngoId: string) => {
  if (!mongoose.Types.ObjectId.isValid(claimId)) {
    throw new AppError(400, "Invalid claim ID");
  }

  const claim = await Claim.findOne({ _id: claimId, ngo_id: ngoId });
  if (!claim) {
    throw new AppError(404, "Claim not found or you do not have permission");
  }

  if (claim.pickup_status === "Picked up") {
    throw new AppError(400, "Food is already marked as picked up");
  }

  claim.pickup_status = "Picked up";
  claim.picked_up_time = new Date();
  await claim.save();

  // Sync FoodPost status
  const food = await FoodPost.findById(claim.food_post_id);
  if (food) {
    food.status = "Picked up";
    await food.save();
  }

  return claim;
};

const claimService = {
  getMyClaims,
  updateStatus,
  markPickedUp,
};

export default claimService;
