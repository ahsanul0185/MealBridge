import api from "./axios";

export interface FoodFilters {
  area?: string;
  food_type?: string;
}

export const foodApi = {
  create: (data: FormData) =>
    api.post("/food", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getAvailable: (filters?: FoodFilters) =>
    api.get("/food/available", { params: filters }),
  getById: (id: string) => api.get(`/food/${id}`),
  getMyPosts: () => api.get("/food/my-posts"),
  update: (id: string, data: any) => api.put(`/food/${id}`, data),
  cancel: (id: string) => api.put(`/food/${id}/cancel`),
  getClaimInfo: (id: string) => api.get(`/food/${id}/claim-info`),
  markHandedOver: (id: string) => api.put(`/food/${id}/handed-over`),
  claim: (id: string) => api.post(`/food/${id}/claim`),
};
