import { CircleHelp } from "lucide-react";
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
      <div className="text-center py-12 px-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <CircleHelp className="h-12 w-12 text-blue-200 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">No riddles yet</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          Generate your first riddle to get started!
        </p>
        
        <div className="flex justify-center">
          <Button 
            onClick={handleGenerateRiddle}
            disabled={generateRiddle.isPending}
            variant="default"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${generateRiddle.isPending ? "animate-spin" : ""}`} />
            {generateRiddle.isPending ? "Generating..." : "Generate Riddle"}
          </Button>
        </div>
      </div>
    </section>
  );
}
