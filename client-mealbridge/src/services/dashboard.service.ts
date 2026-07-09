import api from "../lib/axios";

export const getRestaurantDashboard = () =>
  api.get("/dashboard/restaurant");

export const getNgoDashboard = () =>
  api.get("/dashboard/ngo");
