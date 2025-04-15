import { useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";

export default function DateDisplay() {
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    setCurrentDate(new Date().toLocaleDateString('en-US', options));
  }, []);

  return (
    <div className="text-gray-500 text-sm font-medium flex items-center">
      <CalendarIcon className="h-3.5 w-3.5 mr-1.5 hidden sm:block" />
      {currentDate}
    </div>
  );
}
