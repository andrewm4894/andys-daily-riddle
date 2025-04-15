import { HelpCircle } from "lucide-react";
import { useGenerateRiddle } from "@/hooks/use-riddles";
import { RefreshCw } from "lucide-react";

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
        <button 
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium inline-flex items-center transition-colors duration-200"
          onClick={handleGenerateRiddle}
          disabled={generateRiddle.isPending}
        >
          <RefreshCw className={`h-5 w-5 mr-2 ${generateRiddle.isPending ? "animate-spin" : ""}`} />
          {generateRiddle.isPending ? "Generating..." : "Generate a riddle now"}
        </button>
      </div>
    </section>
  );
}
