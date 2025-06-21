import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { useHabits } from "@/hooks/use-habits";

interface ManageViewProps {
  onAddHabit: () => void;
}

export default function ManageView({ onAddHabit }: ManageViewProps) {
  const { data: habits = [], isLoading } = useHabits();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (habitId: number) => {
      return apiRequest("DELETE", `/api/habits/${habitId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      toast({
        title: "Habit deleted",
        description: "The habit has been removed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete habit",
        variant: "destructive",
      });
    },
  });

  const getIconForHabit = (icon: string) => {
    switch (icon) {
      case "fas fa-tint": return "💧";
      case "fas fa-book": return "📚";
      case "fas fa-dumbbell": return "🏋️";
      case "fas fa-om": return "🧘";
      default: return "✅";
    }
  };

  const handleDelete = (habitId: number, habitName: string) => {
    if (window.confirm(`Are you sure you want to delete "${habitName}"? This action cannot be undone.`)) {
      deleteMutation.mutate(habitId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add New Habit Button */}
      <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-border">
        <Button
          onClick={onAddHabit}
          variant="outline"
          className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-primary hover:bg-primary/5 transition-colors group h-auto"
        >
          <Plus className="h-5 w-5 text-gray-400 group-hover:text-primary" />
          <span className="text-gray-600 dark:text-muted-foreground group-hover:text-primary font-medium">Add New Habit</span>
        </Button>
      </div>

      {/* Existing Habits Management */}
      <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-border">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-4">Your Habits</h3>
        
        {habits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-muted-foreground mb-4">No habits created yet.</p>
            <Button onClick={onAddHabit}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Habit
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => (
              <div key={habit.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                    {getIconForHabit(habit.icon)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-foreground">{habit.name}</div>
                    {habit.description && (
                      <div className="text-sm text-gray-500 dark:text-muted-foreground">{habit.description}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50"
                  >
                    <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50"
                    onClick={() => handleDelete(habit.id, habit.name)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
