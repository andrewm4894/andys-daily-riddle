import React from 'react';
import { CircleHelp, Brain, Sparkles, Stars } from 'lucide-react';

interface LoadingAnimationProps {
  message?: string;
}

export function LoadingAnimation({ message = "Generating a clever riddle..." }: LoadingAnimationProps) {
  const messages = [
    "Brewing brain teasers...",
    "Conjuring conundrums...",
    "Thinking thoughtfully...",
    "Pondering puzzles...",
    "Mastering mysteries...",
    "Riddling riddles...",
  ];

  const [currentMessage, setCurrentMessage] = React.useState(message);
  const [dotCount, setDotCount] = React.useState(0);

  React.useEffect(() => {
    // Cycle through different witty messages
    const messageInterval = setInterval(() => {
      setCurrentMessage(messages[Math.floor(Math.random() * messages.length)]);
    }, 2000);
    
    // Animate the dots
    const dotInterval = setInterval(() => {
      setDotCount((prevCount) => (prevCount + 1) % 4);
    }, 500);
    
    return () => {
      clearInterval(messageInterval);
      clearInterval(dotInterval);
    };
  }, []);
  
  const dots = ".".repeat(dotCount);
  
  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-white rounded-lg border border-blue-100 shadow-sm">
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
        <div className="absolute opacity-5 top-[-10%] right-[-10%]">
          <CircleHelp size={80} className="text-primary-500 animate-pulse" />
        </div>
        <div className="absolute opacity-5 bottom-[-10%] left-[-10%]">
          <CircleHelp size={60} className="text-primary-500 animate-pulse" />
        </div>
      </div>
      
      <div className="flex justify-center mb-4">
        <div className="relative">
          <Brain size={40} className="text-primary-500 animate-pulse" />
          <Sparkles 
            size={16} 
            className="absolute -top-2 -right-2 text-amber-400 animate-ping" 
            style={{ animationDuration: '1.5s' }}
          />
          <Sparkles 
            size={16} 
            className="absolute -bottom-2 -left-2 text-amber-400 animate-ping" 
            style={{ animationDuration: '2s' }}
          />
        </div>
      </div>
      
      <div className="flex flex-col items-center space-y-2">
        <p className="text-primary-700 font-medium">
          {currentMessage}{dots}
        </p>
        
        <div className="flex space-x-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-primary-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '200ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '400ms' }}></div>
        </div>
      </div>
    </div>
  );
}