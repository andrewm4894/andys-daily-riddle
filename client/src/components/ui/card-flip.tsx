import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface CardFlipProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
}

export const CardFlip = ({
  frontContent,
  backContent,
  className,
}: CardFlipProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={cn("relative h-full cursor-pointer", className)} 
      onClick={toggleFlip}
    >
      <div 
        className={cn(
          "card-flip-inner w-full h-full transition-transform duration-500 relative preserve-3d",
          isFlipped ? "rotate-y-180" : ""
        )}
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div 
          className="absolute w-full h-full backface-hidden"
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          {frontContent}
        </div>
        
        <div 
          className="absolute w-full h-full backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {backContent}
        </div>
      </div>
    </div>
  );
};
