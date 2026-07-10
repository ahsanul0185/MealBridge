export type PickupStatus = "Claimed" | "On the way" | "Picked up";

export interface RestaurantInfo {
  id?: string;
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  area?: string;
  address?: string;
}

export interface FoodPostInfo {
  id?: string;
  _id?: string;
  food_name: string;
  food_type: string;
  quantity: number;
  pickup_address: string;
  area: string;
  prepared_time: string;
  safe_until_time: string;
  image_url?: string;
  note?: string;
  status: string;
  restaurant_id: RestaurantInfo;
}

export interface Claim {
  id: string;
  _id?: string;
  food_post_id: string | FoodPostInfo;
  ngo_id: string;
  claim_time: string;
  pickup_status: PickupStatus;
  picked_up_time?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClaimWithFood extends Claim {
  food_post?: {
    food_name: string;
    food_type: string;
    quantity: number;
    pickup_address: string;
    area: string;
    safe_until_time: string;
    image_url?: string;
    status: string;
  };
}

export interface ClaimStats {
  claimed: number;
  onTheWay: number;
  pickedUp: number;
  expiredOrCancelled: number;
}

export interface UpdateStatusData {
  pickup_status: "On the way" | "Picked up";
}
