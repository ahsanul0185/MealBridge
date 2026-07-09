import api from "./axios";

export const claimApi = {
  getMyClaims: () => api.get("/claims/my-claims"),
  updateStatus: (id: string, pickup_status: "On the way" | "Picked up") =>
    api.put(`/claims/${id}/status`, { pickup_status }),
  markPickedUp: (id: string) => api.put(`/claims/${id}/picked-up`),
};
