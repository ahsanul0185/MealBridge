import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getRestaurantDashboard } from "../../services/dashboard.service";
import { DataTable } from "../../components/common/DataTable";
import { Card, StatCard } from "../../components/common/Card";
import { StatusBadge } from "../../components/common/Badge";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { DropdownMenu } from "../../components/common/DropdownMenu";
import type { FoodPost } from "../../types/food";
import { getProfile, type User } from "../../services/auth.service";

interface DashboardData {
  stats: {
    totalPosts: number;
    availablePosts: number;
    claimedPosts: number;
    totalPlates: number;
    expiringSoon: number;
  };
  recentDonations: FoodPost[];
}

const formatDateFriendly = (dateStr: Date | string) => {
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

export function RestaurantDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dashRes, profileRes] = await Promise.all([
          getRestaurantDashboard(),
          getProfile(),
        ]);
        setData(dashRes.data?.data || null);
        setUser(profileRes.data);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const { stats, recentDonations } = data;

  const getDropdownItems = (item: FoodPost) => [
    {
      label: "View Details",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      onClick: () => navigate("/restaurant/donations"),
    },
    ...(item.status === "Available"
      ? [
          {
            label: "Edit Donation",
            icon: (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            ),
            onClick: () => navigate(`/restaurant/edit/${item.id || (item as any)._id}`),
          },
        ]
      : [])
  ];

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good morning, {user?.name} 👋</h1>
          <p className="mt-1 text-sm text-gray-500">Here's an overview of your food donations.</p>
        </div>
        <button
          onClick={() => navigate("/restaurant/donate")}
          className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-800"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Donation
        </button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Donations"
          value={stats.availablePosts}
          sublabel="Available for claim"
          iconBg="bg-green-50 text-green-700"
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
            </svg>
          }
        />
        <StatCard
          label="Claimed Donations"
          value={stats.claimedPosts}
          sublabel="Meals claimed"
          iconBg="bg-blue-50 text-blue-600"
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          }
        />
        <StatCard
          label="Expiring Soon"
          value={stats.expiringSoon}
          sublabel="Within next 2 hours"
          iconBg="bg-orange-50 text-orange-600"
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Total Donations"
          value={stats.totalPosts}
          sublabel="All time donations"
          iconBg="bg-green-50 text-green-700"
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          }
        />
      </div>

      <Card padding="none" className="mb-8 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="text-lg font-semibold text-dark-gray">Recent Donations</h2>
          <Link to="/restaurant/donations" className="text-sm font-medium text-primary hover:text-primary-dark">
            View All
          </Link>
        </div>
        <DataTable
          data={recentDonations}
          keyExtractor={(item) => item.id || (item as any)._id}
          columns={[
            {
              key: "food_item",
              header: "Food Item",
              width: "35%",
              render: (item) => (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden bg-warm-50 border border-border">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.food_name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.food_name}</p>
                    <p className="text-xs text-gray-500">{item.quantity} Plates</p>
                  </div>
                </div>
              ),
            },
            {
              key: "prepared_at",
              header: "Prepared At",
              render: (item) => <span className="text-gray-500">{formatDateFriendly(item.prepared_time)}</span>,
            },
            {
              key: "safe_until_time",
              header: "Expires At",
              render: (item) => <span className="text-gray-500">{formatDateFriendly(item.safe_until_time)}</span>,
            },
            {
              key: "status",
              header: "Status",
              render: (item) => <StatusBadge status={item.status} size="sm" />,
            },
            {
              key: "actions",
              header: "",
              align: "right",
              render: (item) => (
                <div className="flex justify-end">
                  <DropdownMenu
                    align="right"
                    trigger={
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    }
                    items={getDropdownItems(item)}
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
