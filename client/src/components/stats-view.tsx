import { Trophy, Calendar, TrendingUp } from "lucide-react";
import type { HabitWithStats } from "@shared/schema";

interface StatsViewProps {
  habits: HabitWithStats[];
}

export default function StatsView({ habits }: StatsViewProps) {
  const longestStreak = Math.max(...habits.map(h => h.longestStreak), 0);
  const averageCompletionRate = habits.length > 0 
    ? Math.round(habits.reduce((sum, h) => sum + h.completionRate, 0) / habits.length)
    : 0;
  const totalDays = habits.reduce((sum, h) => sum + h.currentStreak, 0);

  const getIconForHabit = (icon: string) => {
    // Simple mapping for demo - in real app you'd have a proper icon system
    switch (icon) {
      case "fas fa-tint": return "💧";
      case "fas fa-book": return "📚";
      case "fas fa-dumbbell": return "🏋️";
      case "fas fa-om": return "🧘";
      default: return "✅";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-card rounded-xl p-6 shadow-sm border border-gray-100 dark:border-border">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-foreground">{longestStreak}</div>
              <div className="text-sm text-gray-500 dark:text-muted-foreground">Longest Streak</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-card rounded-xl p-6 shadow-sm border border-gray-100 dark:border-border">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-foreground">{averageCompletionRate}%</div>
              <div className="text-sm text-gray-500 dark:text-muted-foreground">Completion Rate</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-card rounded-xl p-6 shadow-sm border border-gray-100 dark:border-border">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-foreground">{totalDays}</div>
              <div className="text-sm text-gray-500 dark:text-muted-foreground">Active Streak Days</div>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Habit Stats */}
      <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-border">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-4">Habit Performance</h3>
        
        {habits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-muted-foreground">No habits to show statistics for.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => (
              <div key={habit.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm">
                    {getIconForHabit(habit.icon)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-foreground">{habit.name}</div>
                    <div className="text-sm text-gray-500 dark:text-muted-foreground">
                      Current: {habit.currentStreak} days | Best: {habit.longestStreak} days
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-primary">{habit.completionRate}%</div>
                  <div className="text-sm text-gray-500 dark:text-muted-foreground">success rate</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
