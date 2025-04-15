import { type Riddle } from "@shared/schema";
import { CardFlip } from "./ui/card-flip";
import { format } from "date-fns";
import { CircleHelp, RotateCw } from "lucide-react";

type RiddleCardProps = {
  riddle: Riddle;
  isFeatured?: boolean;
};

export default function RiddleCard({ riddle, isFeatured = false }: RiddleCardProps) {
  const formattedDate = format(new Date(riddle.createdAt), "MMM d, yyyy");
  
  const frontContent = (
    <div className="p-4 h-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <CircleHelp className="h-4 w-4 text-primary-500 mr-1.5" />
          <span className="text-sm font-medium text-gray-600">{formattedDate}</span>
        </div>
        {isFeatured && (
          <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full font-medium">
            Latest
          </span>
        )}
      </div>
      <p className="text-gray-800 my-3">
        {riddle.question}
      </p>
    </div>
  );

  const backContent = (
    <div className="p-4 h-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <CircleHelp className="h-4 w-4 text-primary-500 mr-1.5" />
          <span className="text-sm font-medium text-gray-600">{formattedDate}</span>
        </div>
        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
          Answer
        </span>
      </div>
      
      <div className="my-4 flex items-center justify-center flex-col">
        <p className="text-primary-700 font-medium text-lg text-center">
          {riddle.answer}
        </p>
      </div>
    </div>
  );

  return (
    <div className={`bg-white rounded-lg border ${isFeatured ? 'border-blue-200' : 'border-gray-200'} shadow-sm overflow-hidden transition duration-150 hover:shadow-md relative group`}>
      <CardFlip
        frontContent={frontContent}
        backContent={backContent}
        className="min-h-[150px] cursor-pointer group-hover:opacity-95"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-50 transition-opacity duration-200 pointer-events-none">
        <RotateCw className="h-6 w-6 text-primary-600" />
      </div>
    </div>
  );
}
