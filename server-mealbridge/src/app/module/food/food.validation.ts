import { z } from "zod";

const foodTypeEnum = z.enum(["Veg", "Non-Veg"]);
const statusEnum = z.enum([
  "Available",
  "Claimed",
  "On the way",
  "Picked up",
  "Expired",
  "Cancelled",
]);

const createFood = z.object({
  body: z.object({
    food_name: z.string().min(1, "Food name is required"),
    food_type: foodTypeEnum,
    quantity: z.number().min(1, "Quantity must be greater than 0"),
    pickup_address: z.string().min(1, "Pickup address is required"),
    area: z.string().min(1, "Area is required"),
    prepared_time: z.string().datetime(),
    safe_until_time: z.string().datetime(),
    note: z.string().optional(),
  }).refine((data) => {
    return new Date(data.safe_until_time) > new Date(data.prepared_time);
  }, {
    message: "Safe until time must be after prepared time",
    path: ["safe_until_time"],
  }),
});

export const foodValidation = {
  createFood,
};
