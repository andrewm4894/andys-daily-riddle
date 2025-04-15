import { useState, useEffect, useRef } from "react";
import { CircleHelp, ChevronDown, AlertCircle, CreditCard } from "lucide-react";
import RiddleCard from "@/components/RiddleCard";
import EmptyState from "@/components/EmptyState";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { useRiddles, useGenerateRiddle, useRiddleLimit } from "@/hooks/use-riddles";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Riddle } from "@shared/schema";
import { useLocation } from "wouter";

export default function Home() {
  const [riddlesOffset, setRiddlesOffset] = useState(0);
  const [riddlesLimit] = useState(10); // Show 10 riddles at a time
  const newRiddleRef = useRef<HTMLDivElement>(null);
  const [isNewRiddle, setIsNewRiddle] = useState(false);
  const [, setLocation] = useLocation();
  
  const { 
    data: riddlesData, 
    isLoading: isLoadingRiddles 
  } = useRiddles(riddlesLimit, riddlesOffset);
  
  const { data: limitData } = useRiddleLimit();
  const generateRiddle = useGenerateRiddle();
  const { toast } = useToast();
  
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
  
  const handleLoadMore = () => {
    if (riddlesData?.pagination.hasMore) {
      setRiddlesOffset(prev => prev + riddlesLimit);
    }
  };
  
  // Redirect to checkout page for paid riddle generation
  const handleGoToCheckout = () => {
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
                      <CreditCard className="h-4 w-4 mr-1" />
                      <span>Pay $1 for Riddle</span>
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate a new riddle for $1.00</p>
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
            <h2 className="text-lg font-medium text-gray-700 mb-2">
              Riddles Collection
            </h2>
            
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
                  {riddlesData?.riddles.map((riddle, index) => (
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

                {riddlesData?.pagination.hasMore && (
                  <div className="mt-8 flex justify-center">
                    <button 
                      className="px-4 py-2 bg-white border border-gray-200 rounded-md text-primary-600 text-sm font-medium hover:bg-gray-50 flex items-center"
                      onClick={handleLoadMore}
                    >
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Load more
                    </button>
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
