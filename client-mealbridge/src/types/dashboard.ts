import type { FoodPost } from "./food";
import type { Claim } from "./claim";

export interface RestaurantDashboardData {
  total_posts: number;
  available_posts: number;
  claimed_posts: number;
  picked_up_posts: number;
  expired_posts: number;
  total_plates: number;
  recent_posts: FoodPost[];
}

export interface NgoDashboardData {
  available_count: number;
  claimed_pickups: number;
  on_the_way: number;
  completed_pickups: number;
  total_plates: number;
  recent_claims: Claim[];
}
