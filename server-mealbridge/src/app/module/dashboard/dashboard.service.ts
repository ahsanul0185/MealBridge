import mongoose from "mongoose";
import FoodPost from "../../models/FoodPost.js";
import Claim from "../../models/Claim.js";

const getRestaurantDashboard = async (restaurantId: string) => {
  const currentObject = new mongoose.Types.ObjectId(restaurantId);

  const statsAgg = await FoodPost.aggregate([
    { $match: { restaurant_id: currentObject } },
    {
      $group: {
        _id: null,
        totalPosts: { $sum: 1 },
        availablePosts: {
          $sum: { $cond: [{ $eq: ["$status", "Available"] }, 1, 0] },
        },
        claimedPosts: {
          $sum: { $cond: [{ $in: ["$status", ["Claimed", "On the way", "Picked up"]] }, 1, 0] },
        },
        totalPlates: { $sum: "$quantity" },
      },
    },
  ]);

  const expiringSoon = await FoodPost.countDocuments({
    restaurant_id: currentObject,
    status: "Available",
    safe_until_time: {
      $gte: new Date(),
      $lte: new Date(Date.now() + 2 * 60 * 60 * 1000), // Within next 2 hours
    },
  });

  const recentDonations = await FoodPost.find({ restaurant_id: currentObject })
    .sort({ created_at: -1 })
    .limit(6);

  const baseStats = statsAgg[0] || {
    totalPosts: 0,
    availablePosts: 0,
    claimedPosts: 0,
    totalPlates: 0,
  };

  return {
    stats: {
      ...baseStats,
      expiringSoon,
    },
    recentDonations,
  };
};

const getNgoDashboard = async (ngoId: string) => {
  const objectNgoId = new mongoose.Types.ObjectId(ngoId);
  const now = new Date();

  // Start of today
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  // Start of current month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    availableDonationsNearby,
    activeClaims,
    pickedUpToday,
    totalPickupsThisMonth,
    recentClaims,
  ] = await Promise.all([
    FoodPost.countDocuments({
      status: "Available",
      safe_until_time: { $gte: now },
    }),
    Claim.countDocuments({
      ngo_id: objectNgoId,
      pickup_status: { $in: ["Claimed", "On the way"] },
    }),
    Claim.countDocuments({
      ngo_id: objectNgoId,
      pickup_status: "Picked up",
      picked_up_time: { $gte: startOfToday },
    }),
    Claim.countDocuments({
      ngo_id: objectNgoId,
      pickup_status: "Picked up",
      picked_up_time: { $gte: startOfMonth },
    }),
    Claim.find({ ngo_id: objectNgoId })
      .populate({
        path: "food_post_id",
        populate: {
          path: "restaurant_id",
          select: "name email phone area address",
        },
      })
      .sort({ created_at: -1 })
      .limit(3),
  ]);

  return {
    stats: {
      availableDonationsNearby,
      activeClaims,
      pickedUpToday,
      totalPickupsThisMonth,
    },
    recentClaims,
  };
};

const dashboardService = {
  getRestaurantDashboard,
  getNgoDashboard,
};

export default dashboardService;
