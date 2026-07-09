import type { FoodPost } from "../../types/food";
import { FoodCard } from "./FoodCard";
import { EmptyState } from "../common/EmptyState";
import { Pagination } from "../common/Pagination";

interface FoodListProps {
  foods: FoodPost[];
  variant?: "grid" | "list";
  showRestaurant?: boolean;
  showActions?: boolean;
  actionLabel?: string;
  onAction?: (food: FoodPost) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

export function FoodList({
  foods,
  variant = "grid",
  showRestaurant = false,
  showActions = true,
  actionLabel = "View Details",
  onAction,
  emptyTitle = "No food available",
  emptyDescription = "Check back later for new donations.",
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: FoodListProps) {
  if (foods.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={
          <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        }
      />
    );
  }

  return (
    <div className={className}>
      <div
        className={
          variant === "grid"
            ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "space-y-3"
        }
      >
        {foods.map((food) => (
          <FoodCard
            key={food.id}
            food={food}
            showRestaurant={showRestaurant}
            showActions={showActions}
            actionLabel={actionLabel}
            onAction={onAction}
            variant={variant}
          />
        ))}
      </div>

      {totalPages && totalPages > 1 && onPageChange && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage || 1}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
