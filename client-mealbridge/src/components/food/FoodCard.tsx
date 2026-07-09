import type { FoodPost } from "../../types/food";
import { FoodTypeBadge } from "../common/Badge";

interface FoodCardProps {
  food: FoodPost;
  onViewDetails: (food: FoodPost) => void;
}

const formatDateFriendly = (dateStr: string) => {
  const d = new Date(dateStr);
  const today = new Date();
  const isToday =
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (isToday) return `Today, ${time}`;
  if (isYesterday) return `Yesterday, ${time}`;
  return `${d.toLocaleDateString()}, ${time}`;
};

export const getRestaurantName = (food: FoodPost): string => {
  const r = food.restaurant_id as any;
  if (typeof r === "object" && r?.name) return r.name;
  return "Restaurant";
};

export function FoodCard({ food, onViewDetails }: FoodCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-(--shadow-card) transition-shadow hover:shadow-(--shadow-card-hover)">
      {/* Image */}
      <div className="relative h-44 w-full shrink-0 overflow-hidden bg-warm-50">
        {food.image_url ? (
          <img
            src={food.image_url}
            alt={food.food_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-muted">
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-md bg-primary px-2 py-0.5 text-xs font-semibold text-white shadow">
          Available
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-dark-gray leading-tight">{food.food_name}</h3>
          <FoodTypeBadge type={food.food_type} size="sm" />
        </div>

        {/* Restaurant */}
        <div className="mb-3 flex items-center gap-1.5 text-xs text-text-secondary">
          <svg className="h-3.5 w-3.5 shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="truncate font-medium">{getRestaurantName(food)}</span>
        </div>

        {/* Details */}
        <div className="mb-4 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-text-muted">Quantity</span>
            <span className="font-medium text-dark-gray">{food.quantity} Plates</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Area</span>
            <span className="font-medium text-dark-gray text-right max-w-[60%] truncate">{food.area}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Prepared</span>
            <span className="font-medium text-dark-gray">{formatDateFriendly(food.prepared_time)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Safe Until</span>
            <span className="font-medium text-dark-gray">{formatDateFriendly(food.safe_until_time)}</span>
          </div>
        </div>

        {/* Action */}
        <button
          onClick={() => onViewDetails(food)}
          className="mt-auto w-full rounded-lg border border-primary py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
