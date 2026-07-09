import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getAvailableFood } from "../../services/food.service";
import { FoodCard } from "../../components/food/FoodCard";
import { Pagination } from "../../components/common/Pagination";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Input } from "../../components/common/Input";
import type { FoodPost } from "../../types/food";

const LIMIT = 8;

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface GlobalStats {
  totalListings: number;
  totalServings: number;
  restaurantsCount: number;
}

export function AvailableFood() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const areaParam = searchParams.get("area") || "";
  const foodTypeParam = searchParams.get("food_type") || "";
  const searchParam = searchParams.get("search") || "";

  const [foods, setFoods] = useState<FoodPost[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Local controlled search value (debounced to URL)
  const [searchInput, setSearchInput] = useState(searchParam);

  const fetchFoods = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAvailableFood({
        page: currentPage,
        limit: LIMIT,
        area: areaParam || undefined,
        food_type: (foodTypeParam as any) || undefined,
      });

      // New shape: response.data.data = { items, stats }, response.data.meta = { total, ... }
      const payload = response.data?.data;
      const items: FoodPost[] = payload?.items ?? payload?.data ?? payload ?? [];
      const metaInfo: Meta = response.data?.meta ?? {
        total: items.length,
        page: currentPage,
        limit: LIMIT,
        totalPages: Math.ceil(items.length / LIMIT),
      };

      const globalStats: GlobalStats = payload?.stats ?? {
        totalListings: metaInfo.total,
        totalServings: 0,
        restaurantsCount: 0,
      };

      setFoods(items);
      setMeta(metaInfo);
      setStats(globalStats);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load available food");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, areaParam, foodTypeParam]);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  // Sync searchInput from URL on mount
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
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

  const handleFoodTypeFilter = (type: string) => {
    updateParam("food_type", foodTypeParam === type ? "" : type);
  };

  const handleViewDetails = (food: FoodPost) => {
    navigate(`/ngo/food/${food.id || (food as any)._id}`);
  };

  const totalPages = meta ? Math.ceil(meta.total / LIMIT) : 1;
  const showingStart = meta && meta.total > 0 ? (currentPage - 1) * LIMIT + 1 : 0;
  const showingEnd = meta ? Math.min(currentPage * LIMIT, meta.total) : 0;

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-gray">Available Food</h1>
          <p className="mt-1 text-sm text-text-secondary">Browse and claim food donations from restaurants.</p>
        </div>

        {/* Stat pills — 3 segments matching screenshot exactly */}
        {stats && (
          <div
            className="flex shrink-0 items-center overflow-hidden rounded-xl bg-green-50 border border-green-200"
          >
            {/* Available Listings */}
            <div className="flex items-center gap-3 px-5 py-3.5">
              {/* Grid/listing icon */}
              <svg className="h-5 w-5 shrink-0" style={{ color: "#1B7A3E" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
              <div>
                <p className="text-lg font-bold leading-none" style={{ color: "#1B7A3E" }}>{stats.totalListings.toLocaleString()}</p>
                <p className="text-xs mt-0.5" style={{ color: "#4A6B52" }}>Available Listings</p>
              </div>
            </div>

            <span className="w-0.5 bg-green-200 h-8"></span>

            {/* Total Servings */}
            <div className="flex items-center gap-3 px-5 py-3.5">
              {/* People/servings icon */}
              <svg className="h-5 w-5 shrink-0" style={{ color: "#1B7A3E" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              <div>
                <p className="text-lg font-bold leading-none" style={{ color: "#1B7A3E" }}>{stats.totalServings.toLocaleString()}</p>
                <p className="text-xs mt-0.5" style={{ color: "#4A6B52" }}>Total Servings</p>
              </div>
            </div>

            <span className="w-0.5 bg-green-200 h-8"></span>

            {/* Restaurants */}
            <div className="flex items-center gap-3 px-5 py-3.5">
              {/* Building/restaurant icon */}
              <svg className="h-5 w-5 shrink-0" style={{ color: "#1B7A3E" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
              <div>
                <p className="text-lg font-bold leading-none" style={{ color: "#1B7A3E" }}>{stats.restaurantsCount.toLocaleString()}</p>
                <p className="text-xs mt-0.5" style={{ color: "#4A6B52" }}>Restaurants</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters row */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="min-w-0 flex-1 sm:max-w-sm">
          <Input
            placeholder="Search by food name..."
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
                  onClick={() => { setSearchInput(""); updateParam("search", ""); }}
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

        {/* Area filter */}
        <Input
          placeholder="Filter by area..."
          value={areaParam}
          onChange={(e) => updateParam("area", e.target.value)}
          fullWidth={false}
          className="w-44"
          leftIcon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />

        {/* Food type toggle */}
        <div className="flex overflow-hidden rounded-lg border border-border bg-white">
          {["Veg", "Non-Veg"].map((type) => (
            <button
              key={type}
              onClick={() => handleFoodTypeFilter(type)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                foodTypeParam === type
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-warm-50 hover:text-dark-gray"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Clear all filters */}
        {(areaParam || foodTypeParam || searchParam) && (
          <button
            onClick={() => {
              setSearchInput("");
              setSearchParams(new URLSearchParams());
            }}
            className="text-sm text-text-muted underline hover:text-dark-gray"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <LoadingSpinner size="lg" text="Loading available food..." />
        </div>
      ) : foods.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 rounded-xl border border-border bg-white text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warm-50">
            <svg className="h-8 w-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-base font-semibold text-dark-gray">No food available</p>
            <p className="mt-1 text-sm text-text-muted">Try adjusting your filters or check back later.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {foods.map((food) => (
              <FoodCard
                key={food.id || (food as any)._id}
                food={food}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {/* Footer: count + pagination */}
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-sm text-text-muted">
              Showing {showingStart} to {showingEnd} of {meta?.total ?? 0} listings
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
  );
}
