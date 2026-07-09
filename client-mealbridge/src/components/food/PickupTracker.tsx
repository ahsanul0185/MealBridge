
import type { Claim, ClaimWithFood, PickupStatus } from "../../types/claim";

import { Button } from "../common/Button";
import { Card } from "../common/Card";

interface PickupTrackerProps {
  claim: Claim | ClaimWithFood;
  onUpdateStatus: (status: "On the way" | "Picked up") => void;
  isUpdating?: boolean;
}

const steps: { status: PickupStatus; label: string; description: string }[] = [
  { status: "Claimed", label: "Claimed", description: "Completed" },
  { status: "On the way", label: "On the Way", description: "Pending" },
  { status: "Picked up", label: "Picked Up", description: "Pending" },
];

export function PickupTracker({ claim, onUpdateStatus, isUpdating = false }: PickupTrackerProps) {
  const currentStatus = claim.pickup_status;
  const currentStepIndex = steps.findIndex((s) => s.status === currentStatus);

  const canMarkOnTheWay = currentStatus === "Claimed";
  const canMarkPickedUp = currentStatus === "On the way";

  return (
    <Card padding="lg" className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark-gray">Pickup Progress</h3>
        <p className="text-sm text-text-secondary">Update the pickup status after each step.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.status} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                    isCompleted
                      ? "progress-step-active"
                      : "progress-step-pending"
                  } ${isCurrent ? "ring-2 ring-primary/20" : ""}`}
                >
                  {isCompleted ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${
                      isCompleted ? "text-dark-gray" : "text-text-muted"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-text-muted">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 ${
                    index < currentStepIndex ? "progress-line-active" : "progress-line-pending"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Next Step Message */}
      <div className="rounded-lg bg-accent-50 p-4">
        <p className="text-sm text-accent-600">
          {canMarkOnTheWay
            ? "Next step: mark as On the Way when pickup starts."
            : canMarkPickedUp
            ? "Next step: mark as Picked Up when food is collected."
            : "Pickup completed!"}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => onUpdateStatus("On the way")}
          disabled={!canMarkOnTheWay || isUpdating}
          loading={isUpdating && canMarkOnTheWay}
          className="flex-1"
        >
          Mark On the Way
        </Button>
        <Button
          variant="outline"
          onClick={() => onUpdateStatus("Picked up")}
          disabled={!canMarkPickedUp || isUpdating}
          loading={isUpdating && canMarkPickedUp}
          className="flex-1"
        >
          Mark Picked Up
        </Button>
      </div>
    </Card>
  );
}
