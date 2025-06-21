import { format } from "date-fns";

export function formatDate(date: string | Date): string {
  return format(new Date(date), "MMM dd");
}

export function formatDateLong(date: string | Date): string {
  return format(new Date(date), "EEEE, MMMM do, yyyy");
}

export function getTodayString(): string {
  // Use UTC to avoid timezone issues
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateString(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}