import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FoodForm } from "../../components/food/FoodForm";
import { PageHeader } from "../../components/common/PageHeader";
import { getFoodById, updateFood } from "../../services/food.service";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import type { FoodPost } from "../../types/food";

export function EditFoodDonation() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<FoodPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchFood = async () => {
      try {
        const response = await getFoodById(id);
        const data = response.data?.data ?? response.data;
        if (data) {
          setInitialData(data);
        } else {
          toast.error("Donation not found");
          navigate("/restaurant/donations");
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load donation details");
        navigate("/restaurant/donations");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFood();
  }, [id, navigate]);

  const handleSubmit = async (data: FormData) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const response = await updateFood(id, data);
      toast.success(response.data?.message || "Food donation updated successfully!");
      navigate("/restaurant/donations");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update donation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" text="Loading donation details..." />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <PageHeader
        title="Edit Food Donation"
        subtitle="Update the details of your food donation."
        icon={
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        }
      />
      <div className="mt-6">
        <FoodForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          initialData={initialData}
          submitText="Update Donation"
          onCancel={() => navigate("/restaurant/donations")}
        />
      </div>
    </div>
  );
}
