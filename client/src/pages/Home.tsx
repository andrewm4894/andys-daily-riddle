import { useState } from "react";
import { CircleHelp, FolderOpen, ChevronDown, RefreshCw } from "lucide-react";
import DateDisplay from "@/components/DateDisplay";
import RiddleCard from "@/components/RiddleCard";
import EmptyState from "@/components/EmptyState";
import { useLatestRiddle, useRiddles, useGenerateRiddle } from "@/hooks/use-riddles";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [riddlesOffset, setRiddlesOffset] = useState(0);
  const [riddlesLimit] = useState(6); // Show 6 riddles at a time
  
  const { data: latestRiddle, isLoading: isLoadingLatest } = useLatestRiddle();
  const { 
    data: riddlesData, 
    isLoading: isLoadingRiddles 
  } = useRiddles(riddlesLimit, riddlesOffset);
  
  const generateRiddle = useGenerateRiddle();
  
  const handleLoadMore = () => {
    if (riddlesData?.pagination.hasMore) {
      setRiddlesOffset(prev => prev + riddlesLimit);
    }
  };
  
  const hasRiddles = !!latestRiddle || (riddlesData?.riddles.length ?? 0) > 0;
  
  return (
    <div className="bg-gray-50 font-body min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <CircleHelp className="h-8 w-8 text-primary-500" />
            <h1 className="ml-2 text-2xl font-heading font-bold text-dark">The Daily Riddle</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => generateRiddle.mutate()}
              disabled={generateRiddle.isPending}
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold shadow-md"
            >
              {generateRiddle.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <CircleHelp className="h-4 w-4 mr-2" />
                  Generate Riddle
                </>
              )}
            </Button>
            <DateDisplay />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasRiddles && !isLoadingLatest && !isLoadingRiddles ? (
          <EmptyState />
        ) : (
          <>
            {/* Featured/Today's Riddle */}
            <section className="mb-12">
              <div className="flex items-center mb-4">
                <CircleHelp className="h-6 w-6 text-secondary-500" />
                <h2 className="text-xl font-heading font-semibold text-dark ml-2">
                  Today's Riddle
                </h2>
              </div>
              
              {isLoadingLatest ? (
                <div className="bg-white shadow-md rounded-xl p-6 border-2 border-primary-200 animate-pulse">
                  <div className="h-48"></div>
                </div>
              ) : latestRiddle ? (
                <RiddleCard riddle={latestRiddle} isFeatured={true} />
              ) : (
                <div className="bg-white shadow-md rounded-xl p-6 border-2 border-primary-200">
                  <p className="text-center text-gray-500">No riddle available for today.</p>
                  <div className="mt-4 flex justify-center">
                    <Button 
                      onClick={() => generateRiddle.mutate()}
                      disabled={generateRiddle.isPending}
                      className="bg-primary-500 hover:bg-primary-600 text-white"
                    >
                      {generateRiddle.isPending ? "Generating..." : "Generate Riddle"}
                    </Button>
                  </div>
                </div>
              )}
            </section>

            {/* Past Riddles */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FolderOpen className="h-6 w-6 text-primary-500" />
                  <h2 className="text-xl font-heading font-semibold text-dark ml-2">
                    Past Riddles
                  </h2>
                </div>
                
                {/* Filter Dropdown */}
                <div className="relative">
                  <Select>
                    <SelectTrigger className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                      <SelectValue placeholder="Filter by Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="current">Current Month</SelectItem>
                      <SelectItem value="previous">Previous Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLoadingRiddles ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white shadow-md rounded-xl overflow-hidden animate-pulse">
                      <div className="p-6">
                        <div className="h-32"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {riddlesData?.riddles.map((riddle) => (
                      <RiddleCard key={riddle.id} riddle={riddle} />
                    ))}
                  </div>

                  {riddlesData?.pagination.hasMore && (
                    <div className="mt-10 flex justify-center">
                      <button 
                        className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-primary-600 font-medium hover:bg-gray-50 flex items-center transition-colors duration-200"
                        onClick={handleLoadMore}
                      >
                        <ChevronDown className="h-5 w-5 mr-2" />
                        Load more riddles
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <CircleHelp className="h-6 w-6 text-primary-500" />
              <p className="ml-2 text-sm text-gray-500">© {new Date().getFullYear()} The Daily Riddle</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="text-sm">Privacy</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="text-sm">Terms</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="text-sm">Contact</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
