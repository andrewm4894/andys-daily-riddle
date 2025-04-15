import { type Riddle } from "@shared/schema";
import { CardFlip } from "./ui/card-flip";
import { CircleHelp } from "lucide-react";

type RiddleCardProps = {
  riddle: Riddle;
  isFeatured?: boolean;
};

export default function RiddleCard({ riddle, isFeatured = false }: RiddleCardProps) {
  const frontContent = (
    <div className="p-4 h-full flex items-center justify-center">
      <p className="text-gray-800 text-base md:text-lg text-center w-full break-words">
        {riddle.question}
      </p>
      <div className="text-gray-400 text-xs opacity-50 absolute bottom-2 right-3">
        Tap to reveal
      </div>
    </div>
  );

  const backContent = (
    <div className="p-4 h-full flex items-center justify-center">
      <p className="text-primary-700 font-medium text-base md:text-lg text-center w-full break-words">
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
        className="min-h-[120px] cursor-pointer"
      />
    </div>
  );
}
