import { z } from "zod";

const updateStatus = z.object({
  body: z.object({
    pickup_status: z.enum(["On the way", "Picked up"]),
  }),
});

export const claimValidation = {
  updateStatus,
};
