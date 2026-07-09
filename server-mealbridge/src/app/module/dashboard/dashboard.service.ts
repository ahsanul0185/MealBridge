import mongoose from "mongoose";
import FoodPost from "../../models/FoodPost.js";

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

const dashboardService = {
  getRestaurantDashboard,
};

export default dashboardService;
