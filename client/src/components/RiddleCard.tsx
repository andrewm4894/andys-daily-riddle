import { type Riddle } from "@shared/schema";
import { CardFlip } from "./ui/card-flip";
import { CircleHelp } from "lucide-react";

type RiddleCardProps = {
  riddle: Riddle;
  isFeatured?: boolean;
};

export default function RiddleCard({ riddle, isFeatured = false }: RiddleCardProps) {
  const frontContent = (
    <div className="p-5 h-full flex items-center justify-center">
      <p className="text-gray-800 text-lg text-center w-full">
        {riddle.question}
      </p>
    </div>
  );

  const backContent = (
    <div className="p-5 h-full flex items-center justify-center">
      <p className="text-primary-700 font-medium text-lg text-center w-full">
        {riddle.answer}
      </p>
    </div>
  );

  return (
    <div className={`bg-white rounded-lg border ${isFeatured ? 'border-primary-300 shadow-md' : 'border-gray-200'} overflow-hidden transition duration-150 hover:shadow-md relative group`}>
      {isFeatured && (
        <div className="absolute w-3 h-3 rounded-full bg-primary-500 top-3 right-3" />
      )}
      <CardFlip
        frontContent={frontContent}
        backContent={backContent}
        className="min-h-[150px] cursor-pointer"
      />
    </div>
  );
}
