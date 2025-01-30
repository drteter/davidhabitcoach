import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';
import { Calendar } from 'react-native-calendars';
import { Colors } from '../constants/Colors';
import { Habit } from '../types/habit';

interface Props {
  habit: Habit;
  onUpdate: () => void;
}

export function DefaultHabitView({ habit }: Props) {
  // Create marked dates object for calendar
  const markedDates = habit.completedDates.reduce((acc, date) => ({
    ...acc,
    [date]: { selected: true, selectedColor: Colors.tabIconSelected }
  }), {});

  // Calculate statistics
  const now = new Date();
  const thisMonth = now.toISOString().slice(0, 7); // YYYY-MM
  const completionsThisMonth = habit.completedDates.filter(date => 
    date.startsWith(thisMonth)
  ).length;

  // Calculate streak
  const streak = calculateStreak(habit.completedDates);

  return (
    <ScrollView>
      <View style={styles.header}>
        <ThemedText type="title">{habit.name}</ThemedText>
        <ThemedText>Created {new Date(habit.createdAt).toLocaleDateString()}</ThemedText>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <ThemedText type="defaultSemiBold">{completionsThisMonth}</ThemedText>
          <ThemedText>This Month</ThemedText>
        </View>
        <View style={styles.statBox}>
          <ThemedText type="defaultSemiBold">
            {Math.round((completionsThisMonth / 30) * 100)}%
          </ThemedText>
          <ThemedText>Success Rate</ThemedText>
        </View>
        <View style={styles.statBox}>
          <ThemedText type="defaultSemiBold">{streak}</ThemedText>
          <ThemedText>Day Streak</ThemedText>
        </View>
      </View>

      <View style={styles.calendarContainer}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          History
        </ThemedText>
        <Calendar
          markedDates={markedDates}
          theme={{
            backgroundColor: Colors.background,
            calendarBackground: Colors.background,
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: Colors.tabIconSelected,
            selectedDayTextColor: '#ffffff',
            todayTextColor: Colors.tabIconSelected,
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
          }}
        />
      </View>
    </ScrollView>
  );
}

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

const styles = StyleSheet.create({
  header: {
    padding: 16,
    gap: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statBox: {
    alignItems: 'center',
    gap: 4,
  },
  calendarContainer: {
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
}); 