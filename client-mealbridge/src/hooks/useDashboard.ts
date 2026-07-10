import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as dashboardService from "../services/dashboard.service";
import type { NgoDashboardData, RestaurantDashboardData } from "../types/dashboard";

export function useRestaurantDashboard() {
  const [data, setData] = useState<RestaurantDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await dashboardService.getRestaurantDashboard();
      setData(response.data?.data ?? null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { data, isLoading, refetch: fetchDashboard };
}

export function useNgoDashboard() {
  const [data, setData] = useState<NgoDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await dashboardService.getNgoDashboard();
      setData(response.data?.data ?? null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { data, isLoading, refetch: fetchDashboard };
}
