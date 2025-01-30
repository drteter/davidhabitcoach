import { useState, useEffect, useCallback } from 'react';
import { habitService } from '../services/habitService';
import { Habit } from '../types/habit';

// Create a single shared state instance
let sharedHabits: Habit[] = [];
const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(sharedHabits);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Register this component as a listener
  useEffect(() => {
    const listener = () => setHabits(sharedHabits);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const loadHabits = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedHabits = await habitService.getHabits();
      sharedHabits = fetchedHabits; // Update shared state
      setHabits(fetchedHabits);
      notifyListeners();
    } catch (e) {
      setError('Failed to load habits');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteHabit = useCallback(async (habitId: string) => {
    try {
      await habitService.deleteHabit(habitId);
      sharedHabits = sharedHabits.filter(habit => habit.id !== habitId);
      setHabits(sharedHabits);
      notifyListeners();
    } catch (e) {
      console.error('Failed to delete habit:', e);
    }
  }, []);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  return {
    habits,
    loading,
    error,
    deleteHabit,
    loadHabits,
  };
} 