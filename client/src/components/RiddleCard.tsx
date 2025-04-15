import { useState } from "react";
import { type Riddle } from "@shared/schema";
import RatingStars from "./RatingStars";
import { useRateRiddle } from "@/hooks/use-rate-riddle";

type RiddleCardProps = {
  riddle: Riddle;
  isFeatured?: boolean;
};

export default function RiddleCard({ riddle, isFeatured = false }: RiddleCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { mutate: rateRiddle } = useRateRiddle();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRate = (rating: number) => {
    // Rating is handled by the RatingStars component (stopPropagation applied there)
    rateRiddle({ riddleId: riddle.id, rating });
  };

  return (
    <div 
      className={`bg-white rounded-lg border ${isFeatured ? 'border-primary-300 shadow-md' : 'border-gray-200'} overflow-hidden transition duration-150 hover:shadow-md relative group cursor-pointer`}
      onClick={handleFlip}
      style={{ height: "150px" }}
    >
      {isFeatured && (
        <div className="absolute w-3 h-3 rounded-full bg-primary-500 top-3 right-3 z-10" />
      )}
      
      <div className="w-full h-full relative">
        {/* Front of card - Question */}
        <div 
          className={`absolute inset-0 flex flex-col items-center justify-between p-4 w-full h-full ${isFlipped ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        >
          <div className="text-gray-800 text-base md:text-lg text-center w-full break-words flex-grow flex items-center justify-center">
            {riddle.question}
          </div>
          
          {riddle.averageRating !== null && riddle.ratingCount > 0 && (
            <div 
              className="mt-2 text-xs text-gray-500 flex items-center justify-center gap-1" 
              onClick={(e) => e.stopPropagation()}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="#f59e0b" 
                stroke="#f59e0b" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="lucide lucide-star"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {Number(riddle.averageRating).toFixed(1)} ({riddle.ratingCount})
            </div>
          )}
        </div>
        
        {/* Back of card - Answer */}
        <div 
          className={`absolute inset-0 flex flex-col items-center justify-between p-4 w-full h-full ${isFlipped ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        >
          <div className="text-primary-700 font-medium text-base md:text-lg text-center w-full break-words flex-grow flex items-center justify-center">
            {riddle.answer}
          </div>
          
          <div 
            className="mt-2" 
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
