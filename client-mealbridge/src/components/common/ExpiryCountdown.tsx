import { useEffect, useState } from "react";

interface ExpiryCountdownProps {
  safeUntilTime: string;
  className?: string;
  showIcon?: boolean;
}

export function ExpiryCountdown({
  safeUntilTime,
  className = "",
  showIcon = true,
}: ExpiryCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const safe = new Date(safeUntilTime);
      const now = new Date();
      const diffMs = safe.getTime() - now.getTime();

      if (diffMs <= 0) {
        setIsExpired(true);
        setTimeLeft("Expired");
        return;
      }

      setIsExpired(false);
      // Urgent if less than 30 minutes
      setIsUrgent(diffMs < 30 * 60 * 1000);

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [safeUntilTime]);

  const colorClass = isExpired
    ? "text-red-500"
    : isUrgent
    ? "text-accent animate-pulse-soft"
    : "text-text-secondary";

  const bgClass = isExpired
    ? "bg-red-50"
    : isUrgent
    ? "bg-accent-50"
    : "bg-warm-100";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${bgClass} ${colorClass} ${className}`}
    >
      {showIcon && (
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
      {isExpired ? "Expired" : `Expires in ${timeLeft}`}
    </span>
  );
}
