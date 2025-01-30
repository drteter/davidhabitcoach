export interface HabitGoal {
  frequency: number;
  period: 'day' | 'week' | 'month' | 'year';
  target?: number;
}

export interface HabitMetadata {
  wordCount?: number;
  notes?: string;
  goal?: HabitGoal;
  count?: number;
}

export type HabitType = 'boolean' | 'counter';

export interface CompletionData {
  date: string;
  metadata?: HabitMetadata;
}

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
  createdAt: Date;
  completedDates: string[]; // Keeping for backward compatibility
  completions: CompletionData[]; // New field for rich completion data
  metadata?: HabitMetadata;
  goal?: number;
  goalPeriod?: 'day' | 'week' | 'month' | 'year';
} 