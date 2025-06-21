import { useQuery } from "@tanstack/react-query";
import type { HabitWithStats } from "@shared/schema";

export function useHabits() {
  return useQuery<HabitWithStats[]>({
    queryKey: ["/api/habits"],
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: true,
  });
}
