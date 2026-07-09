import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { PageHeader } from "../../components/common/PageHeader";
import { DataTable } from "../../components/common/DataTable";
import { Pagination } from "../../components/common/Pagination";
import { StatusBadge, FoodTypeBadge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { ConfirmDialog } from "../../components/common/Modal";
import { EmptyState } from "../../components/common/EmptyState";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { getMyPosts, cancelFood } from "../../services/food.service";
import { formatDate } from "../../utils/helpers";
import type { FoodPost, FoodStatus } from "../../types/food";

const TABS: { value: "All" | FoodStatus; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Available", label: "Available" },
  { value: "Claimed", label: "Claimed" },
  { value: "On the way", label: "On the way" },
  { value: "Picked up", label: "Picked Up" },
  { value: "Expired", label: "Expired" },
  { value: "Cancelled", label: "Cancelled" },
];

const LIMIT = 8;

export function MyDonations() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const statusParam = searchParams.get("status") || "All";
  const currentStatus = TABS.some((t) => t.value === statusParam) ? (statusParam as "All" | FoodStatus) : "All";
  const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const [allPosts, setAllPosts] = useState<FoodPost[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelId, setCancelId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await getMyPosts(1, 1000);
        const posts = (response.data?.data || []) as FoodPost[];
        const meta = response.data?.meta;
        setAllPosts(posts);
        setTotal(meta?.total || posts.length);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load donations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    if (currentStatus === "All") return allPosts;
    return allPosts.filter((post) => post.status === currentStatus);
  }, [allPosts, currentStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / LIMIT));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * LIMIT;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + LIMIT);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      const params = new URLSearchParams(searchParams);
      params.set("page", String(totalPages));
      setSearchParams(params, { replace: true });
    }
  }, [currentPage, totalPages, searchParams, setSearchParams]);

  const handleStatusChange = (status: "All" | FoodStatus) => {
    const params = new URLSearchParams(searchParams);
    if (status === "All") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
  };

  const handleCancel = async () => {
    if (!cancelId) return;
    try {
      await cancelFood(cancelId);
      toast.success("Donation cancelled successfully");
      setAllPosts((prev) =>
        prev.map((post) => (post.id === cancelId ? { ...post, status: "Cancelled" as FoodStatus } : post))
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel donation");
    } finally {
      setCancelId(null);
    }
  };

  const getTabCount = (status: "All" | FoodStatus) => {
    if (status === "All") return total;
    return allPosts.filter((post) => post.status === status).length;
  };

  const showingStart = filteredPosts.length === 0 ? 0 : startIndex + 1;
  const showingEnd = Math.min(startIndex + LIMIT, filteredPosts.length);

  return (
    <div>
      <PageHeader
        title="My Donations"
        subtitle="Track and manage all your food donations."
        action={{
          label: "Add Donation",
          onClick: () => navigate("/restaurant/donate"),
          icon: (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          ),
        }}
      />

      {/* Filter Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const isActive = currentStatus === tab.value;
          const count = getTabCount(tab.value);
          return (
            <button
              key={tab.value}
              onClick={() => handleStatusChange(tab.value)}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-primary bg-primary-50 text-primary"
                  : "border-border bg-white text-text-secondary hover:bg-warm-50 hover:text-dark-gray"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  isActive ? "bg-primary text-white" : "bg-warm-100 text-text-secondary"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <LoadingSpinner size="lg" text="Loading donations..." />
          </div>
        ) : (
          <DataTable
            data={paginatedPosts}
            keyExtractor={(item) => item.id}
            emptyState={
              <EmptyState
                title="No donations found"
                description={
                  currentStatus === "All"
                    ? "You haven't created any food donations yet."
                    : `You don't have any ${currentStatus.toLowerCase()} donations.`
                }
                action={{
                  label: "Add Donation",
                  onClick: () => navigate("/restaurant/donate"),
                }}
              />
            }
            columns={[
              {
                key: "food_item",
                header: "Food Item",
                width: "30%",
                render: (item) => (
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-warm-50">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.food_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-text-muted">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-dark-gray">{item.food_name}</p>
                      <FoodTypeBadge type={item.food_type} size="sm" />
                    </div>
                  </div>
                ),
              },
              {
                key: "quantity",
                header: "Quantity",
                render: (item) => `${item.quantity} Plates`,
              },
              {
                key: "area",
                header: "Area",
                render: (item) => item.area,
              },
              {
                key: "status",
                header: "Status",
                render: (item) => <StatusBadge status={item.status} size="sm" />,
              },
              {
                key: "created_at",
                header: "Posted On",
                render: (item) => (item.created_at ? formatDate(item.created_at) : "—"),
              },
              {
                key: "safe_until_time",
                header: "Expires At",
                render: (item) => formatDate(item.safe_until_time),
              },
              {
                key: "actions",
                header: "Actions",
                align: "right",
                render: (item) => (
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/restaurant/donations/${item.id}`)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-warm-50 hover:text-primary transition-colors"
                      title="View details"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    {item.status !== "Picked up" && item.status !== "Cancelled" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCancelId(item.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>

      {/* Pagination Footer */}
      {!isLoading && filteredPosts.length > 0 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-text-secondary">
            Showing {showingStart} to {showingEnd} of {filteredPosts.length} donations
          </p>
          <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}

      <ConfirmDialog
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={handleCancel}
        title="Cancel Donation"
        message="Are you sure you want to cancel this food donation? This action cannot be undone."
        confirmLabel="Cancel Donation"
        cancelLabel="Keep Donation"
        confirmVariant="danger"
      />
    </div>
  );
}
