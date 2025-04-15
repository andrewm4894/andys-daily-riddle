import { useState } from "react";
import { type Riddle } from "@shared/schema";
import RatingStars from "./RatingStars";
import { useRateRiddle } from "@/hooks/use-rate-riddle";
import { usePostHog } from "@/hooks/use-posthog";
import { Star, Copy } from "lucide-react";

type RiddleCardProps = {
  riddle: Riddle;
  isFeatured?: boolean;
};

export default function RiddleCard({ riddle, isFeatured = false }: RiddleCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const { mutate: rateRiddle } = useRateRiddle();
  const { captureEvent } = usePostHog();

  const handleFlip = () => {
    const newState = !isFlipped;
    setIsFlipped(newState);
    
    // Track card flip events
    captureEvent(newState ? 'riddle_card_flipped' : 'riddle_card_unflipped', {
      riddle_id: riddle.id,
      is_featured: isFeatured,
      has_rating: riddle.averageRating !== null
    });
  };

  const handleRate = (rating: number) => {
    // Rating is handled by the RatingStars component (stopPropagation applied there)
    rateRiddle({ riddleId: riddle.id, rating });
    
    // Track rating events
    captureEvent('riddle_rated', {
      riddle_id: riddle.id,
      rating: rating,
      is_featured: isFeatured
    });
  };
  
  const handleCopyQuestion = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card from flipping
    
    // Track copy events
    captureEvent('riddle_question_copied', {
      riddle_id: riddle.id,
      is_featured: isFeatured
    });
    
    // Copy the riddle question to clipboard
    navigator.clipboard.writeText(riddle.question)
      .then(() => {
        setIsCopying(true);
        
        // Reset the copy icon after a short delay - this provides visual feedback
        setTimeout(() => {
          setIsCopying(false);
        }, 1000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        
        // Track copy failure events
        captureEvent('riddle_copy_failed', {
          riddle_id: riddle.id,
          error: err.message
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
          <div className="text-gray-800 text-base md:text-lg text-center w-full break-words relative">
            {riddle.question}
          </div>
          
          <div className="flex items-center justify-center gap-4 w-full">
            {riddle.averageRating !== null && riddle.ratingCount > 0 ? (
              <>
                {/* Rating display */}
                <div className="flex-1 flex justify-end">
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
                </div>
                
                {/* Copy Button when ratings exist */}
                <div className="flex-1 flex justify-start">
                  <button
                    className="flex items-center p-1 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
                    onClick={handleCopyQuestion}
                    aria-label="Copy question"
                    title="Copy question"
                  >
                    <Copy size={14} className={isCopying ? "text-green-500" : ""} />
                  </button>
                </div>
              </>
            ) : (
              /* Centered copy button when no ratings */
              <button
                className="flex items-center p-1 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
                onClick={handleCopyQuestion}
                aria-label="Copy question"
                title="Copy question"
              >
                <Copy size={14} className={isCopying ? "text-green-500" : ""} />
              </button>
            )}
          </div>
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
