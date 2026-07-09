export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const STATUS_COLORS: Record<string, string> = {
  Available: "bg-green-100 text-green-800",
  Claimed: "bg-blue-100 text-blue-800",
  "On the way": "bg-yellow-100 text-yellow-800",
  "Picked up": "bg-gray-100 text-gray-800",
  Expired: "bg-red-100 text-red-800",
  Cancelled: "bg-gray-200 text-gray-600",
};

export const PICKUP_STATUS_COLORS: Record<string, string> = {
  Claimed: "bg-blue-100 text-blue-800",
  "On the way": "bg-yellow-100 text-yellow-800",
  "Picked up": "bg-green-100 text-green-800",
};
