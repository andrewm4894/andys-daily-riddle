import { useState } from "react";
import { type Riddle } from "@shared/schema";

type RiddleCardProps = {
  riddle: Riddle;
  isFeatured?: boolean;
};

export default function RiddleCard({ riddle, isFeatured = false }: RiddleCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={`bg-white rounded-lg border ${isFeatured ? 'border-primary-300 shadow-md' : 'border-gray-200'} overflow-hidden transition duration-150 hover:shadow-md relative group cursor-pointer`}
      onClick={handleFlip}
      style={{ height: "120px" }}
    >
      {isFeatured && (
        <div className="absolute w-3 h-3 rounded-full bg-primary-500 top-3 right-3 z-10" />
      )}
      
      <div className="w-full h-full relative">
        {/* Front of card - Question */}
        <div 
          className={`absolute inset-0 flex items-center justify-center p-4 w-full h-full ${isFlipped ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        >
          <div className="text-gray-800 text-base md:text-lg text-center w-full break-words">
            {riddle.question}
          </div>

        </div>
        
        {/* Back of card - Answer */}
        <div 
          className={`absolute inset-0 flex items-center justify-center p-4 w-full h-full ${isFlipped ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        >
          <div className="text-primary-700 font-medium text-base md:text-lg text-center w-full break-words">
            {riddle.answer}
          </div>
        </div>
      </div>
    </div>
  );
}
