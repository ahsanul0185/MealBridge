import api from "./axios";

export const dashboardApi = {
  getRestaurant: () => api.get("/dashboard/restaurant"),
  getNGO: () => api.get("/dashboard/ngo"),
};
