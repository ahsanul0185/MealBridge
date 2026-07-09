import api from "../lib/axios";

export const getMyClaims = () =>
  api.get("/claims/my-claims");

export const updatePickupStatus = (
  id: string,
  pickup_status: "On the way" | "Picked up"
) => api.put(`/claims/${id}/status`, { pickup_status });

export const markPickedUp = (id: string) =>
  api.put(`/claims/${id}/picked-up`);
