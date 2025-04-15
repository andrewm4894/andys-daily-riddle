import { useState, useEffect, useRef, useCallback } from "react";
import { CircleHelp, ChevronDown, AlertCircle, CreditCard, Shuffle } from "lucide-react";
import RiddleCard from "@/components/RiddleCard";
import EmptyState from "@/components/EmptyState";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { useRiddles, useGenerateRiddle, useRiddleLimit } from "@/hooks/use-riddles";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { usePostHog } from "@/hooks/use-posthog";
import { type Riddle } from "@shared/schema";
import { useLocation } from "wouter";

export default function Home() {
  const [riddlesOffset, setRiddlesOffset] = useState(0);
  const [riddlesLimit] = useState(10); // Show 10 riddles at a time
  const newRiddleRef = useRef<HTMLDivElement>(null);
  const [isNewRiddle, setIsNewRiddle] = useState(false);
  const [, setLocation] = useLocation();
  const [allRiddles, setAllRiddles] = useState<Riddle[]>([]);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isShuffled, setIsShuffled] = useState(false);
  
  const { 
    data: riddlesData, 
    isLoading: isLoadingRiddles,
    isFetching: isLoadingMore 
  } = useRiddles(riddlesLimit, riddlesOffset);
  
  const { data: limitData } = useRiddleLimit();
  const generateRiddle = useGenerateRiddle();
  const { toast } = useToast();
  const { captureEvent } = usePostHog();
  
  // Update our allRiddles array when new data comes in
  useEffect(() => {
    if (riddlesData?.riddles) {
      // If shuffled state is active and we're not at the beginning, maintain it
      if (isShuffled && riddlesOffset !== 0) {
        // Only append new riddles while preserving shuffle
        setAllRiddles(prev => {
          // Create a Set of existing IDs to avoid duplicates
          const existingIds = new Set(prev.map(r => r.id));
          // Filter out any riddles that are already in our list
          const newRiddles = riddlesData.riddles.filter(r => !existingIds.has(r.id));
          return [...prev, ...newRiddles];
        });
      } else if (riddlesOffset === 0) {
        // Reset the list if we're at the beginning
        setAllRiddles(riddlesData.riddles);
        // Reset shuffle state when we reset to the beginning
        if (isShuffled) setIsShuffled(false);
      } else {
        // Otherwise append the new riddles
        setAllRiddles(prev => {
          // Create a Set of existing IDs to avoid duplicates
          const existingIds = new Set(prev.map(r => r.id));
          // Filter out any riddles that are already in our list
          const newRiddles = riddlesData.riddles.filter(r => !existingIds.has(r.id));
          return [...prev, ...newRiddles];
        });
      }
    }
  }, [riddlesData, riddlesOffset, isShuffled]);
  
  // Reset to top when new riddle is generated
  useEffect(() => {
    if (generateRiddle.isSuccess) {
      // Reset to top of the list
      setRiddlesOffset(0);
      // Highlight new riddle briefly
      setIsNewRiddle(true);
      
      // Reset the highlight after animation
      const timer = setTimeout(() => {
        setIsNewRiddle(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [generateRiddle.isSuccess]);
  
  // Scroll to top when new riddle added
  useEffect(() => {
    if (isNewRiddle && newRiddleRef.current) {
      newRiddleRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isNewRiddle, riddlesData]);
  
  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // If the load more element is visible and we're not already loading
        if (entries[0].isIntersecting && !isLoadingMore && riddlesData?.pagination.hasMore) {
          setRiddlesOffset(prev => prev + riddlesLimit);
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );
    
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef, isLoadingMore, riddlesData, riddlesLimit, riddlesOffset]);
  
  const handleLoadMore = () => {
    if (riddlesData?.pagination.hasMore) {
      setRiddlesOffset(prev => prev + riddlesLimit);
    }
  };
  
  // Handle shuffling and unshuffling
  const shuffleRiddles = () => {
    // Always use the full dataset from riddlesData as the source
    if (!riddlesData?.riddles || riddlesData.riddles.length === 0) {
      return; // Nothing to shuffle
    }
    
    // Keep track of how many riddles we have loaded
    const totalRiddles = [...allRiddles];
    
    if (isShuffled) {
      // If already shuffled, restore the original order from the server data
      setAllRiddles(totalRiddles.sort((a, b) => b.id - a.id)); // Sort by ID descending (newest first)
      setIsShuffled(false);
      
      // Track unshuffle event
      captureEvent('riddles_unshuffle', {
        riddle_count: totalRiddles.length
      });
    } else {
      // Apply Fisher-Yates shuffle algorithm
      const shuffled = [...totalRiddles];
      
      // Keep the newest riddle in place (first card)
      const startIndex = 1;
      
      // Fisher-Yates shuffle algorithm
      for (let i = shuffled.length - 1; i > startIndex; i--) {
        // Get random index between startIndex and i (inclusive)
        const j = startIndex + Math.floor(Math.random() * (i - startIndex + 1));
        // Swap elements at i and j
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      setAllRiddles(shuffled);
      setIsShuffled(true);
      
      // Track shuffle event
      captureEvent('riddles_shuffle', {
        riddle_count: totalRiddles.length
      });
    }
  };
  
  // Redirect to checkout page for paid riddle generation
  const handleGoToCheckout = () => {
    // Track checkout event
    captureEvent('checkout_started', {
      from_page: 'home'
    });
    
    // Navigate to the checkout page
    setLocation('/checkout');
  };
  
  const hasRiddles = (riddlesData?.riddles.length ?? 0) > 0;
  
  return (
    <div className="bg-gray-50 font-body min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <CircleHelp className="h-6 w-6 text-primary-500" />
            <h1 className="ml-2 text-xl font-bold text-dark">The Daily Riddle</h1>
          </div>
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <Button 
                      onClick={handleGoToCheckout}
                      variant="default"
                      size="sm"
                      className="relative"
                    >
                      <CircleHelp className="h-4 w-4 mr-1" />
                      <span>Generate Riddle</span>
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate a new riddle</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {!hasRiddles && !isLoadingRiddles ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-700">
                Riddles Collection
              </h2>
              
              {/* Shuffle Button */}
              {allRiddles.length > 1 && !isLoadingRiddles && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={shuffleRiddles}
                        className={`p-2 ${isShuffled ? 'text-primary-600' : 'text-gray-500'}`}
                      >
                        <Shuffle size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isShuffled ? 'Restore original order' : 'Shuffle riddles'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            {isLoadingRiddles ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white shadow-sm rounded-xl p-6 animate-pulse">
                    <div className="h-24"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="space-y-3" ref={newRiddleRef}>
                  {/* Show loading animation when generating a new riddle */}
                  {false && (
                    <div className="mb-6 transform transition-all duration-300 ease-in-out">
                      <LoadingAnimation />
                    </div>
                  )}
                  
                  {/* Display riddle cards */}
                  {allRiddles.map((riddle, index) => (
                    <div 
                      key={riddle.id}
                      className={`${index === 0 && isNewRiddle ? 'animate-pulse bg-blue-50 rounded-lg' : ''}`}
                    >
                      <RiddleCard 
                        riddle={riddle} 
                        isFeatured={index === 0}
                      />
                    </div>
                  ))}
                </div>

                {/* Infinite scroll trigger element */}
                {riddlesData?.pagination.hasMore && (
                  <div 
                    ref={loadMoreRef} 
                    className="h-10 flex items-center justify-center py-8"
                  >
                    {isLoadingMore ? (
                      <div className="animate-spin h-5 w-5 border-t-2 border-primary-500 rounded-full" />
                    ) : (
                      <span className="text-sm text-gray-400">Scroll for more</span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <CircleHelp className="h-4 w-4 text-primary-500" />
              <p className="ml-2 text-xs text-gray-500">© {new Date().getFullYear()} The Daily Riddle</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-xs text-gray-400 hover:text-gray-500">Privacy</a>
              <a href="#" className="text-xs text-gray-400 hover:text-gray-500">Terms</a>
              <a href="#" className="text-xs text-gray-400 hover:text-gray-500">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
