import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Habit } from '../types/habit';
import { Colors } from '../constants/Colors';

interface HabitSummaryProps {
  habits: Habit[];
}

export function HabitSummary({ habits }: HabitSummaryProps) {
  // Calculate total habits and habits with goals
  const totalHabits = habits.length;
  const habitsWithGoals = habits.filter(h => h.metadata?.goal?.target).length;
  
  // Calculate how many habits are on track (meeting their monthly targets)
  const habitsOnTrack = habits.filter(habit => {
    if (!habit.metadata?.goal?.target) return false;
    
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const completionsLast30Days = habit.completions.filter(c => 
      last30Days.includes(c.date)
    ).length;

    // Calculate monthly target (normalized to 30 days)
    const monthlyTarget = habit.metadata.goal.target * (30 / 30); // Adjust if period isn't monthly
    
    return completionsLast30Days >= monthlyTarget;
  }).length;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue}>{totalHabits}</ThemedText>
          <ThemedText style={styles.statLabel}>Total Habits</ThemedText>
        </View>
        
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue}>{habitsWithGoals}</ThemedText>
          <ThemedText style={styles.statLabel}>With Goals</ThemedText>
        </View>
        
        <View style={styles.statItem}>
          <ThemedText style={styles.statValue}>{habitsOnTrack}</ThemedText>
          <ThemedText style={styles.statLabel}>On Track</ThemedText>
        </View>
      </View>
      
      <ThemedText style={styles.message}>
        {habitsOnTrack === habitsWithGoals 
          ? "All habits are on track! 🎯" 
          : "Keep pushing towards your goals! 🎯"}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
}); 