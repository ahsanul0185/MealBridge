import { useEffect, useState } from "react";
import { fetchAddressSuggestions, type AddressSuggestion } from "../services/location.service";
import { useDebounce } from "./useDebounce";

interface UseAddressSuggestionsOptions {
  query: string;
  debounceMs?: number;
  minLength?: number;
  limit?: number;
  countryCodes?: string;
  enabled?: boolean;
}

export function useAddressSuggestions({
  query,
  debounceMs = 400,
  minLength = 3,
  limit = 5,
  countryCodes,
  enabled = true,
}: UseAddressSuggestionsOptions) {
  const debouncedQuery = useDebounce(query, debounceMs);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || debouncedQuery.length < minLength) {
      setSuggestions([]);
      setError(null);
      return;
    }

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const results = await fetchAddressSuggestions(debouncedQuery, limit, countryCodes);
        if (!cancelled) {
          setSuggestions(results);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load address suggestions. Please try again.");
          setSuggestions([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, minLength, limit, countryCodes, enabled]);

  return { suggestions, isLoading, error };
}
