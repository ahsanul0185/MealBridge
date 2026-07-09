import api from "../lib/axios";

export interface FoodFilters {
  area?: string;
  food_type?: string;
  search?: string;
  quantity?: number;
  safe_until?: string;
  page?: number;
  limit?: number;
}

export const createFood = (data: FormData) =>
  api.post("/food", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getAvailableFood = (filters?: FoodFilters) =>
  api.get("/food/available", { params: filters });

export const getFoodById = (id: string) =>
  api.get(`/food/${id}`);

export const getMyPosts = (page?: number, limit?: number) =>
  api.get("/food/my-posts", { params: { page, limit } });

export const updateFood = (id: string, data: any) =>
  api.put(`/food/${id}`, data, {
    headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });

export const cancelFood = (id: string) =>
  api.put(`/food/${id}/cancel`);

export const getClaimInfo = (id: string) =>
  api.get(`/food/${id}/claim-info`);

export const markHandedOver = (id: string) =>
  api.put(`/food/${id}/handed-over`);

export const claimFood = (id: string) =>
  api.post(`/food/${id}/claim`);
