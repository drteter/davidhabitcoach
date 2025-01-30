import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, TextInput, SectionList } from 'react-native';
import { Habit } from '../types/habit';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';
import { ProgressCircle } from './ProgressCircle';

interface HabitListProps {
  habits: Habit[];
  onToggleHabit: (habitId: string) => void;
  onUpdateHabit: (habitId: string, newName: string) => void;
  ListHeaderComponent?: React.ReactElement;
}

export default function HabitList({ 
  habits, 
  onToggleHabit, 
  onUpdateHabit,
  ListHeaderComponent 
}: HabitListProps) {
  if (habits.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        {ListHeaderComponent}
        <ThemedText style={styles.emptyText}>No habits yet. Add one to get started!</ThemedText>
      </ThemedView>
    );
  }

  // Sort habits by name
  const sortedHabits = [...habits].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <SectionList
      sections={[{ title: 'All Habits', data: sortedHabits }]}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <Animated.View
          entering={FadeIn}
          layout={Layout}
        >
          <HabitItem 
            habit={item} 
            onToggle={() => onToggleHabit(item.id)}
            onUpdate={(newName) => onUpdateHabit(item.id, newName)}
          />
        </Animated.View>
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
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(habit.name);

  const handleSubmitEdit = () => {
    if (editedName.trim() !== habit.name) {
      onUpdate(editedName.trim());
    }
    setIsEditing(false);
  };

  const handleItemPress = () => {
    router.push(`/habit/${habit.id}`);
  };

  // Calculate yearly progress and projections
  const currentYear = new Date().getFullYear();
  const today = new Date();
  const startOfYear = new Date(currentYear, 0, 1);
  const daysIntoYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const daysInYear = 365;
  const daysRemaining = daysInYear - daysIntoYear;

  const yearlyCompletions = habit.completions
    .filter(c => c.date.startsWith(currentYear.toString()))
    .reduce((sum, completion) => sum + (completion.metadata?.count || 1), 0);

  // Calculate daily rate and projected end-of-year total
  const dailyRate = yearlyCompletions / daysIntoYear;
  const projectedTotal = Math.round(yearlyCompletions + (dailyRate * daysRemaining));

  // Calculate yearly target - use the monthly target * 12 only if it's a boolean habit
  const yearlyTarget = habit.metadata?.goal?.target 
    ? (habit.type === 'boolean' ? habit.metadata.goal.target * 12 : habit.metadata.goal.target)
    : 0;

  // Calculate monthly target (yearly target divided by 12)
  const monthlyTarget = yearlyTarget > 0 ? Math.round(yearlyTarget / 12) : 0;

  // Calculate 30-day trend
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });

  const completionsLast30Days = habit.completions
    .filter(c => last30Days.includes(c.date))
    .reduce((sum, completion) => sum + (completion.metadata?.count || 1), 0);

  const isOnTrack = completionsLast30Days >= monthlyTarget;

  // Format numbers for display
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <TouchableOpacity onPress={handleItemPress}>
      <ThemedView style={styles.habitItem}>
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
                onPress={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                style={styles.nameButton}
              >
                <ThemedText type="defaultSemiBold" style={styles.habitName}>
                  {habit.name}
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.habitDetails}>
            {habit.metadata?.goal?.target && (
              <View style={styles.trendContainer}>
                <IconSymbol 
                  name={isOnTrack ? "trending-up" : "trending-down"}
                  size={24}
                  color={isOnTrack ? Colors.primary : Colors.tabIconDefault}
                />
                <ThemedText style={[
                  styles.trendText,
                  { color: isOnTrack ? Colors.primary : Colors.tabIconDefault }
                ]}>
                  {formatNumber(completionsLast30Days)}/{formatNumber(monthlyTarget)} this month
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        {yearlyTarget > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.circlesContainer}>
              <View style={styles.circleWrapper}>
                <ProgressCircle 
                  progress={yearlyCompletions / yearlyTarget * 100}
                  size={50}
                  strokeWidth={5}
                  count={yearlyCompletions}
                  target={yearlyTarget}
                />
                <ThemedText style={styles.progressNumber}>
                  {formatNumber(yearlyCompletions)}
                </ThemedText>
                <ThemedText style={styles.progressLabel}>
                  current
                </ThemedText>
              </View>

              <View style={styles.circleWrapper}>
                <ProgressCircle 
                  progress={(projectedTotal / yearlyTarget) * 100}
                  size={50}
                  strokeWidth={5}
                  count={projectedTotal}
                  target={yearlyTarget}
                />
                <ThemedText style={[styles.projectedPercent, { color: Colors.primary }]}>
                  {Math.round((projectedTotal / yearlyTarget) * 100)}%
                </ThemedText>
                <ThemedText style={styles.projectedNumber}>
                  {formatNumber(projectedTotal)}
                </ThemedText>
                <ThemedText style={styles.projectedLabel}>
                  at current pace
                </ThemedText>
              </View>
            </View>
          </View>
        )}
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.7,
  },
  habitItem: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitInfo: {
    flex: 1,
    marginRight: 16,
  },
  nameContainer: {
    marginBottom: 8,
  },
  habitName: {
    fontSize: 16,
  },
  input: {
    fontSize: 16,
    padding: 0,
    color: Colors.text,
  },
  nameButton: {
    flex: 1,
  },
  habitDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trendText: {
    fontSize: 14,
    opacity: 0.8,
  },
  progressContainer: {
    alignItems: 'center',
    minWidth: 200,
  },
  circlesContainer: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
  },
  circleWrapper: {
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  progressLabel: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 2,
  },
  projectedPercent: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  projectedNumber: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  projectedLabel: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 2,
  },
  listContent: {
    paddingTop: 16,
  },
}); 