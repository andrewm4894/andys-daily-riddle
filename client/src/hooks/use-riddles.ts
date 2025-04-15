import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Riddle } from "@shared/schema";
import { usePostHog } from "@/hooks/use-posthog";

export function useLatestRiddle() {
  return useQuery<Riddle>({
    queryKey: ["/api/riddles/latest"],
  });
}

type RiddlesResponse = {
  riddles: Riddle[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
};

export function useRiddles(limit = 10, offset = 0) {
  return useQuery<RiddlesResponse>({
    queryKey: ["/api/riddles", { limit, offset }],
    queryFn: async ({ queryKey }) => {
      const [url, params] = queryKey;
      const queryParams = new URLSearchParams();
      
      if (params) {
        const { limit, offset } = params as { limit: number; offset: number };
        queryParams.append("limit", limit.toString());
        queryParams.append("offset", offset.toString());
      }
      
      const response = await fetch(`${url}?${queryParams.toString()}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch riddles");
      }
      
      return response.json();
    },
    staleTime: 60000, // Keep data fresh for 1 minute
  });
}

export function useRiddleLimit() {
  return useQuery<{remaining: number, limit: number, canGenerate: boolean}>({
    queryKey: ["/api/riddles/limit"],
    // Refresh every minute to keep the UI up-to-date
    refetchInterval: 60000,
  });
}

export function useGenerateRiddle() {
  const { captureEvent } = usePostHog();
  
  const mutation = useMutation({
    mutationFn: async () => {
      // Track the attempt to generate a riddle
      captureEvent('riddle_generation_started');
      
      const response = await apiRequest("POST", "/api/riddles/generate");
      if (response.status === 429) {
        const error = await response.json();
        
        // Track rate limit hit
        captureEvent('riddle_generation_rate_limited', {
          error: error.message
        });
        
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/riddles/latest"] });
      queryClient.invalidateQueries({ queryKey: ["/api/riddles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/riddles/limit"] });
      
      // Track successful riddle generation
      captureEvent('riddle_generation_success', {
        riddle_id: data.id,
        remaining_today: data.remainingToday
      });
      
      // Return the remaining count from the response if it exists
      return data.remainingToday !== undefined ? data.remainingToday : null;
    },
    onError: (error: Error) => {
      // Track riddle generation errors
      captureEvent('riddle_generation_error', {
        error: error.message
      });
    }
  });

  return mutation;
}
