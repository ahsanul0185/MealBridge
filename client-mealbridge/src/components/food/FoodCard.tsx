import type { FoodPost } from "../../types/food";

interface FoodCardProps {
  food: FoodPost;
  showRestaurant?: boolean;
  showActions?: boolean;
  actionLabel?: string;
  onAction?: (food: FoodPost) => void;
  onViewDetails?: (food: FoodPost) => void;
  variant?: "grid" | "list";
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

export function FoodCard({
  food,
  showRestaurant = true,
  showActions = true,
  actionLabel = "View Details",
  onAction,
  onViewDetails,
  variant = "grid",
}: FoodCardProps) {
  return (
    <div className="flex flex-col rounded-[20px] border border-gray-100 bg-white p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-shadow">
      <div className="flex gap-4">
        {/* Image side - uses absolute inset-0 to match the text column's height */}
        <div className="relative w-[130px] sm:w-[140px] xl:w-[130px] shrink-0 overflow-hidden rounded-[14px] bg-warm-50">
          {food.image_url ? (
            <img
              src={food.image_url}
              alt={food.food_name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-text-muted">
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          <div className="absolute left-2.5 top-2.5 rounded-md bg-[#E8F3EC] px-2 py-0.5 text-xs font-medium text-[#1B7A3E]">
            {food.status === "Available" ? "Available" : food.status}
          </div>
        </div>

        {/* Info side */}
        <div className="flex flex-1 flex-col py-1 min-w-0">
          <h3 className="text-[16px] font-semibold text-gray-900 leading-tight truncate">
            {food.food_name}
          </h3>
          
          {showRestaurant && (
            <div className="mt-1.5 flex items-center gap-1.5 text-[13px] text-gray-500">
              <svg className="h-4 w-4 shrink-0 text-[#FF5A25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72l1.06-4.582A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72" />
              </svg>
              <span className="truncate">{getRestaurantName(food)}</span>
            </div>
          )}

          <div className="mt-4 flex flex-col gap-3">
            <div>
              <p className="text-[12px] text-gray-400 leading-none mb-1.5">Quantity</p>
              <p className="text-[14px] font-medium text-gray-800 leading-none">{food.quantity} Plates</p>
            </div>
            <div>
              <p className="text-[12px] text-gray-400 leading-none mb-1.5">Area</p>
              <p className="text-[14px] font-medium text-gray-800 leading-none truncate">{food.area}</p>
            </div>
            <div>
              <p className="text-[12px] text-gray-400 leading-none mb-1.5">Prepared</p>
              <p className="text-[14px] font-medium text-gray-800 leading-none">{formatDateFriendly(food.prepared_time)}</p>
            </div>
            <div>
              <p className="text-[12px] text-gray-400 leading-none mb-1.5">Safe Until</p>
              <p className="text-[14px] font-medium text-gray-800 leading-none">{formatDateFriendly(food.safe_until_time)}</p>
            </div>
          </div>
        </div>
      </div>

      {showActions && (onAction || onViewDetails) && (
        <button
          onClick={() => {
            if (onAction) onAction(food);
            else if (onViewDetails) onViewDetails(food);
          }}
          className={`w-full rounded-[10px] border border-[#1B7A3E] py-2.5 text-[14px] font-medium text-[#1B7A3E] transition-colors hover:bg-[#E8F3EC] ${variant === "list" ? "mt-3" : "mt-4"}`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
