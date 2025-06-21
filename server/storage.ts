import { habits, completions, type Habit, type InsertHabit, type Completion, type InsertCompletion, type HabitWithStats } from "@shared/schema";

export interface IStorage {
  // Habit operations
  getHabits(): Promise<Habit[]>;
  getHabit(id: number): Promise<Habit | undefined>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  updateHabit(id: number, habit: Partial<InsertHabit>): Promise<Habit | undefined>;
  deleteHabit(id: number): Promise<boolean>;
  
  // Completion operations
  getCompletions(habitId?: number, date?: string): Promise<Completion[]>;
  toggleCompletion(habitId: number, date: string): Promise<Completion>;
  
  // Statistics
  getHabitsWithStats(date?: string): Promise<HabitWithStats[]>;
  updateStreaks(habitId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private habits: Map<number, Habit>;
  private completions: Map<string, Completion>;
  private currentHabitId: number;
  private currentCompletionId: number;

  constructor() {
    this.habits = new Map();
    this.completions = new Map();
    this.currentHabitId = 1;
    this.currentCompletionId = 1;
    
    // Initialize with some sample habits
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleHabits = [
      { name: "Drink 8 glasses of water", description: "Stay hydrated throughout the day", icon: "fas fa-tint", color: "blue" },
      { name: "Read for 20 minutes", description: "Any book or educational content", icon: "fas fa-book", color: "green" },
      { name: "30 minutes of exercise", description: "Any form of physical activity", icon: "fas fa-dumbbell", color: "orange" },
      { name: "Meditate for 10 minutes", description: "Mindfulness or breathing exercises", icon: "fas fa-om", color: "purple" },
    ];

    sampleHabits.forEach(habitData => {
      const habit: Habit = {
        id: this.currentHabitId++,
        ...habitData,
        currentStreak: 0,
        longestStreak: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      this.habits.set(habit.id, habit);
    });
    
    // Clear any existing completions to start fresh
    this.completions.clear();
    this.currentCompletionId = 1;
    
    // Add sample completion data to demonstrate streaks
    this.addSampleCompletions();
  }
  
  private addSampleCompletions() {
    const today = new Date().toISOString().split('T')[0];
    const baseDate = new Date(today);
    
    // Create some streak patterns for demonstration
    const streakDates = [
      // Recent 5-day streak
      -7, -6, -5, -4, -3,
      // Another streak
      -14, -13, -12,
      // Single completions
      -20, -18, -16,
      // Recent partial completion
      -2, -1
    ];
    
    streakDates.forEach(dayOffset => {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + dayOffset);
      const dateStr = date.toISOString().split('T')[0];
      
      // For streak days, complete all habits
      if (dayOffset >= -7 && dayOffset <= -3) {
        [1, 2, 3, 4].forEach(habitId => {
          const completion: Completion = {
            id: this.currentCompletionId++,
            habitId,
            date: dateStr,
            completed: true,
          };
          this.completions.set(`${habitId}-${dateStr}`, completion);
        });
      } 
      // For other days, partial completion
      else {
        [1, 2].forEach(habitId => {
          const completion: Completion = {
            id: this.currentCompletionId++,
            habitId,
            date: dateStr,
            completed: true,
          };
          this.completions.set(`${habitId}-${dateStr}`, completion);
        });
      }
    });
  }

  async getHabits(): Promise<Habit[]> {
    return Array.from(this.habits.values());
  }

  async getHabit(id: number): Promise<Habit | undefined> {
    return this.habits.get(id);
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const habit: Habit = {
      id: this.currentHabitId++,
      name: insertHabit.name,
      description: insertHabit.description ?? null,
      icon: insertHabit.icon ?? "fas fa-check",
      color: insertHabit.color ?? "emerald",
      currentStreak: 0,
      longestStreak: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.habits.set(habit.id, habit);
    return habit;
  }

  async updateHabit(id: number, updateData: Partial<InsertHabit>): Promise<Habit | undefined> {
    const habit = this.habits.get(id);
    if (!habit) return undefined;

    const updatedHabit = { ...habit, ...updateData };
    this.habits.set(id, updatedHabit);
    return updatedHabit;
  }

  async deleteHabit(id: number): Promise<boolean> {
    // Remove habit and all its completions
    const deleted = this.habits.delete(id);
    
    // Remove completions for this habit
    const keysToDelete: string[] = [];
    const keys = Array.from(this.completions.keys());
    for (const key of keys) {
      const completion = this.completions.get(key);
      if (completion && completion.habitId === id) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => this.completions.delete(key));
    
    return deleted;
  }

  async getCompletions(habitId?: number, date?: string): Promise<Completion[]> {
    let completions = Array.from(this.completions.values());
    
    if (habitId) {
      completions = completions.filter(c => c.habitId === habitId);
    }
    
    if (date) {
      completions = completions.filter(c => c.date === date);
    }
    
    return completions;
  }

  async toggleCompletion(habitId: number, date: string): Promise<Completion> {
    const key = `${habitId}-${date}`;
    const existing = this.completions.get(key);

    if (existing) {
      // Toggle existing completion
      existing.completed = !existing.completed;
      this.completions.set(key, existing);
      await this.updateStreaks(habitId);
      return existing;
    } else {
      // Create new completion
      const completion: Completion = {
        id: this.currentCompletionId++,
        habitId,
        date,
        completed: true,
      };
      this.completions.set(key, completion);
      await this.updateStreaks(habitId);
      return completion;
    }
  }

  async updateStreaks(habitId: number): Promise<void> {
    const habit = this.habits.get(habitId);
    if (!habit) return;

    const completions = await this.getCompletions(habitId);
    const completedDates = completions
      .filter(c => c.completed)
      .map(c => c.date)
      .sort();

    if (completedDates.length === 0) {
      habit.currentStreak = 0;
      this.habits.set(habitId, habit);
      return;
    }

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date(today);

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (completedDates.includes(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    for (const dateStr of completedDates) {
      const currentDate = new Date(dateStr);
      
      if (lastDate && (currentDate.getTime() - lastDate.getTime()) === 24 * 60 * 60 * 1000) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
      lastDate = currentDate;
    }

    habit.currentStreak = currentStreak;
    habit.longestStreak = Math.max(habit.longestStreak, longestStreak);
    this.habits.set(habitId, habit);
  }

  async getHabitsWithStats(date?: string): Promise<HabitWithStats[]> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const allHabits = await this.getHabits();
    
    const habitsWithStats: HabitWithStats[] = [];
    
    for (const habit of allHabits) {
      const completions = await this.getCompletions(habit.id);
      const totalDays = completions.length;
      const completedDays = completions.filter(c => c.completed).length;
      const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
      
      // Check for today's completion
      const todayCompletion = completions.find(c => c.date === targetDate && c.completed);
      
      habitsWithStats.push({
        ...habit,
        completionRate,
        completedToday: !!todayCompletion,
      });
    }
    
    return habitsWithStats;
  }
}

export const storage = new MemStorage();
