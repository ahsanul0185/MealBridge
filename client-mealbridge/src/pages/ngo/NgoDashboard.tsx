import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNgoDashboard } from "../../hooks/useDashboard";
import { getProfile } from "../../services/auth.service";
import type { User } from "../../services/auth.service";
import { Card, StatCard } from "../../components/common/Card";
import { DataTable } from "../../components/common/DataTable";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { EmptyState } from "../../components/common/EmptyState";
import { StatusBadge } from "../../components/common/Badge";
import type { Claim, FoodPostInfo, RestaurantInfo } from "../../types/claim";

function isFoodPostInfo(value: unknown): value is FoodPostInfo {
  return typeof value === "object" && value !== null && "food_name" in value;
}

function getFoodPost(claim: Claim): FoodPostInfo | null {
  const fp = claim.food_post_id;
  return isFoodPostInfo(fp) ? fp : null;
}

function getRestaurant(claim: Claim): RestaurantInfo | null {
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

function getDashboardStatus(status: string) {
  if (status === "On the way") return "Pickup Pending";
  if (status === "Picked up") return "Completed";
  return status;
}

export function NgoDashboard() {
  const navigate = useNavigate();
  const { data, isLoading: isDashboardLoading } = useNgoDashboard();
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setIsUserLoading(false));
  }, []);

  const isLoading = isDashboardLoading || isUserLoading;
  const stats = data?.stats;
  const recentClaims = data?.recentClaims ?? [];

  const statCards = [
    {
      label: "Available Donations Nearby",
      value: stats?.availableDonationsNearby ?? 0,
      sublabel: "Donations near you",
      iconBg: "bg-green-100 text-green-700",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: "Active Claims",
      value: stats?.activeClaims ?? 0,
      sublabel: "Total claims made",
      iconBg: "bg-blue-100 text-blue-700",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: "Picked Up Today",
      value: stats?.pickedUpToday ?? 0,
      sublabel: "Successful pickups",
      iconBg: "bg-yellow-100 text-yellow-700",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      ),
    },
    {
      label: "Total Pickups",
      value: stats?.totalPickupsThisMonth ?? 0,
      sublabel: "This month",
      iconBg: "bg-green-100 text-green-700",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="page-transition flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="page-transition p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-text-secondary">Welcome back,</p>
          <h1 className="text-2xl font-bold text-dark-gray">{user?.name ?? "NGO"}</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Here's an overview of available food and your recent activity.
          </p>
        </div>

        <button
          onClick={() => navigate("/ngo/food")}
          className="btn-press inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Browse Available Food
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard
            key={card.label}
            icon={card.icon}
            iconBg={card.iconBg}
            label={card.label}
            value={card.value}
            sublabel={card.sublabel}
          />
        ))}
      </div>

      {/* Recent Claims */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-dark-gray">Recent Claims</h2>
          <button
            onClick={() => navigate("/ngo/claims")}
            className="text-sm font-medium text-primary hover:text-primary-dark"
          >
            View All Claims
          </button>
        </div>

        {recentClaims.length === 0 ? (
          <Card padding="lg">
            <EmptyState
              title="No claims yet"
              description="Start browsing available food donations and claim meals for your community."
              action={{ label: "Browse Available Food", onClick: () => navigate("/ngo/food") }}
            />
          </Card>
        ) : (
          <>
            <DataTable
              data={recentClaims}
              keyExtractor={(claim) => claim._id || claim.id || String(claim.food_post_id)}
              rowClassName="align-middle"
              columns={[
                {
                  key: "food",
                  header: "Food Item",
                  width: "28%",
                  render: (claim) => {
                    const food = getFoodPost(claim);
                    return (
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-warm-100">
                          {food?.image_url ? (
                            <img
                              src={food.image_url}
                              alt={food.food_name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-text-muted">
                              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-dark-gray">{food?.food_name ?? "—"}</p>
                          <p className="truncate text-xs text-text-secondary">{food?.quantity ?? 0} Plates</p>
                        </div>
                      </div>
                    );
                  },
                },
                {
                  key: "donor",
                  header: "Donor",
                  width: "28%",
                  render: (claim) => {
                    const food = getFoodPost(claim);
                    const restaurant = getRestaurant(claim);
                    return (
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-dark-gray">{restaurant?.name ?? "—"}</p>
                          <p className="truncate text-xs text-text-secondary">
                            {restaurant?.area || food?.area || "—"}, Bengaluru
                          </p>
                        </div>
                      </div>
                    );
                  },
                },
                {
                  key: "location",
                  header: "Location",
                  render: (claim) => {
                    const food = getFoodPost(claim);
                    return (
                      <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {food?.area ?? "—"}
                      </div>
                    );
                  },
                },
                {
                  key: "claimedAt",
                  header: "Claimed At",
                  render: (claim) => (
                    <span className="text-sm text-text-secondary">{formatDateFriendly(claim.claim_time)}</span>
                  ),
                },
                {
                  key: "status",
                  header: "Status",
                  render: (claim) => (
                    <StatusBadge status={getDashboardStatus(claim.pickup_status)} />
                  ),
                },
              ]}
            />

            <p className="mt-4 text-center text-sm text-text-muted">
              Showing {recentClaims.length} of {recentClaims.length} claims
            </p>
          </>
        )}
      </div>

      {/* Impact message */}
      <div className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Thank you for helping reduce food waste and support communities in need.
      </div>
    </div>
  );
}
