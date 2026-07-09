export type PickupStatus = "Claimed" | "On the way" | "Picked up";

export interface Claim {
  id: string;
  food_post_id: string;
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

export interface UpdateStatusData {
  pickup_status: "On the way" | "Picked up";
}
