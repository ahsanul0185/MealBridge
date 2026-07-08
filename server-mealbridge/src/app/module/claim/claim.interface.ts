export interface IClaim {
  id: string;
  food_post_id: string;
  ngo_id: string;
  claim_time: Date;
  pickup_status: "Claimed" | "On the way" | "Picked up";
  picked_up_time?: Date;
  created_at: Date;
  updated_at: Date;
}
