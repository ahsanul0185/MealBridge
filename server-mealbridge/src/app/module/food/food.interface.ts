export interface IFoodPost {
  id: string;
  restaurant_id: string;
  food_name: string;
  food_type: "Veg" | "Non-Veg";
  quantity: number;
  pickup_address: string;
  area: string;
  prepared_time: Date;
  safe_until_time: Date;
  image_url?: string;
  note?: string;
  status: "Available" | "Claimed" | "On the way" | "Picked up" | "Expired" | "Cancelled";
  claimed_by?: string;
  created_at: Date;
  updated_at: Date;
}
