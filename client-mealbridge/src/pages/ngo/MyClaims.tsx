import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useClaims } from "../../hooks/useClaims";
import { PageHeader } from "../../components/common/PageHeader";
import { StatCard } from "../../components/common/Card";
import { DataTable } from "../../components/common/DataTable";
import { Pagination } from "../../components/common/Pagination";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { EmptyState } from "../../components/common/EmptyState";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";
import { StatusBadge } from "../../components/common/Badge";
import type { Claim, FoodPostInfo, RestaurantInfo } from "../../types/claim";

const LIMIT = 10;

type DateRange = "all" | "today" | "week" | "month";

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

function getClaimId(claim: Claim): string {
  const rawId = claim._id ?? claim.id;
  return rawId ? String(rawId) : "";
}

function formatClaimId(claim: Claim) {
  const id = getClaimId(claim);
  if (!id) return "MB-CLM-000000";
  const suffix = id.slice(-6).toUpperCase();
  return `MB-CLM-${suffix}`;
}

function formatDateTime(dateStr?: string | null) {
  if (!dateStr) {
    return { date: "—", time: "" };
  }
  const date = new Date(dateStr);
  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
}

function getDateRangeBounds(range: DateRange): { from?: string; to?: string } {
  if (range === "all") return {};

  const now = new Date();
  const to = now.toISOString();
  const from = new Date();

  switch (range) {
    case "today":
      from.setHours(0, 0, 0, 0);
      break;
    case "week":
      from.setDate(now.getDate() - 7);
      break;
    case "month":
      from.setDate(now.getDate() - 30);
      break;
  }

  return { from: from.toISOString(), to };
}

export function MyClaims() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const searchParam = searchParams.get("search") || "";
  const statusParam = searchParams.get("status") || "all";
  const donorParam = searchParams.get("donor") || "";
  const dateRangeParam = (searchParams.get("date_range") || "all") as DateRange;

  const [searchInput, setSearchInput] = useState(searchParam);
  const [donorInput, setDonorInput] = useState(donorParam);

  const { from, to } = useMemo(() => getDateRangeBounds(dateRangeParam), [dateRangeParam]);

  const filters = useMemo(
    () => ({
      page: currentPage,
      limit: LIMIT,
      search: searchParam || undefined,
      status: statusParam === "all" ? undefined : statusParam,
      donor: donorParam || undefined,
      from,
      to,
    }),
    [currentPage, searchParam, statusParam, donorParam, from, to]
  );

  const { claims, stats, meta, isLoading } = useClaims(filters);

  // Sync local inputs with URL params
  useEffect(() => {
    setSearchInput(searchParam);
    setDonorInput(donorParam);
  }, [searchParam, donorParam]);

  // Debounce search input → URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchParam) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          if (searchInput) {
            next.set("search", searchInput);
          } else {
            next.delete("search");
          }
          next.set("page", "1");
          return next;
        });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, searchParam, setSearchParams]);

  // Debounce donor input → URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (donorInput !== donorParam) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          if (donorInput) {
            next.set("donor", donorInput);
          } else {
            next.delete("donor");
          }
          next.set("page", "1");
          return next;
        });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [donorInput, donorParam, setSearchParams]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set("page", "1");
    setSearchParams(next);
  };

  const handlePageChange = (page: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    setSearchParams(next);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateParam("search", searchInput);
    }
  };

  const handleDonorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateParam("donor", donorInput);
    }
  };

  const handleViewDetails = (claim: Claim) => {
    const claimId = getClaimId(claim);
    if (claimId) {
      navigate(`/ngo/pickups/${claimId}`);
    }
  };

  const totalPages = meta ? Math.ceil(meta.total / LIMIT) : 1;
  const showingStart = meta && meta.total > 0 ? (currentPage - 1) * LIMIT + 1 : 0;
  const showingEnd = meta ? Math.min(currentPage * LIMIT, meta.total) : 0;

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "Claimed", label: "Claimed" },
    { value: "On the way", label: "On the Way" },
    { value: "Picked up", label: "Picked Up" },
  ];

  const dateRangeOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "Last 7 Days" },
    { value: "month", label: "Last 30 Days" },
  ];

  const statCards = [
    {
      label: "Claimed",
      value: stats?.claimed ?? 0,
      sublabel: "Total claimed",
      iconBg: "bg-green-100 text-green-700",
      statusFilter: "Claimed",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "On the Way",
      value: stats?.onTheWay ?? 0,
      sublabel: "En route to you",
      iconBg: "bg-blue-100 text-blue-700",
      statusFilter: "On the way",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      ),
    },
    {
      label: "Picked Up",
      value: stats?.pickedUp ?? 0,
      sublabel: "Successfully picked up",
      iconBg: "bg-indigo-100 text-indigo-700",
      statusFilter: "Picked up",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      label: "Expired / Cancelled",
      value: stats?.expiredOrCancelled ?? 0,
      sublabel: "Not completed",
      iconBg: "bg-gray-100 text-gray-700",
      statusFilter: null,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const hasActiveFilters = searchParam || statusParam !== "all" || donorParam || dateRangeParam !== "all";

  return (
    <div className="page-transition p-4 lg:p-8">
      <PageHeader
        title="My Claims"
        subtitle="Track and manage all food donations you've claimed."
      />

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard
            key={card.label}
            icon={card.icon}
            iconBg={card.iconBg}
            label={card.label}
            value={card.value}
            sublabel={card.sublabel}
            onClick={() => {
              if (card.statusFilter) {
                updateParam("status", card.statusFilter);
              } else {
                setSearchParams(new URLSearchParams());
              }
            }}
          />
        ))}
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1 sm:max-w-sm">
          <Input
            label="Search"
            labelClassName="text-[12px] font-medium text-gray-500"
            placeholder="Search by food item or donor"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            leftIcon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            rightIcon={
              searchInput ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    updateParam("search", "");
                  }}
                  className="text-text-muted hover:text-dark-gray"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : null
            }
          />
        </div>

        <div className="w-44">
          <Select
            label="Status"
            labelClassName="text-[12px] font-medium text-gray-500"
            options={statusOptions}
            value={statusParam}
            onChange={(e) => updateParam("status", e.target.value)}
          />
        </div>

        <div className="w-48">
          <Input
            label="Donor"
            labelClassName="text-[12px] font-medium text-gray-500"
            placeholder="Filter by donor..."
            value={donorInput}
            onChange={(e) => setDonorInput(e.target.value)}
            onKeyDown={handleDonorKeyDown}
            leftIcon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
        </div>

        <div className="w-44">
          <Select
            label="Date Range"
            labelClassName="text-[12px] font-medium text-gray-500"
            options={dateRangeOptions}
            value={dateRangeParam}
            onChange={(e) => updateParam("date_range", e.target.value)}
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => setSearchParams(new URLSearchParams())}
            className="mb-3 text-sm text-text-muted underline hover:text-dark-gray"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-border bg-white">
            <LoadingSpinner size="lg" text="Loading your claims..." />
          </div>
        ) : claims.length === 0 ? (
          <div className="rounded-xl border border-border bg-white">
            <EmptyState
              title="No claims found"
              description={
                hasActiveFilters
                  ? "No claims match your current filters. Try adjusting them."
                  : "You haven't claimed any food donations yet. Browse available food to get started."
              }
              action={
                !hasActiveFilters
                  ? { label: "Browse Available Food", onClick: () => navigate("/ngo/food") }
                  : undefined
              }
            />
          </div>
        ) : (
          <>
            <DataTable
              data={claims}
              keyExtractor={(claim) => getClaimId(claim) || String(claim.food_post_id)}
              rowClassName="align-middle"
              columns={[
                {
                  key: "food",
                  header: "Food Item & Donor",
                  width: "30%",
                  render: (claim) => {
                    const food = getFoodPost(claim);
                    const restaurant = getRestaurant(claim);
                    const imageUrl = food?.image_url;
                    return (
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-warm-100">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={food?.food_name}
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
                          <p className="truncate text-xs text-text-secondary">{restaurant?.name ?? "—"}</p>
                        </div>
                      </div>
                    );
                  },
                },
                {
                  key: "claimId",
                  header: "Claim ID",
                  render: (claim) => (
                    <span className="font-medium text-primary">{formatClaimId(claim)}</span>
                  ),
                },
                {
                  key: "claimedOn",
                  header: "Claimed On",
                  render: (claim) => {
                    const formatted = formatDateTime(claim.claim_time);
                    return (
                      <div>
                        <p className="text-sm text-dark-gray">{formatted.date}</p>
                        <p className="text-xs text-text-secondary">{formatted.time}</p>
                      </div>
                    );
                  },
                },
                {
                  key: "quantity",
                  header: "Quantity",
                  render: (claim) => {
                    const food = getFoodPost(claim);
                    return <span className="text-sm text-dark-gray">{food?.quantity ?? 0} Plates</span>;
                  },
                },
                {
                  key: "status",
                  header: "Status",
                  render: (claim) => <StatusBadge status={claim.pickup_status} />,
                },
                {
                  key: "estimatedCompleted",
                  header: "Estimated / Completed",
                  render: (claim) => {
                    const food = getFoodPost(claim);
                    const dateStr = claim.picked_up_time || food?.safe_until_time;
                    const label = claim.picked_up_time ? "Completed" : "Estimated";
                    const formatted = formatDateTime(dateStr);
                    return (
                      <div>
                        <p className="text-sm text-dark-gray">{formatted.date}</p>
                        <p className="text-xs text-text-secondary">
                          {formatted.time} • {label}
                        </p>
                      </div>
                    );
                  },
                },
                {
                  key: "actions",
                  header: "Actions",
                  align: "right",
                  render: (claim) => (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(claim)}
                    >
                      View Details
                    </Button>
                  ),
                },
              ]}
            />

            <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <p className="text-sm text-text-muted">
                Showing {showingStart} to {showingEnd} of {meta?.total ?? 0} claims
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
