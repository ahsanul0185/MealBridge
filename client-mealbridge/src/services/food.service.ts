import api from "../lib/axios";

export interface FoodFilters {
  area?: string;
  food_type?: string;
}

export const createFood = (data: FormData) =>
  api.post("/food", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getAvailableFood = (filters?: FoodFilters) =>
  api.get("/food/available", { params: filters });

export const getFoodById = (id: string) =>
  api.get(`/food/${id}`);

export const getMyPosts = () =>
  api.get("/food/my-posts");

export const updateFood = (id: string, data: any) =>
  api.put(`/food/${id}`, data);

export const cancelFood = (id: string) =>
  api.put(`/food/${id}/cancel`);

export const getClaimInfo = (id: string) =>
  api.get(`/food/${id}/claim-info`);

export const markHandedOver = (id: string) =>
  api.put(`/food/${id}/handed-over`);

export const claimFood = (id: string) =>
  api.post(`/food/${id}/claim`);
