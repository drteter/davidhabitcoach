import React, { useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { Calendar } from 'react-native-calendars';
import { Colors } from '../constants/Colors';
import { Habit, CompletionData } from '../types/habit';
import { habitService } from '../services/habitService';

interface Props {
  habit: Habit;
  onUpdate: () => void;
}

export function WritingHabitView({ habit, onUpdate }: Props) {
  const [wordCount, setWordCount] = useState('');
  const [notes, setNotes] = useState('');

  const today = new Date().toISOString().split('T')[0];

  // Calculate statistics
  const completions = habit.completions || [];
  const thisMonth = today.slice(0, 7); // YYYY-MM
  const thisWeek = getWeekStart(new Date());
  
  const wordsByPeriod = completions.reduce((acc, completion) => {
    const words = completion.metadata?.wordCount || 0;
    const date = completion.date;
    
    if (date.startsWith(thisMonth)) {
      acc.month += words;
    }
    if (date >= thisWeek) {
      acc.week += words;
    }
    acc.total += words;
    
    return acc;
  }, { week: 0, month: 0, total: 0 });

  // Create marked dates for calendar
  const markedDates = completions.reduce((acc, completion) => {
    const words = completion.metadata?.wordCount || 0;
    return {
      ...acc,
      [completion.date]: {
        selected: true,
        selectedColor: Colors.tabIconSelected,
        marked: true,
        dots: [{color: 'white'}],
      }
    };
  }, {});

  const handleSubmit = async () => {
    if (!wordCount) return;
    
    await habitService.toggleHabitCompletion(habit.id, today, {
      wordCount: parseInt(wordCount),
      notes,
    });
    
    setWordCount('');
    setNotes('');
    onUpdate();
  };

  return (
    <ScrollView>
      <View style={styles.header}>
        <ThemedText type="title">{habit.name}</ThemedText>
        <ThemedText>Created {new Date(habit.createdAt).toLocaleDateString()}</ThemedText>
      </View>

      <View style={styles.inputContainer}>
        <ThemedText>Today's Word Count</ThemedText>
        <TextInput
          style={styles.input}
          value={wordCount}
          onChangeText={setWordCount}
          placeholder="Enter word count"
          keyboardType="number-pad"
          onSubmitEditing={handleSubmit}
        />
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add notes (optional)"
          multiline
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <ThemedText type="defaultSemiBold">{wordsByPeriod.week}</ThemedText>
          <ThemedText>This Week</ThemedText>
        </View>
        <View style={styles.statBox}>
          <ThemedText type="defaultSemiBold">{wordsByPeriod.month}</ThemedText>
          <ThemedText>This Month</ThemedText>
        </View>
        <View style={styles.statBox}>
          <ThemedText type="defaultSemiBold">{wordsByPeriod.total}</ThemedText>
          <ThemedText>Total Words</ThemedText>
        </View>
      </View>

      <View style={styles.calendarContainer}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Writing History
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

function getWeekStart(date: Date): string {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split('T')[0];
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    gap: 4,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
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