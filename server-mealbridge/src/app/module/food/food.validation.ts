import { z } from "zod";

const foodTypeEnum = z.enum(["Veg", "Non-Veg"]);

const createFood = z.object({
  body: z.object({
    food_name: z.string().min(1, "Food name is required"),
    food_type: foodTypeEnum,
    quantity: z.coerce.number().min(1, "Quantity must be greater than 0"),
    pickup_address: z.string().min(1, "Pickup address is required"),
    area: z.string().min(1, "Area is required"),
    prepared_time: z.string().min(1, "Prepared time is required"),
    safe_until_time: z.string().min(1, "Safe until time is required"),
    note: z.string().optional(),
  }).refine((data) => {
    return new Date(data.safe_until_time) > new Date(data.prepared_time);
  }, {
    message: "Safe until time must be after prepared time",
    path: ["safe_until_time"],
  }),
});

const updateFood = z.object({
  body: z.object({
    food_name: z.string().min(1, "Food name is required").optional(),
    food_type: foodTypeEnum.optional(),
    quantity: z.coerce.number().min(1, "Quantity must be greater than 0").optional(),
    pickup_address: z.string().min(1, "Pickup address is required").optional(),
    area: z.string().min(1, "Area is required").optional(),
    prepared_time: z.string().min(1, "Prepared time is required").optional(),
    safe_until_time: z.string().min(1, "Safe until time is required").optional(),
    note: z.string().optional(),
  }).refine((data) => {
    if (data.prepared_time && data.safe_until_time) {
      return new Date(data.safe_until_time) > new Date(data.prepared_time);
    }
    return true;
  }, {
    message: "Safe until time must be after prepared time",
    path: ["safe_until_time"],
  }),
});

export const foodValidation = {
  createFood,
  updateFood,
};
