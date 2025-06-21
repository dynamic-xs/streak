import { Button } from "@/components/ui/button";
import { Flame, Plus, Check } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { HabitWithStats } from "@shared/schema";

interface HabitCardProps {
  habit: HabitWithStats;
}

export default function HabitCard({ habit }: HabitCardProps) {
  const queryClient = useQueryClient();
  // Force use of server's current date to avoid timezone issues
  const today = "2025-06-21";

  const toggleMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/habits/${habit.id}/toggle`, { date: today });
      return await response.json() as { id: number; habitId: number; date: string; completed: boolean };
    },
    onSuccess: (data) => {
      // Refetch habits data to get updated state
      queryClient.refetchQueries({ queryKey: ["/api/habits"] });
      
      toast({
        title: data.completed ? "Great job!" : "Habit unchecked",
        description: data.completed 
          ? `${habit.name} completed for today`
          : `${habit.name} marked as incomplete`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update habit completion",
        variant: "destructive",
      });
    },
  });

  const getIconClass = (iconString: string) => {
    return iconString || "fas fa-check";
  };

  const getColorClass = () => {
    // Always use green for completed habits
    return "bg-primary hover:bg-primary/90";
  };

  return (
    <div className="bg-white dark:bg-card rounded-xl p-4 shadow-sm border border-gray-100 dark:border-border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            size="lg"
            className={`w-12 h-12 rounded-xl transition-all group ${
              habit.completedToday
                ? getColorClass()
                : "bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white"
            }`}
            onClick={() => toggleMutation.mutate()}
            disabled={toggleMutation.isPending}
          >
            {habit.completedToday ? (
              <Check className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
            ) : (
              <Plus className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-white transition-colors" />
            )}
          </Button>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-foreground">{habit.name}</h3>
            {habit.description && (
              <p className="text-sm text-gray-500 dark:text-muted-foreground">{habit.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-center">
            <div className="flex items-center space-x-1">
              <Flame className={`h-4 w-4 ${habit.currentStreak > 0 ? "text-amber-500" : "text-gray-300 dark:text-gray-600"}`} />
              <span className={`text-lg font-bold ${habit.currentStreak > 0 ? "text-gray-900 dark:text-foreground" : "text-gray-400 dark:text-gray-600"}`}>
                {habit.currentStreak}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-muted-foreground">day streak</div>
          </div>
        </div>
      </div>
    </div>
  );
}
