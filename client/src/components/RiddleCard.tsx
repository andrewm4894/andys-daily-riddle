import { useState } from "react";
import { type Riddle } from "@shared/schema";
import RatingStars from "./RatingStars";
import { useRateRiddle } from "@/hooks/use-rate-riddle";
import { Star, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type RiddleCardProps = {
  riddle: Riddle;
  isFeatured?: boolean;
};

export default function RiddleCard({ riddle, isFeatured = false }: RiddleCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const { mutate: rateRiddle } = useRateRiddle();
  const { toast } = useToast();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRate = (rating: number) => {
    // Rating is handled by the RatingStars component (stopPropagation applied there)
    rateRiddle({ riddleId: riddle.id, rating });
  };
  
  const handleCopyQuestion = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card from flipping
    
    // Copy the riddle question to clipboard
    navigator.clipboard.writeText(riddle.question)
      .then(() => {
        setIsCopying(true);
        toast({
          title: "Copied to clipboard",
          description: "The riddle has been copied to your clipboard",
          duration: 2000,
        });
        
        // Reset the copy icon after a short delay
        setTimeout(() => {
          setIsCopying(false);
        }, 1000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard. Please try again.",
          variant: "destructive",
          duration: 2000,
        });
      });
  };

  return (
    <div 
      className={`bg-white rounded-lg border ${isFeatured ? 'border-primary-300 shadow-md' : 'border-gray-200'} overflow-hidden transition duration-150 hover:shadow-md relative group cursor-pointer min-h-[120px]`}
      onClick={handleFlip}
    >
      {isFeatured && (
        <div className="absolute w-3 h-3 rounded-full bg-primary-500 top-3 right-3 z-10" />
      )}
      
      <div className="w-full relative">
        {/* Front of card - Question */}
        <div 
          className={`py-5 px-4 flex flex-col items-center gap-3 ${isFlipped ? 'hidden' : 'flex'}`}
        >
          <div className="text-gray-800 text-base md:text-lg text-center w-full break-words relative pb-6">
            {riddle.question}
          </div>
          
          {/* Copy Button - Positioned below text */}
          <button
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-primary-600 rounded-md transition-colors"
            onClick={handleCopyQuestion}
            aria-label="Copy question"
            title="Copy question"
          >
            <Copy size={14} className={isCopying ? "text-green-500" : ""} />
            <span>Copy</span>
          </button>
          
          {riddle.averageRating !== null && riddle.ratingCount > 0 && (
            <div 
              className="text-xs text-gray-500 flex items-center justify-center gap-1" 
              onClick={(e) => e.stopPropagation()}
            >
              <Star
                size={12}
                className="fill-yellow-400 text-yellow-400"
              />
              {Number(riddle.averageRating).toFixed(1)} ({riddle.ratingCount})
            </div>
          )}
        </div>
        
        {/* Back of card - Answer */}
        <div 
          className={`py-5 px-4 flex flex-col items-center gap-3 ${isFlipped ? 'flex' : 'hidden'}`}
        >
          <div className="text-primary-700 font-medium text-base md:text-lg text-center w-full break-words">
            {riddle.answer}
          </div>
          
          <div 
            onClick={(e) => e.stopPropagation()}
          >
            <RatingStars
              initialRating={0}
              onRate={handleRate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
