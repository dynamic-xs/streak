import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Flame, Moon, Sun, Plus } from "lucide-react";
import { format } from "date-fns";
import HabitCard from "@/components/habit-card";
import AddHabitDialog from "@/components/add-habit-dialog";
import CalendarView from "@/components/calendar-view";
import StatsView from "@/components/stats-view";
import ManageView from "@/components/manage-view";
import { useHabits } from "@/hooks/use-habits";
import { useTheme } from "@/components/theme-provider";

export default function Home() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("today");
  const { data: habits = [], isLoading } = useHabits();
  const { theme, toggleTheme } = useTheme();

  const today = format(new Date(), "MMM dd");
  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const completionPercentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const totalStreaks = habits.reduce((sum, habit) => sum + habit.currentStreak, 0);
  const allHabitsCompleted = totalHabits > 0 && completionPercentage === 100;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-app flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-app">
      {/* Header */}
      <header className="bg-white dark:bg-card shadow-sm border-b border-gray-200 dark:border-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-foreground">StreakMaster</h1>
                <p className="text-sm text-gray-500 dark:text-muted-foreground">Today, {today}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{totalStreaks}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Total Streaks</div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={toggleTheme}
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-card shadow-sm">
            <TabsTrigger value="today" className="data-[state=active]:bg-primary data-[state=active]:text-white">Today</TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-primary data-[state=active]:text-white">Calendar</TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-primary data-[state=active]:text-white">Statistics</TabsTrigger>
            <TabsTrigger value="manage" className="data-[state=active]:bg-primary data-[state=active]:text-white">Manage</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6 mt-6">
            {/* Celebration Message */}
            {allHabitsCompleted && (
              <div className="bg-gradient-to-r from-primary/10 to-primary/20 dark:from-primary/20 dark:to-primary/30 rounded-2xl p-6 shadow-sm border border-primary/30 animate-pulse">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    🎉 Hooray you are a champion! 🎉
                  </div>
                  <p className="text-gray-700 dark:text-foreground">
                    You've completed all your habits for today. Fantastic job!
                  </p>
                </div>
              </div>
            )}

            {/* Progress Overview */}
            <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-foreground">Today's Progress</h2>
                <div className="text-sm text-gray-500 dark:text-muted-foreground">
                  {completedToday} of {totalHabits} completed
                </div>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-muted-foreground">
                  {completionPercentage === 100 ? "Perfect day!" : "Keep going! You're doing great"}
                </span>
                <span className="font-medium text-primary">{completionPercentage}%</span>
              </div>
            </div>

            {/* Habits List */}
            <div className="space-y-3">
              {habits.length === 0 ? (
                <div className="bg-white dark:bg-card rounded-xl p-8 shadow-sm border border-gray-100 dark:border-border text-center">
                  <p className="text-gray-500 dark:text-muted-foreground mb-4">No habits yet. Start building good habits today!</p>
                  <Button onClick={() => setShowAddDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Habit
                  </Button>
                </div>
              ) : (
                habits.map((habit) => (
                  <HabitCard key={habit.id} habit={habit} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <CalendarView />
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <StatsView habits={habits} />
          </TabsContent>

          <TabsContent value="manage" className="mt-6">
            <ManageView onAddHabit={() => setShowAddDialog(true)} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Floating Action Button (Mobile) */}
      <Button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg lg:hidden"
        onClick={() => setShowAddDialog(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      <AddHabitDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
}
