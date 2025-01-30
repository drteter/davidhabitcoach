import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import HabitList from '../components/HabitList';
import { Habit } from '../types/habit';

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');

  const addHabit = () => {
    if (!newHabitName.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      createdAt: new Date(),
      completedDates: [],
    };

    setHabits([...habits, newHabit]);
    setNewHabitName('');
  };

  const toggleHabit = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setHabits(habits.map(habit => {
      if (habit.id !== habitId) return habit;

      const completedDates = habit.completedDates.includes(today)
        ? habit.completedDates.filter(date => date !== today)
        : [...habit.completedDates, today];

      return { ...habit, completedDates };
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newHabitName}
          onChangeText={setNewHabitName}
          placeholder="Enter new habit"
        />
        <Button title="Add" onPress={addHabit} />
      </View>
      <HabitList habits={habits} onToggleHabit={toggleHabit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginRight: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
}); 