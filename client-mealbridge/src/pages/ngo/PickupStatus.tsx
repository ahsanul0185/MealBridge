import { useNavigate, useParams } from "react-router-dom";
import { useClaim } from "../../hooks/useClaims";
import { Breadcrumb } from "../../components/common/Breadcrumb";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { StatusBadge } from "../../components/common/Badge";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { EmptyState } from "../../components/common/EmptyState";
import type { Claim, FoodPostInfo, RestaurantInfo } from "../../types/claim";

function isFoodPostInfo(value: unknown): value is FoodPostInfo {
  return typeof value === "object" && value !== null && "food_name" in value;
}

function getFoodPost(claim: Claim | null): FoodPostInfo | null {
  if (!claim) return null;
  const fp = claim.food_post_id;
  return isFoodPostInfo(fp) ? fp : null;
}

function getRestaurant(claim: Claim | null): RestaurantInfo | null {
  const food = getFoodPost(claim);
  return food?.restaurant_id ?? null;
}

function formatDateFriendly(dateStr?: string) {
  if (!dateStr) return "—";
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
}

const statusOrder = ["Claimed", "On the way", "Picked up"] as const;

function getStepState(currentStatus: string, stepStatus: string) {
  const currentIndex = statusOrder.indexOf(currentStatus as any);
  const stepIndex = statusOrder.indexOf(stepStatus as any);

  if (stepIndex < currentIndex) return "completed";
  if (stepIndex === currentIndex) return "current";
  return "pending";
}

function getNextStepMessage(status: string) {
  switch (status) {
    case "Claimed":
      return "Next step: mark as On the Way when pickup starts.";
    case "On the way":
      return "Next step: mark as Picked Up once the food is collected.";
    case "Picked up":
      return "Pickup completed. Thank you for reducing food waste!";
    default:
      return "Update the pickup status after each step.";
  }
}

export function PickupStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { claim, isLoading, updateStatus, markPickedUp } = useClaim(id);

  const food = getFoodPost(claim);
  const restaurant = getRestaurant(claim);

  if (isLoading) {
    return (
      <div className="page-transition flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading pickup details..." />
      </div>
    );
  }

  if (!claim || !food) {
    return (
      <div className="page-transition p-4 lg:p-8">
        <EmptyState
          title="Claim not found"
          description="We couldn't find this pickup claim. It may have been removed or you don't have permission to view it."
          action={{ label: "Back to My Claims", onClick: () => navigate("/ngo/claims") }}
        />
      </div>
    );
  }

  const currentStatus = claim.pickup_status;
  const isCompleted = currentStatus === "Picked up";

  const handleMarkOnTheWay = async () => {
    await updateStatus("On the way");
  };

  const handleMarkPickedUp = async () => {
    await markPickedUp();
  };

  const steps = [
    { status: "Claimed", label: "Claimed", sublabel: "Completed" },
    { status: "On the way", label: "On the Way", sublabel: "Pending" },
    { status: "Picked up", label: "Picked Up", sublabel: "Pending" },
  ];

  return (
    <div className="page-transition p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-gray">Pickup Status Update</h1>
        <div className="mt-2">
          <Breadcrumb
            items={[
              { label: "My Claims", href: "/ngo/claims" },
              { label: "Pickup Status" },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Food Details */}
        <Card padding="lg" className="flex flex-col">
          {/* Image with status badge */}
          <div className="relative mb-6 overflow-hidden rounded-2xl bg-warm-100">
            {food.image_url ? (
              <img
                src={food.image_url}
                alt={food.food_name}
                className="h-[280px] w-full object-cover sm:h-[320px]"
              />
            ) : (
              <div className="flex h-[280px] w-full items-center justify-center text-text-muted sm:h-[320px]">
                <svg className="h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="absolute left-4 top-4">
              <StatusBadge status={currentStatus} size="md" />
            </div>
          </div>

          {/* Food & Restaurant */}
          <h2 className="text-2xl font-bold text-dark-gray">{food.food_name}</h2>
          <p className="mt-1 text-base text-text-secondary">{restaurant?.name ?? "Restaurant"}</p>

          {/* Details Grid */}
          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Quantity</p>
              <p className="mt-1 text-base font-medium text-dark-gray">{food.quantity} Plates</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Area</p>
              <p className="mt-1 text-base font-medium text-dark-gray">{food.area}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Safe Until</p>
              <p className="mt-1 text-base font-medium text-accent">{formatDateFriendly(food.safe_until_time)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Pickup Note</p>
              <p className="mt-1 text-base font-medium text-dark-gray">{food.note || "Please carry your own bags."}</p>
            </div>
          </div>

          {/* Pickup Address */}
          <div className="mt-6 rounded-xl bg-warm-50 px-4 py-3 text-sm text-text-secondary">
            <span className="font-medium text-dark-gray">Pickup Address:</span>{" "}
            {restaurant?.address || food.pickup_address || "Address not provided"}
          </div>
        </Card>

        {/* Right: Pickup Progress */}
        <Card padding="lg" className="flex flex-col">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-dark-gray">Pickup Progress</h2>
            <p className="mt-1 text-sm text-text-secondary">Update the pickup status after each step.</p>
          </div>

          {/* Stepper */}
          <div className="relative mb-8">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-[20px] hidden sm:block">
              <div className="mx-auto h-1 w-[calc(100%-80px)] rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{
                    width:
                      currentStatus === "Claimed"
                        ? "0%"
                        : currentStatus === "On the way"
                        ? "50%"
                        : "100%",
                  }}
                />
              </div>
            </div>

            <div className="relative flex justify-between">
              {steps.map((step) => {
                const state = getStepState(currentStatus, step.status);
                const isCompletedStep = state === "completed";
                const isCurrentStep = state === "current";

                return (
                  <div key={step.status} className="flex flex-col items-center text-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors duration-300 sm:h-11 sm:w-11 ${
                        isCompletedStep
                          ? "border-primary bg-primary text-white"
                          : isCurrentStep
                          ? "border-primary bg-white text-primary"
                          : "border-gray-200 bg-white text-text-muted"
                      }`}
                    >
                      {isCompletedStep ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.status === "Claimed" ? "1" : step.status === "On the way" ? "2" : "3"
                      )}
                    </div>
                    <p
                      className={`mt-2 text-sm font-semibold ${
                        isCompletedStep || isCurrentStep ? "text-dark-gray" : "text-text-muted"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p
                      className={`text-xs ${
                        isCompletedStep ? "text-primary" : isCurrentStep ? "text-accent" : "text-text-muted"
                      }`}
                    >
                      {isCompletedStep ? "Completed" : isCurrentStep ? "Pending" : "Pending"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info message */}
          <div className="mb-8 rounded-xl border border-accent-100 bg-accent-50 px-5 py-4 text-sm font-medium text-accent-600">
            {getNextStepMessage(currentStatus)}
          </div>

          {/* Action buttons */}
          <div className="mt-auto grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button
              variant={currentStatus === "Claimed" ? "primary" : "outline"}
              size="lg"
              disabled={isCompleted || currentStatus === "On the way"}
              onClick={handleMarkOnTheWay}
              loading={isLoading}
            >
              Mark On the Way
            </Button>
            <Button
              variant={currentStatus === "On the way" ? "primary" : "outline"}
              size="lg"
              disabled={isCompleted}
              onClick={handleMarkPickedUp}
              loading={isLoading}
            >
              Mark Picked Up
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
