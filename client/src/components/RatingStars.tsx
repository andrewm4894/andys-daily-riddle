import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  initialRating?: number;
  averageRating?: number | null;
  ratingCount?: number;
  readOnly?: boolean;
  onRate?: (rating: number) => void;
}

export default function RatingStars({
  initialRating = 0,
  averageRating,
  ratingCount = 0,
  readOnly = false,
  onRate
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(initialRating);

  // Display value is either the hover value, selected value, or average rating
  const displayValue = hoverRating || selectedRating || averageRating || 0;
  
  const handleRating = (rating: number) => {
    if (readOnly) return;
    
    setSelectedRating(rating);
    onRate?.(rating);
  };

  return (
    <div className="flex items-center gap-2">
      {averageRating !== undefined && averageRating !== null && ratingCount > 0 && (
        <div className="text-xs text-gray-500 min-w-8 text-right">
          {Number(averageRating).toFixed(1)}
        </div>
      )}
      
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <Star
            key={rating}
            size={16}
            className={cn(
              "cursor-pointer transition-colors",
              rating <= displayValue 
                ? "fill-yellow-400 text-yellow-400" 
                : "fill-transparent text-gray-300",
              readOnly && "cursor-default"
            )}
            onMouseEnter={() => !readOnly && setHoverRating(rating)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            onClick={() => handleRating(rating)}
          />
        ))}
        
        {averageRating !== undefined && averageRating !== null && ratingCount > 0 && (
          <span className="text-xs text-gray-500 ml-1">
            ({ratingCount})
          </span>
        )}
      </div>
    </div>
  );
}