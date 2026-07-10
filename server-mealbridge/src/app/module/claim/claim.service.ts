import mongoose from "mongoose";
import Claim from "../../models/Claim.js";
import FoodPost from "../../models/FoodPost.js";
import AppError from "../../errorHelpers/AppError.js";

interface ClaimFilters {
  status?: string;
  search?: string;
  donor?: string;
  from?: string;
  to?: string;
}

const getClaimStats = async (ngoId: mongoose.Types.ObjectId) => {
  const [claimedCount, onTheWayCount, pickedUpCount, expiredOrCancelledAgg] = await Promise.all([
    Claim.countDocuments({ ngo_id: ngoId, pickup_status: "Claimed" }),
    Claim.countDocuments({ ngo_id: ngoId, pickup_status: "On the way" }),
    Claim.countDocuments({ ngo_id: ngoId, pickup_status: "Picked up" }),
    Claim.aggregate([
      { $match: { ngo_id: ngoId } },
      {
        $lookup: {
          from: "foodposts",
          localField: "food_post_id",
          foreignField: "_id",
          as: "food",
        },
      },
      { $unwind: "$food" },
      { $match: { "food.status": { $in: ["Expired", "Cancelled"] } } },
      { $count: "count" },
    ]),
  ]);

  return {
    claimed: claimedCount,
    onTheWay: onTheWayCount,
    pickedUp: pickedUpCount,
    expiredOrCancelled: expiredOrCancelledAgg[0]?.count ?? 0,
  };
};

const buildFilteredClaimsPipeline = (
  ngoId: mongoose.Types.ObjectId,
  filters: ClaimFilters
) => {
  const baseMatch: Record<string, unknown> = { ngo_id: ngoId };

  if (filters.status && ["Claimed", "On the way", "Picked up"].includes(filters.status)) {
    baseMatch.pickup_status = filters.status;
  }

  if (filters.from || filters.to) {
    baseMatch.claim_time = {};
    if (filters.from) (baseMatch.claim_time as Record<string, Date>).$gte = new Date(filters.from);
    if (filters.to) (baseMatch.claim_time as Record<string, Date>).$lte = new Date(filters.to);
  }

  const pipeline: any[] = [
    { $match: baseMatch },
    {
      $lookup: {
        from: "foodposts",
        localField: "food_post_id",
        foreignField: "_id",
        as: "food_post_id",
      },
    },
    { $unwind: "$food_post_id" },
    {
      $lookup: {
        from: "users",
        localField: "food_post_id.restaurant_id",
        foreignField: "_id",
        as: "food_post_id.restaurant_id",
      },
    },
    {
      $unwind: {
        path: "$food_post_id.restaurant_id",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  const filterConditions: any[] = [];

  if (filters.search?.trim()) {
    const regex = new RegExp(filters.search.trim(), "i");
    filterConditions.push({
      $or: [
        { "food_post_id.food_name": { $regex: regex } },
        { "food_post_id.restaurant_id.name": { $regex: regex } },
      ],
    });
  }

  if (filters.donor?.trim()) {
    filterConditions.push({ "food_post_id.restaurant_id.name": filters.donor.trim() });
  }

  if (filterConditions.length > 0) {
    pipeline.push({ $match: { $and: filterConditions } });
  }

  return pipeline;
};

const getClaimById = async (claimId: string, ngoId: string) => {
  if (!mongoose.Types.ObjectId.isValid(claimId)) {
    throw new AppError(400, "Invalid claim ID");
  }

  const claim = await Claim.findOne({ _id: claimId, ngo_id: ngoId })
    .populate({
      path: "food_post_id",
      populate: {
        path: "restaurant_id",
        select: "name email phone area address",
      },
    });

  if (!claim) {
    throw new AppError(404, "Claim not found or you do not have permission");
  }

  return claim;
};

const getMyClaims = async (
  ngoId: string,
  pagination: { skip: number; limit: number },
  filters: ClaimFilters = {}
) => {
  if (!mongoose.Types.ObjectId.isValid(ngoId)) {
    throw new AppError(400, "Invalid NGO ID");
  }

  const objectNgoId = new mongoose.Types.ObjectId(ngoId);
  const pipeline = buildFilteredClaimsPipeline(objectNgoId, filters);

  const [countResult, claims, stats] = await Promise.all([
    Claim.aggregate([...pipeline, { $count: "count" }]),
    Claim.aggregate([
      ...pipeline,
      { $sort: { created_at: -1 } },
      { $skip: pagination.skip },
      { $limit: pagination.limit },
    ]),
    getClaimStats(objectNgoId),
  ]);

  const total = countResult[0]?.count ?? 0;

  return { data: claims, total, stats };
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
  getClaimById,
  getMyClaims,
  updateStatus,
  markPickedUp,
};

export default claimService;
