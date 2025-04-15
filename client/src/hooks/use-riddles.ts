import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Riddle } from "@shared/schema";

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
  });
}

export function useGenerateRiddle() {
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/riddles/generate");
      return response.json();
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/riddles/latest"] });
      queryClient.invalidateQueries({ queryKey: ["/api/riddles"] });
    },
  });

  return mutation;
}
