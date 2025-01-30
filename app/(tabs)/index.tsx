import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '../../components/ThemedView';
import HabitList from '../../components/HabitList';
import { useHabits } from '../../hooks/useHabits';
import { habitService } from '../../services/habitService';
import { HabitSummary } from '../../components/HabitSummary';

export default function HomeScreen() {
  const { habits, loadHabits } = useHabits();

  // Set up the global loadHabits function
  useEffect(() => {
    global.loadHabits = loadHabits;

    return () => {
      global.loadHabits = undefined;
    };
  }, [loadHabits]);

  const handleToggleHabit = async (habitId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const habit = habits.find(h => h.id === habitId);
      if (!habit) {
        console.error('Habit not found:', habitId);
        return;
      }

      // Add a loading state if needed
      await habitService.toggleHabitCompletion(habitId, today, {});
      
      // Reload habits after successful toggle
      await loadHabits();
    } catch (error) {
      console.error('Failed to toggle habit:', error);
      // Handle error (maybe show a toast or alert)
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
        ListHeaderComponent={<HabitSummary habits={habits} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
