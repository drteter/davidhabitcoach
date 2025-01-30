import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Habit } from '../types/habit';

interface Props {
  habit: Habit;
  onToggle: () => void;
}

export default function HabitItem({ habit, onToggle }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completedDates.includes(today);
  const streak = calculateStreak(habit.completedDates);

  return (
    <TouchableOpacity onPress={onToggle} style={styles.container}>
      <View style={styles.habitInfo}>
        <Text style={styles.habitName}>{habit.name}</Text>
        <Text style={styles.streak}>🔥 {streak}</Text>
      </View>
      <View style={[styles.checkbox, isCompletedToday && styles.checked]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '500',
  },
  streak: {
    fontSize: 12,
    color: '#666',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#666',
  },
  checked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
});

function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;
  
  const sortedDates = [...completedDates].sort();
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  let currentDate = new Date(today);

  while (true) {
    const dateString = currentDate.toISOString().split('T')[0];
    if (!completedDates.includes(dateString)) break;
    
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
} 