import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import HabitList from '../../components/HabitList';
import { useHabits } from '../../hooks/useHabits';
import { habitService } from '../../services/habitService';

export default function HomeScreen() {
  const { habits, loadHabits } = useHabits();

  // Set up the global addHabit function
  useEffect(() => {
    global.addHabit = async () => {
      try {
        await habitService.addHabit({
          name: "New Habit",
          createdAt: new Date(),
          completedDates: []
        });
        // Reload habits after adding a new one
        loadHabits();
      } catch (e) {
        console.error('Failed to add habit:', e);
      }
    };

    return () => {
      global.addHabit = undefined;
    };
  }, [loadHabits]);

  const handleToggleHabit = async (habitId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const habit = habits.find(h => h.id === habitId);
      if (!habit) return;

      await habitService.toggleHabitCompletion(habitId, today);
      // Reload habits after toggling
      loadHabits();
    } catch (e) {
      console.error('Failed to toggle habit:', e);
    }
  };

  const handleUpdateHabit = async (habitId: string, newName: string) => {
    try {
      await habitService.updateHabit(habitId, { name: newName });
      // Reload habits after updating
      loadHabits();
    } catch (e) {
      console.error('Failed to update habit:', e);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <HabitList
        habits={habits}
        onToggleHabit={handleToggleHabit}
        onUpdateHabit={handleUpdateHabit}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
