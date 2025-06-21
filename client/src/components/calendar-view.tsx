import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, isSameDay, addDays, subDays } from "date-fns";
import { useHabits } from "@/hooks/use-habits";

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { data: habits = [] } = useHabits();

  const { data: completions = [] } = useQuery<any[]>({
    queryKey: ["/api/completions"],
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get completion data for a specific date
  const getCompletionStatus = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayCompletions = completions.filter((c: any) => c.date === dateStr && c.completed);
    const totalHabits = habits.length;
    
    if (dayCompletions.length === 0) return "none";
    if (dayCompletions.length === totalHabits) return "complete";
    return "partial";
  };

  // Check if a date is part of a streak
  const isInStreak = (date: Date) => {
    const status = getCompletionStatus(date);
    if (status !== "complete") return false;

    const prevDay = subDays(date, 1);
    const nextDay = addDays(date, 1);
    
    const prevComplete = getCompletionStatus(prevDay) === "complete";
    const nextComplete = getCompletionStatus(nextDay) === "complete";
    
    return prevComplete || nextComplete;
  };

  // Get streak position for styling
  const getStreakPosition = (date: Date) => {
    if (!isInStreak(date)) return null;

    const prevDay = subDays(date, 1);
    const nextDay = addDays(date, 1);
    
    const prevComplete = getCompletionStatus(prevDay) === "complete";
    const nextComplete = getCompletionStatus(nextDay) === "complete";
    
    if (prevComplete && nextComplete) return "middle";
    if (prevComplete && !nextComplete) return "end";
    if (!prevComplete && nextComplete) return "start";
    return "single";
  };

  const getDayClasses = (date: Date) => {
    const baseClasses = "relative w-10 h-10 flex items-center justify-center text-sm font-medium transition-all";
    
    if (!isSameMonth(date, currentMonth)) {
      return `${baseClasses} text-gray-300 dark:text-gray-600`;
    }
    
    const status = getCompletionStatus(date);
    const streakPos = getStreakPosition(date);
    
    let bgClasses = "";
    let textClasses = "text-gray-900 dark:text-foreground";
    let shapeClasses = "rounded-full";
    
    // Handle today highlighting
    if (isToday(date)) {
      if (status === "complete") {
        bgClasses = "bg-green-600";
        textClasses = "text-white font-bold";
      } else if (status === "partial") {
        bgClasses = "bg-green-300";
        textClasses = "text-green-800 font-bold";
      } else {
        bgClasses = "bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500";
        textClasses = "text-blue-700 dark:text-blue-300 font-bold";
      }
    } else {
      // Handle completion status
      switch (status) {
        case "complete":
          if (streakPos) {
            bgClasses = "bg-green-500";
            textClasses = "text-white";
            // Handle streak shapes
            switch (streakPos) {
              case "start":
                shapeClasses = "rounded-l-full rounded-r-lg";
                break;
              case "middle":
                shapeClasses = "rounded-lg";
                break;
              case "end":
                shapeClasses = "rounded-r-full rounded-l-lg";
                break;
              case "single":
                shapeClasses = "rounded-full";
                break;
            }
          } else {
            bgClasses = "bg-green-500";
            textClasses = "text-white";
            shapeClasses = "rounded-full";
          }
          break;
        case "partial":
          bgClasses = "bg-green-200 dark:bg-green-800/30";
          textClasses = "text-green-800 dark:text-green-200";
          shapeClasses = "rounded-full";
          break;
        default:
          bgClasses = "border-2 border-gray-200 dark:border-gray-600";
          textClasses = "text-gray-400 dark:text-gray-500";
          shapeClasses = "rounded-full";
      }
    }
    
    return `${baseClasses} ${bgClasses} ${textClasses} ${shapeClasses}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-foreground">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-6">
          {/* Day headers */}
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
          
          {/* Calendar days with streak visualization */}
          {days.map((day) => (
            <div key={day.toISOString()} className="relative">
              <div className={getDayClasses(day)}>
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 rounded-full bg-green-500"></div>
            <span className="text-gray-600 dark:text-gray-400">All completed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 rounded-full bg-green-200 dark:bg-green-800/30"></div>
            <span className="text-gray-600 dark:text-gray-400">Partial</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 rounded-full border-2 border-gray-200 dark:border-gray-600"></div>
            <span className="text-gray-600 dark:text-gray-400">Missed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
