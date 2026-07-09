import { Link } from "react-router-dom";
import type { FoodPost } from "../../types/food";
import { StatusBadge } from "../common/Badge";
import { ExpiryCountdown } from "../common/ExpiryCountdown";
import { Card } from "../common/Card";

interface FoodCardProps {
  food: FoodPost;
  showRestaurant?: boolean;
  showActions?: boolean;
  actionLabel?: string;
  // onAction is kept for API compatibility
  onAction?: (food: FoodPost) => void;
  variant?: "grid" | "list";
}

export function FoodCard({
  food,
  showRestaurant = false,
  showActions = true,
  actionLabel = "View Details",
  variant = "grid",
}: FoodCardProps) {
  const isExpired = new Date(food.safe_until_time) < new Date();
  const isAvailable = food.status === "Available" && !isExpired;

  if (variant === "list") {
    return (
      <Card padding="sm" hover className="flex items-center gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg img-placeholder">
          {food.image_url ? (
            <img
              src={food.image_url}
              alt={food.food_name}
              className="h-full w-full object-cover"
            />
          ) : (
            <svg className="h-6 w-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-dark-gray">{food.food_name}</h3>
            <StatusBadge status={food.status} size="sm" />
          </div>
          {showRestaurant && (
            <p className="mt-0.5 text-xs text-text-muted">{food.restaurant_id}</p>
          )}
          <div className="mt-1 flex items-center gap-3 text-xs text-text-secondary">
            <span>{food.quantity} Plates</span>
            <span>{food.area}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ExpiryCountdown safeUntilTime={food.safe_until_time} />
          {showActions && (
            <Link
              to={`/ngo/food/${food.id}`}
              className="rounded-lg border border-primary px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary-50 transition-colors"
            >
              {actionLabel}
            </Link>
          )}
        </div>
      </Card>
    );
  }

  // Grid variant
  return (
    <Card padding="none" hover className="overflow-hidden">
      <div className="relative h-40 overflow-hidden img-placeholder">
        {food.image_url ? (
          <img
            src={food.image_url}
            alt={food.food_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <svg className="h-10 w-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
        <div className="absolute left-3 top-3">
          <StatusBadge status={food.status} size="sm" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-dark-gray">{food.food_name}</h3>
        {showRestaurant && (
          <p className="mt-1 text-xs text-text-muted">{food.restaurant_id}</p>
        )}
        <div className="mt-2 space-y-1 text-xs text-text-secondary">
          <p>Quantity: {food.quantity} Plates</p>
          <p>Area: {food.area}</p>
          <p>Prepared: {new Date(food.prepared_time).toLocaleString()}</p>
        </div>
        <div className="mt-3">
          <ExpiryCountdown safeUntilTime={food.safe_until_time} />
        </div>
        {showActions && (
          <div className="mt-3">
            <Link
              to={`/ngo/food/${food.id}`}
              className={`block w-full rounded-lg border-2 px-4 py-2 text-center text-sm font-medium transition-colors ${
                isAvailable
                  ? "border-primary text-primary hover:bg-primary-50"
                  : "border-border text-text-muted cursor-not-allowed"
              }`}
            >
              {isAvailable ? actionLabel : "Unavailable"}
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
