import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getFoodById, claimFood } from "../../services/food.service";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import type { FoodPost } from "../../types/food";

const formatDateFriendly = (dateStr: string) => {
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

export function FoodDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [food, setFood] = useState<FoodPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await getFoodById(id!);
        // Handle axios payload wrapping
        const data = res.data?.data || res.data;
        setFood(data);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load food details");
        navigate("/ngo/food");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id, navigate]);

  const handleClaim = async () => {
    if (!id) return;
    try {
      setIsClaiming(true);
      await claimFood(id);
      toast.success("Food claimed successfully!");
      navigate("/ngo/claims");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to claim food");
    } finally {
      setIsClaiming(false);
    }
  };

  if (isLoading || !food) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <LoadingSpinner size="lg" text="Loading food details..." />
      </div>
    );
  }

  const restaurant = food.restaurant_id as any;
  const restaurantName = restaurant?.name || "Restaurant";
  const restaurantAddress = restaurant?.address || restaurant?.area || "Address not provided";

  // Dummy fallback for exact matching of design when data might be sparse
  const foodDescription = food.description || `Freshly prepared ${food.food_type === "Veg" ? "vegetarian" : "non-vegetarian"} food ready for donation. Helps reduce food waste and feeds those in need.`;
  const pickupNote = food.note || "Please bring your own carry bags or containers.";

  return (
    <div className="p-4 lg:p-8">
      {/* Breadcrumb Header */}
      <div className="mb-6 flex items-center text-sm">
        <Link to="/ngo/food" className="text-gray-500 hover:text-gray-900 transition-colors">
          Available Food
        </Link>
        <svg className="mx-2 h-4 w-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-semibold text-gray-800">Food Details</span>
      </div>

      {/* Main Card */}
      <div className="w-full rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:gap-12">
          
          {/* Left Column: Image */}
          <div className="w-full h-[250px] md:h-auto md:w-[45%] shrink-0">
            <div className="relative h-full w-full overflow-hidden rounded-[20px] bg-warm-50 shadow-sm">
              {food.image_url ? (
                <img
                  src={food.image_url}
                  alt={food.food_name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="mt-8 flex flex-1 flex-col md:mt-0">
            
            {/* Title & Restaurant */}
            <h1 className="text-3xl font-bold text-gray-900 md:text-[34px]">{food.food_name}</h1>
            
            <div className="mt-2.5 flex items-center gap-2 text-base font-semibold text-gray-800">
              <svg className="h-[18px] w-[18px] shrink-0 text-[#FF5A25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72l1.06-4.582A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72" />
              </svg>
              <span>{restaurantName}</span>
            </div>

            <p className="mt-4 text-[15px] font-medium leading-relaxed text-gray-500 max-w-[95%]">
              {foodDescription}
            </p>

            {/* Grid of Key Info (2 cols) */}
            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
              
              {/* Box 1: Quantity */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0F7F2] text-[#1B7A3E]">
                  <svg className="h-[22px] w-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                </div>
                <div className="pt-0.5">
                  <p className="text-[13px] font-bold text-gray-900 leading-none">Quantity</p>
                  <p className="mt-1.5 text-[14px] font-medium text-gray-700 leading-none">{food.quantity} Plates</p>
                </div>
              </div>

              {/* Box 2: Safe Until */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0F7F2] text-[#1B7A3E]">
                  <svg className="h-[22px] w-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="pt-0.5">
                  <p className="text-[13px] font-bold text-gray-900 leading-none">Safe Until</p>
                  <p className="mt-1.5 text-[14px] font-medium text-[#FF5A25] leading-none">{formatDateFriendly(food.safe_until_time)}</p>
                </div>
              </div>

              {/* Box 3: Prepared At */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0F7F2] text-[#1B7A3E]">
                  <svg className="h-[22px] w-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="pt-0.5">
                  <p className="text-[13px] font-bold text-gray-900 leading-none">Prepared At</p>
                  <p className="mt-1.5 text-[14px] font-medium text-gray-700 leading-none">{formatDateFriendly(food.prepared_time)}</p>
                </div>
              </div>

              {/* Box 4: Pickup Note */}
              <div className="flex items-start gap-4 pr-2">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0F7F2] text-[#1B7A3E]">
                  <svg className="h-[22px] w-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                </div>
                <div className="pt-0.5">
                  <p className="text-[13px] font-bold text-gray-900 leading-none">Pickup Note</p>
                  <p className="mt-1.5 text-[13px] font-medium text-gray-600 leading-relaxed">{pickupNote}</p>
                </div>
              </div>

              {/* Box 5: Pickup Address (Spans Full Width on lg, normal on small) */}
              <div className="col-span-1 sm:col-span-2 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0F7F2] text-[#1B7A3E]">
                  <svg className="h-[22px] w-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div className="pt-0.5 max-w-[400px]">
                  <p className="text-[13px] font-bold text-gray-900 leading-none">Pickup Address</p>
                  <p className="mt-1.5 text-[14px] font-medium text-gray-600 leading-relaxed">{restaurantAddress}</p>
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(restaurantAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-block text-[13px] font-bold text-[#1B7A3E] hover:underline"
                  >
                    View on Map
                  </a>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Action Bar (Footer) */}
        <div className="mt-12 flex flex-col gap-4 border-t border-gray-100 pt-7 sm:flex-row">
          <button
            onClick={() => navigate(-1)}
            disabled={isClaiming}
            className="flex flex-1 items-center justify-center rounded-[14px] border border-[#1B7A3E] py-4 text-center font-medium text-[#1B7A3E] transition-colors hover:bg-[#E8F3EC] disabled:opacity-70"
          >
            Go Back
          </button>
          
          <button
            onClick={handleClaim}
            disabled={isClaiming || food.status !== "Available"}
            className="flex flex-col flex-1 items-center justify-center rounded-[14px] bg-[#166534] py-3 text-white shadow-[0_8px_20px_rgba(22,101,52,0.2)] transition hover:bg-[#14532d] disabled:bg-gray-400 disabled:shadow-none"
          >
            <div className="flex items-center gap-2 text-[16px] font-semibold">
              {isClaiming ? (
                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              )}
              {isClaiming ? "Claiming..." : "Claim This Food"}
            </div>
            {!isClaiming && (
              <span className="mt-0.5 text-[12px] font-medium text-green-100">
                You can claim this food now
              </span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
