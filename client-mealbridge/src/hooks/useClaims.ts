import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as claimService from "../services/claim.service";
import type { Claim, ClaimStats } from "../types/claim";

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ClaimFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  donor?: string;
  from?: string;
  to?: string;
}

export function useClaims(filters: ClaimFilters = {}) {
  const { page = 1, limit = 10 } = filters;

  const [claims, setClaims] = useState<Claim[]>([]);
  const [stats, setStats] = useState<ClaimStats | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClaims = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await claimService.getMyClaims(filters);
      const payload = response.data?.data;
      const items: Claim[] = payload?.items ?? payload?.data ?? payload ?? [];
      const metaInfo: Meta = response.data?.meta ?? {
        total: items.length,
        page,
        limit,
        totalPages: Math.ceil(items.length / limit),
      };

      setClaims(items);
      setMeta(metaInfo);
      setStats(payload?.stats ?? null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load your claims");
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, limit]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const updateStatus = async (id: string, pickup_status: "On the way" | "Picked up") => {
    try {
      await claimService.updatePickupStatus(id, pickup_status);
      toast.success(`Pickup status updated to ${pickup_status}`);
      await fetchClaims();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update pickup status");
      throw err;
    }
  };

  const markPickedUp = async (id: string) => {
    try {
      await claimService.markPickedUp(id);
      toast.success("Food marked as picked up");
      await fetchClaims();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to mark as picked up");
      throw err;
    }
  };

  return {
    claims,
    stats,
    meta,
    isLoading,
    refetch: fetchClaims,
    updateStatus,
    markPickedUp,
  };
}
