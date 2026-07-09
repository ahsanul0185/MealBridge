import { z } from "zod";

const updateStatus = z.object({
  body: z.object({
    pickup_status: z.enum(["On the way", "Picked up"], {
      invalid_type_error: "Pickup status must be 'On the way' or 'Picked up'",
    }),
  }),
});

export const claimValidation = {
  updateStatus,
};
