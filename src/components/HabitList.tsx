import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import HabitItem from './HabitItem';
import { Habit } from '../types/habit';

interface Props {
  habits: Habit[];
  onToggleHabit: (habitId: string) => void;
}

export default function HabitList({ habits, onToggleHabit }: Props) {
  return (
    <FlatList
      data={habits}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <HabitItem habit={item} onToggle={() => onToggleHabit(item.id)} />
      )}
    />
  );
} 