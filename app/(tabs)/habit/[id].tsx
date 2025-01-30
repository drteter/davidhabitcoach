import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '../../../components/ThemedView';
import { ThemedText } from '../../../components/ThemedText';
import { useHabits } from '../../../hooks/useHabits';
import { Calendar } from 'react-native-calendars';
import { Colors } from '../../../constants/Colors';
import { habitService } from '../../../services/habitService';
import { CounterInputModal } from '../../../components/CounterInputModal';
import { ProgressCircle } from '../../../components/ProgressCircle';
import { EditHabitModal } from '../../../components/EditHabitModal';
import { HabitProgress } from '../../../components/HabitProgress';
import { Habit } from '../../../types/habit';

export default function HabitDetailScreen() {
  const { id, showEditModal } = useLocalSearchParams();
  const { habits, loadHabits } = useHabits();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [habit, setHabit] = useState<Habit | null>(null);

  // Find habit effect
  React.useEffect(() => {
    const foundHabit = habits.find(h => h.id === id);
    setHabit(foundHabit || null);
  }, [habits, id]);

  // Handle edit modal trigger from header
  React.useEffect(() => {
    if (showEditModal === 'true') {
      setIsEditModalVisible(true);
      // Reset the param after handling it
      router.setParams({ showEditModal: 'false' });
    }
  }, [showEditModal]);

  const handleBack = () => {
    router.back();
  };

  if (!habit) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Habit not found</ThemedText>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ThemedText>Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  // Create marked dates object for calendar with counts
  const markedDates = habit.completions.reduce((acc, completion) => ({
    ...acc,
    [completion.date]: { 
      selected: true, 
      selectedColor: Colors.tabIconSelected,
      // Add count as marker dot if it exists
      ...(completion.metadata?.count ? {
        marked: true,
        dots: [{color: 'white'}],
      } : {}),
    }
  }), {});

  // Calculate statistics
  const now = new Date();
  const thisMonth = now.toISOString().slice(0, 7); // YYYY-MM
  const completionsThisMonth = habit.completedDates.filter(date => 
    date.startsWith(thisMonth)
  ).length;

  const handleDayPress = async (day: { dateString: string }) => {
    if (habit.type === 'counter') {
      // Check if the date is already completed
      const existingCompletion = habit.completions.find(
        completion => completion.date === day.dateString
      );

      if (existingCompletion) {
        // If date exists, remove it
        try {
          await habitService.toggleHabitCompletion(habit.id, day.dateString);
          loadHabits();
        } catch (error) {
          console.error('Failed to remove completion:', error);
        }
      } else {
        // If date doesn't exist, show counter input modal
        setSelectedDate(day.dateString);
      }
    } else {
      try {
        await habitService.toggleHabitCompletion(habit.id, day.dateString);
        loadHabits();
      } catch (error) {
        console.error('Failed to toggle date:', error);
      }
    }
  };

  const handleCountSubmit = async (count: number) => {
    if (!selectedDate) return;

    try {
      await habitService.toggleHabitCompletion(habit.id, selectedDate, {
        count,
      });
      loadHabits();
    } catch (error) {
      console.error('Failed to add count:', error);
    }
  };

  // Calculate total count for counter habits
  const totalCount = habit.type === 'counter' 
    ? habit.completions.reduce((sum, completion) => 
        sum + (completion.metadata?.count || 0), 0)
    : habit.completedDates.length;

  // Add more detailed debug logging for the habit
  console.log('Detailed habit data:', {
    id: habit?.id,
    name: habit?.name,
    type: habit?.type,
    metadata: habit?.metadata,
    goal: habit?.metadata?.goal,
    target: habit?.metadata?.goal?.target,
    completions: habit?.completions?.length,
  });

  const getCounterStats = () => {
    if (habit.type !== 'counter') return null;

    console.log('Counter habit details:', {
      type: habit.type,
      metadata: habit.metadata,
      goal: habit.metadata?.goal,
      target: habit.metadata?.goal?.target,
      hasMetadata: !!habit.metadata,
      hasGoal: !!habit.metadata?.goal,
      hasTarget: !!habit.metadata?.goal?.target,
    });

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    // Start dates for different periods
    const startOfYear = `${currentYear}-01-01`;
    const startOfMonth = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfWeekStr = startOfWeek.toISOString().split('T')[0];

    // Calculate totals for different periods
    const totalThisYear = habit.completions
      .filter(completion => completion.date >= startOfYear)
      .reduce((sum, completion) => sum + (completion.metadata?.count || 0), 0);

    const totalThisMonth = habit.completions
      .filter(completion => completion.date >= startOfMonth)
      .reduce((sum, completion) => sum + (completion.metadata?.count || 0), 0);

    const totalThisWeek = habit.completions
      .filter(completion => completion.date >= startOfWeekStr)
      .reduce((sum, completion) => sum + (completion.metadata?.count || 0), 0);

    // Get current week's dates
    const startOfWeekDate = new Date(currentYear, 0, 1);
    const weeksThisYear = Math.max(1, Math.ceil(
      (now.getTime() - startOfWeekDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
    ));
    
    const daysCompletedThisYear = new Set(
      habit.completions
        .filter(completion => completion.date >= startOfYear)
        .map(c => c.date)
    ).size;

    const timesPerWeek = (daysCompletedThisYear / weeksThisYear).toFixed(1);

    // Calculate progress toward goal using this year's total
    let goalProgress = 0;
    const target = habit.metadata?.goal?.target;
    
    console.log('Goal calculation:', {
      totalThisYear,
      target,
      metadata: habit.metadata,
    });

    if (target && target > 0) {
      goalProgress = Math.min(100, (totalThisYear / target) * 100);
    }

    const stats = {
      totalThisWeek,
      totalThisMonth,
      totalThisYear,
      target: target || 0,
      goalProgress,
      timesPerWeek,
      daysCompletedThisYear,
      weeksThisYear
    };

    console.log('Calculated counter stats:', stats);
    return stats;
  };

  const counterStats = getCounterStats();
  
  // Add debug logging
  console.log('Habit:', {
    id: habit.id,
    name: habit.name,
    metadata: habit.metadata, // Updated to show full metadata
    completions: habit.completions,
    counterStats
  });

  const handleSaveHabit = async (updates: Partial<Habit>) => {
    try {
      await habitService.updateHabit(habit.id, updates);
      loadHabits();
    } catch (error) {
      console.error('Failed to update habit:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <ThemedText style={styles.createdText}>
            Created {new Date(habit.createdAt).toLocaleDateString()}
          </ThemedText>
        </View>

        <View style={styles.statsContainer}>
          {habit.type === 'counter' ? (
            <>
              <View style={styles.statBox}>
                <ThemedText type="defaultSemiBold">{counterStats?.totalThisWeek || 0}</ThemedText>
                <ThemedText>This Week</ThemedText>
              </View>
              <View style={styles.statBox}>
                <ProgressCircle 
                  progress={counterStats?.goalProgress || 0} 
                  count={counterStats?.totalThisYear || 0}
                  target={counterStats?.target || 0}
                />
              </View>
              <View style={styles.statBox}>
                <ThemedText type="defaultSemiBold">{counterStats?.timesPerWeek || 0}</ThemedText>
                <ThemedText>Times/Week</ThemedText>
              </View>
            </>
          ) : (
            <>
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
                <ThemedText type="defaultSemiBold">{totalCount}</ThemedText>
                <ThemedText>Total Days</ThemedText>
              </View>
            </>
          )}
        </View>

        <View style={styles.calendarContainer}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            History
          </ThemedText>
          <ThemedText style={styles.helpText}>
            Tap any date to mark it as completed or incomplete
          </ThemedText>
          <Calendar
            markedDates={markedDates}
            onDayPress={handleDayPress}
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
            // Don't allow future dates
            maxDate={new Date().toISOString().split('T')[0]}
            // Enable past date selection
            enableSwipeMonths={true}
          />
        </View>

        {habit.type === 'counter' && habit.metadata?.goal?.target && (
          <HabitProgress
            totalThisYear={counterStats?.totalThisYear || 0}
            totalThisMonth={counterStats?.totalThisMonth || 0}
            totalThisWeek={counterStats?.totalThisWeek || 0}
            annualGoal={habit.metadata.goal.target}
          />
        )}
      </ScrollView>

      <CounterInputModal
        visible={!!selectedDate}
        date={selectedDate || ''}
        onClose={() => setSelectedDate(null)}
        onSubmit={handleCountSubmit}
      />

      <EditHabitModal
        visible={isEditModalVisible}
        habit={habit}
        onClose={() => setIsEditModalVisible(false)}
        onSave={handleSaveHabit}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  createdText: {
    fontStyle: 'italic',
    color: '#666',
    fontSize: 14,
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
  helpText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  progressBox: {
    alignItems: 'center',
    gap: 8,
  },
  statsBox: {
    alignItems: 'center',
  },
  targetText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
}); 