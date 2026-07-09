import { useState, type FormEvent } from "react";
import type { CreateFoodData } from "../../types/food";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { Textarea } from "../common/Textarea";
import { Card } from "../common/Card";

interface FoodFormProps {
  onSubmit: (data: FormData) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export function FoodForm({ onSubmit, isSubmitting = false, onCancel }: FoodFormProps) {
  const [formData, setFormData] = useState<Partial<CreateFoodData>>({
    food_type: "Veg",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.food_name?.trim()) newErrors.food_name = "Food name is required";
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = "Quantity must be greater than 0";
    if (!formData.pickup_address?.trim()) newErrors.pickup_address = "Pickup address is required";
    if (!formData.area?.trim()) newErrors.area = "Area is required";
    if (!formData.prepared_time) newErrors.prepared_time = "Prepared time is required";
    if (!formData.safe_until_time) newErrors.safe_until_time = "Safe until time is required";
    if (formData.prepared_time && formData.safe_until_time) {
      if (new Date(formData.safe_until_time) <= new Date(formData.prepared_time)) {
        newErrors.safe_until_time = "Safe until time must be after prepared time";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    data.append("food_name", formData.food_name!);
    data.append("food_type", formData.food_type!);
    data.append("quantity", String(formData.quantity!));
    data.append("pickup_address", formData.pickup_address!);
    data.append("area", formData.area!);
    data.append("prepared_time", formData.prepared_time!);
    data.append("safe_until_time", formData.safe_until_time!);
    if (formData.note) data.append("note", formData.note);
    if (image) data.append("image", image);

    onSubmit(data);
  };

  return (
    <Card padding="lg" className="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Food Name */}
        <Input
          label="Food Name"
          required
          placeholder="e.g. Veg Biryani, Chole with Rice"
          value={formData.food_name || ""}
          onChange={(e) => setFormData({ ...formData, food_name: e.target.value })}
          error={errors.food_name}
        />

        {/* Food Type & Quantity */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Food Type"
            required
            options={[
              { value: "Veg", label: "Veg" },
              { value: "Non-Veg", label: "Non-Veg" },
            ]}
            value={formData.food_type}
            onChange={(e) => setFormData({ ...formData, food_type: e.target.value as "Veg" | "Non-Veg" })}
          />
          <Input
            label="Quantity / Plates"
            type="number"
            required
            min={1}
            placeholder="e.g. 25"
            value={formData.quantity || ""}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            error={errors.quantity}
          />
        </div>

        {/* Times */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Prepared Time"
            type="datetime-local"
            required
            value={formData.prepared_time || ""}
            onChange={(e) => setFormData({ ...formData, prepared_time: e.target.value })}
            error={errors.prepared_time}
          />
          <Input
            label="Safe Until"
            type="datetime-local"
            required
            value={formData.safe_until_time || ""}
            onChange={(e) => setFormData({ ...formData, safe_until_time: e.target.value })}
            error={errors.safe_until_time}
          />
        </div>

        {/* Address & Area */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Pickup Address"
            required
            placeholder="Enter complete pickup address"
            value={formData.pickup_address || ""}
            onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
            error={errors.pickup_address}
            leftIcon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <Input
            label="Area"
            required
            placeholder="e.g. Koramangala, Bengaluru"
            value={formData.area || ""}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            error={errors.area}
          />
        </div>

        {/* Note */}
        <Textarea
          label="Pickup Note"
          placeholder="Add any instructions for pickup (e.g., gate code, parking, contact person)"
          maxLength={200}
          value={formData.note || ""}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          rows={3}
        />

        {/* Image Upload */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-dark-gray">
            Food Image
          </label>
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-lg border-2 border-dashed border-border img-placeholder">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <svg className="h-6 w-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <div>
              <label className="cursor-pointer">
                <span className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text-secondary hover:bg-warm-50 transition-colors">
                  Choose File
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              <p className="mt-1 text-xs text-text-muted">Upload one food image (optional)</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          )}
          <Button type="submit" loading={isSubmitting} className="flex-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Publish Donation
          </Button>
        </div>
      </form>
    </Card>
  );
}
