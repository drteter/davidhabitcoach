import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { useHabits } from '../../hooks/useHabits';
import { Habit } from '../../types/habit';

export default function SettingsScreen() {
  const { habits, deleteHabit, loadHabits } = useHabits();

  // Reload habits when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadHabits();
    }, [loadHabits])
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Manage Habits</ThemedText>
      {habits.map((habit: Habit) => (
        <View key={habit.id} style={styles.habitItem}>
          <ThemedText type="defaultSemiBold">{habit.name}</ThemedText>
          <TouchableOpacity 
            onPress={() => deleteHabit(habit.id)}
            style={styles.deleteButton}
          >
            <IconSymbol name="remove-outline" color="white" size={20} />
          </TouchableOpacity>
        </View>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  habitItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 