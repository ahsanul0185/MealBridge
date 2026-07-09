import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FoodForm } from "../../components/food/FoodForm";
import { PageHeader } from "../../components/common/PageHeader";
import { createFood } from "../../services/food.service";

export function AddFoodDonation() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await createFood(data);
      toast.success(response.data?.message || "Food donation published successfully!");
      navigate("/restaurant/donations");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to publish donation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <PageHeader
        title="Add Food Donation"
        subtitle="Fill in the details to donate food."
        icon={
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        }
      />
      <div className="mt-6">
        <FoodForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
