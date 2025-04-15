import { CircleHelp, HelpCircle } from "lucide-react";
import { useGenerateRiddle } from "@/hooks/use-riddles";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyState() {
  const generateRiddle = useGenerateRiddle();
  
  const handleGenerateRiddle = () => {
    generateRiddle.mutate();
  };
  
  return (
    <section>
      <div className="text-center py-16 px-4">
        <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">No riddles yet</h3>
        <p className="text-gray-400 max-w-md mx-auto mb-6">
          Your first riddle will be generated within 24 hours. Check back tomorrow!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleGenerateRiddle}
            disabled={generateRiddle.isPending}
            className="bg-primary-500 hover:bg-primary-600 text-white"
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${generateRiddle.isPending ? "animate-spin" : ""}`} />
            {generateRiddle.isPending ? "Generating..." : "Generate Free Riddle"}
          </Button>
          
          <Button 
            onClick={handleGenerateRiddle}
            disabled={generateRiddle.isPending}
            className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-semibold shadow-lg"
          >
            <CircleHelp className="h-5 w-5 mr-2" />
            Generate Premium Riddle
          </Button>
        </div>
      </div>
    </section>
  );
}
