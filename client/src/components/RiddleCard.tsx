import { type Riddle } from "@shared/schema";
import { CardFlip } from "./ui/card-flip";
import { format } from "date-fns";
import {
  CircleHelp,
  CircleArrowLeft,
  ChevronLeftIcon
} from "lucide-react";

type RiddleCardProps = {
  riddle: Riddle;
  isFeatured?: boolean;
};

export default function RiddleCard({ riddle, isFeatured = false }: RiddleCardProps) {
  const formattedDate = format(new Date(riddle.createdAt), "MMMM d, yyyy");
  
  const frontContent = (
    <div className={`p-6 h-full ${isFeatured ? "" : ""}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-primary-600">{formattedDate}</h3>
        {isFeatured && (
          <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full font-medium">
            New
          </span>
        )}
      </div>
      <p className={`${isFeatured ? "text-xl font-heading mb-6" : ""} text-dark`}>
        {riddle.question}
      </p>
      <div className="mt-4 flex justify-center">
        {isFeatured ? (
          <button className="px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white rounded-lg font-medium flex items-center transition-colors duration-200">
            <CircleArrowLeft className="h-5 w-5 mr-2" />
            Reveal Answer
          </button>
        ) : (
          <span className="text-sm text-secondary-600 font-medium flex items-center">
            <CircleHelp className="h-4 w-4 mr-1" />
            Tap to reveal answer
          </span>
        )}
      </div>
    </div>
  );

  const backContent = (
    <div className="p-6 h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-primary-600">{formattedDate}</h3>
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
          Answer
        </span>
      </div>
      <div className={`${isFeatured ? "mb-6" : ""}`}>
        <p className={`${isFeatured ? "text-lg" : "text-sm"} font-heading mb-2 text-gray-500`}>
          Question:
        </p>
        <p className="text-dark mb-4">{riddle.question}</p>
        
        <p className={`${isFeatured ? "text-lg" : "text-sm"} font-heading mb-2 text-gray-500`}>
          Answer:
        </p>
        <p className={`${isFeatured ? "text-xl" : "text-lg"} font-medium text-primary-700`}>
          {riddle.answer}
        </p>
      </div>
      {isFeatured && (
        <div className="flex justify-center mt-4">
          <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-dark rounded-lg font-medium flex items-center transition-colors duration-200">
            <ChevronLeftIcon className="h-5 w-5 mr-2" />
            Back to Riddle
          </button>
        </div>
      )}
    </div>
  );

  if (isFeatured) {
    return (
      <div className="bg-white shadow-md rounded-xl p-6 border-2 border-primary-200 hover:border-primary-300 transition-colors duration-200">
        <CardFlip
          frontContent={frontContent}
          backContent={backContent}
        />
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <CardFlip
        frontContent={frontContent}
        backContent={backContent}
      />
    </div>
  );
}
