export type FoodStatus =
  | "Available"
  | "Claimed"
  | "On the way"
  | "Picked up"
  | "Expired"
  | "Cancelled";

export type FoodType = "Veg" | "Non-Veg";

export interface FoodPost {
  id: string;
  restaurant_id: string | { id: string; name: string; email: string; phone: string; area: string };
  food_name: string;
  food_type: FoodType;
  quantity: number;
  pickup_address: string;
  area: string;
  prepared_time: string;
  safe_until_time: string;
  image_url?: string;
  note?: string;
  status: FoodStatus;
  claimed_by?: string | { id: string; name: string; email: string; phone: string; area: string };
  created_at: string;
  updated_at: string;
}
