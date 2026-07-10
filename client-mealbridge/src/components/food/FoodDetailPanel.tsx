import { StatusBadge } from "../common/Badge";
import { Button } from "../common/Button";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { formatDate } from "../../utils/helpers";
import type { FoodPost } from "../../types/food";

interface PopulatedRestaurant {
  name: string;
  email: string;
  phone: string;
  area: string;
  address: string;
}

interface FoodDetail extends Omit<FoodPost, "restaurant_id"> {
  restaurant_id?: string | PopulatedRestaurant;
}

interface FoodDetailPanelProps {
  food: FoodDetail | null;
  loading?: boolean;
  onClose: () => void;
  onCancel?: () => void;
}

export function FoodDetailPanel({ food, loading, onClose, onCancel }: FoodDetailPanelProps) {
  if (!food && loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size="lg" text="Loading details..." />
      </div>
    );
  }

  if (!food) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <p className="text-text-secondary">No donation selected.</p>
      </div>
    );
  }

  const restaurant = typeof food.restaurant_id === "object" ? food.restaurant_id : null;
  const canCancel = food.status !== "Picked up" && food.status !== "Cancelled";

  const infoItems = [
    {
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: "Area",
      value: food.area,
    },
    {
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: "Safe Until",
      value: formatDate(food.safe_until_time),
    },
    {
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      label: "Quantity",
      value: `${food.quantity} Plates`,
    },
    {
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: "Expires At",
      value: formatDate(food.safe_until_time),
    },
  ];

  return (
    <div className="relative flex h-full flex-col">
      {loading && (
        <div className="absolute right-4 top-4 z-10">
          <LoadingSpinner size="sm" />
        </div>
      )}

      {/* Food Image */}
      <div className="mb-5 aspect-video w-full overflow-hidden rounded-xl border border-border bg-warm-50">
        {food.image_url ? (
          <img src={food.image_url} alt={food.food_name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-muted">
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="mb-3">
        <StatusBadge status={food.status} size="md" />
      </div>

      {/* Title & Type */}
      <h3 className="text-2xl font-bold text-dark-gray">{food.food_name}</h3>
      <p className="mb-5 text-sm text-text-secondary">
        {food.food_type === "Veg" ? "Vegetarian" : "Non-Vegetarian"}
      </p>

      {/* Info Grid */}
      <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl border border-border bg-warm-50/50 p-4">
        {infoItems.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center gap-1.5 text-xs text-text-muted">
              <span className="text-text-secondary">{item.icon}</span>
              {item.label}
            </div>
            <p className="text-sm font-medium text-dark-gray">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      {food.note && (
        <div className="mb-5">
          <h4 className="mb-1 text-sm font-semibold text-dark-gray">Description</h4>
          <p className="text-sm text-text-secondary">{food.note}</p>
        </div>
      )}

      {/* Pickup Instructions */}
      <div className="mb-5">
        <h4 className="mb-1 text-sm font-semibold text-dark-gray">Pickup Instructions</h4>
        <p className="text-sm text-text-secondary">{food.pickup_address}</p>
      </div>

      {/* Contact Person */}
      {restaurant && (
        <div className="mb-6">
          <h4 className="mb-2 text-sm font-semibold text-dark-gray">Contact Person</h4>
          <p className="text-sm font-medium text-dark-gray">{restaurant.name}</p>
          {restaurant.phone && (
            <a
              href={`tel:${restaurant.phone}`}
              className="mt-1 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {restaurant.phone}
            </a>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto flex gap-3 pt-4">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Close
        </Button>
        {canCancel && onCancel && (
          <Button variant="danger" className="flex-1" onClick={onCancel}>
            Cancel Donation
          </Button>
        )}
      </div>
    </div>
  );
}
