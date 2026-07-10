import api from "../lib/axios";

export interface GetMyClaimsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  donor?: string;
  from?: string;
  to?: string;
}

export const getMyClaims = (params: GetMyClaimsParams = {}) =>
  api.get("/claims/my-claims", { params });

export const updatePickupStatus = (
  id: string,
  pickup_status: "On the way" | "Picked up"
) => api.put(`/claims/${id}/status`, { pickup_status });

export const markPickedUp = (id: string) =>
  api.put(`/claims/${id}/picked-up`);
