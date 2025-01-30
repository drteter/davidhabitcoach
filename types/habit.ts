export interface Habit {
  id: string;
  name: string;
  createdAt: Date;
  completedDates: string[]; // ISO date strings
} 