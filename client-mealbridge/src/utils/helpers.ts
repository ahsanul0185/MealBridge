// Date formatting helpers
export const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString();
};

export const formatDateRelative = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();

  if (diffMs <= 0) return "Expired";

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Safe pickup message
export const getSafePickupMessage = (safeUntil: string) => {
  const safe = new Date(safeUntil);
  const warningTime = new Date(safe.getTime() - 30 * 60 * 1000);
  const now = new Date();

  if (now > safe) return "This food has expired.";
  if (now > warningTime) return "Pickup urgently — less than 30 minutes left!";
  return "Pickup before 30 minutes of expiry.";
};
