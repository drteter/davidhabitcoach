import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Habit } from '../types/habit';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';

interface HabitListProps {
  habits: Habit[];
  onToggleHabit: (habitId: string) => void;
  onUpdateHabit: (habitId: string, newName: string) => void;
}

export default function HabitList({ habits, onToggleHabit, onUpdateHabit }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText>No habits yet. Add one to get started!</ThemedText>
      </ThemedView>
    );
  }

  return (
    <FlatList
      data={habits}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <HabitItem 
          habit={item} 
          onToggle={() => onToggleHabit(item.id)}
          onUpdate={(newName) => onUpdateHabit(item.id, newName)}
        />
      )}
      style={styles.list}
    />
  );
}

interface HabitItemProps {
  habit: Habit;
  onToggle: () => void;
  onUpdate: (newName: string) => void;
}

function HabitItem({ habit, onToggle, onUpdate }: HabitItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(habit.name);
  
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completedDates.includes(today);
  const streak = calculateStreak(habit.completedDates);

  const handleSubmitEdit = () => {
    if (editedName.trim() !== habit.name) {
      onUpdate(editedName.trim());
    }
    setIsEditing(false);
  };

  return (
    <View style={styles.habitItem}>
      <TouchableOpacity 
        onPress={onToggle} 
        style={styles.checkboxContainer}
      >
        <View style={[styles.checkbox, isCompletedToday && styles.checked]} />
      </TouchableOpacity>
      
      <View style={styles.habitInfo}>
        <View style={styles.nameContainer}>
          {isEditing ? (
            <TextInput
              value={editedName}
              onChangeText={setEditedName}
              onBlur={handleSubmitEdit}
              onSubmitEditing={handleSubmitEdit}
              autoFocus
              style={styles.input}
              onEndEditing={handleSubmitEdit}
            />
          ) : (
            <TouchableOpacity 
              onPress={() => setIsEditing(true)}
              style={styles.nameButton}
            >
              <ThemedText type="defaultSemiBold">{habit.name}</ThemedText>
            </TouchableOpacity>
          )}
        </View>
        <ThemedText>🔥 {streak} day streak</ThemedText>
      </View>
    </View>
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
  list: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
  },
  checkboxContainer: {
    marginRight: 12,
    padding: 8,
  },
  habitInfo: {
    flex: 1,
    gap: 4,
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
  input: {
    fontSize: 16,
    fontWeight: '600',
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    minWidth: 100,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameButton: {
    alignSelf: 'flex-start',
  },
}); 