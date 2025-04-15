import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

export function useRateRiddle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ riddleId, rating }: { riddleId: number; rating: number }) => {
      const response = await apiRequest(
        "POST", 
        `/api/riddles/${riddleId}/rate`, 
        { rating }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to rate riddle");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate queries to refetch riddles with updated ratings
      queryClient.invalidateQueries({ queryKey: ["/api/riddles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/riddles/latest"] });
      
      toast({
        title: "Rating submitted",
        description: "Thank you for rating this riddle!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit rating",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}