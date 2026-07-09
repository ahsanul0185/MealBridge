
import type { FoodPost } from "../../types/food";
import { StatusBadge } from "../common/Badge";
import { ExpiryCountdown } from "../common/ExpiryCountdown";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { getSafePickupMessage } from "../../utils/helpers";

interface FoodDetailProps {
  food: FoodPost;
  onClaim?: () => void;
  onBack?: () => void;
  isClaiming?: boolean;
  isNgoView?: boolean;
}

export function FoodDetail({
  food,
  onClaim,
  onBack,
  isClaiming = false,
  isNgoView = false,
}: FoodDetailProps) {
  const isExpired = new Date(food.safe_until_time) < new Date();
  const isAvailable = food.status === "Available" && !isExpired;
  const safePickupMsg = getSafePickupMessage(food.safe_until_time);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <span>Available Food</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-dark-gray font-medium">Food Details</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Image */}
        <Card padding="none" className="overflow-hidden">
          <div className="relative h-80 lg:h-96 img-placeholder">
            {food.image_url ? (
              <img
                src={food.image_url}
                alt={food.food_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <svg className="h-16 w-16 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            <div className="absolute left-4 top-4">
              <StatusBadge status={food.status} />
            </div>
          </div>
        </Card>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-dark-gray">{food.food_name}</h1>
            <p className="mt-1 text-sm text-text-secondary">
              {food.restaurant_id}
            </p>
          </div>

          <p className="text-sm text-text-secondary">{food.note || "No description provided."}</p>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card padding="sm">
              <div className="flex items-center gap-2 text-text-muted">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="text-xs">Quantity</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-dark-gray">{food.quantity} Plates</p>
            </Card>

            <Card padding="sm">
              <div className="flex items-center gap-2 text-text-muted">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs">Safe Until</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-accent">
                {new Date(food.safe_until_time).toLocaleString()}
              </p>
            </Card>

            <Card padding="sm">
              <div className="flex items-center gap-2 text-text-muted">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs">Prepared At</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-dark-gray">
                {new Date(food.prepared_time).toLocaleString()}
              </p>
            </Card>

            <Card padding="sm">
              <div className="flex items-center gap-2 text-text-muted">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs">Pickup Note</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-dark-gray">{food.note || "N/A"}</p>
            </Card>
          </div>

          {/* Address */}
          <Card padding="sm">
            <div className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="text-xs text-text-muted">Pickup Address</p>
                <p className="text-sm font-medium text-dark-gray">{food.pickup_address}</p>
                <p className="mt-0.5 text-xs text-primary">{food.area}</p>
              </div>
            </div>
          </Card>

          {/* Countdown & Safe Pickup */}
          <div className="space-y-2">
            <ExpiryCountdown safeUntilTime={food.safe_until_time} />
            <p className="text-xs text-text-muted">{safePickupMsg}</p>
          </div>

          {/* Actions */}
          {isNgoView && (
            <div className="flex gap-3 pt-2">
              {onBack && (
                <Button variant="outline" onClick={onBack} className="flex-1">
                  Go Back
                </Button>
              )}
              <Button
                onClick={onClaim}
                disabled={!isAvailable || isClaiming}
                loading={isClaiming}
                className="flex-1"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Claim This Food
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
