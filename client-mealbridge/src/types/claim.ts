export type PickupStatus = "Claimed" | "On the way" | "Picked up";

export interface Claim {
  id: string;
  food_post_id: string | any;
  ngo_id: string | any;
  claim_time: string;
  pickup_status: PickupStatus;
  picked_up_time?: string;
  created_at: string;
  updated_at: string;
}
