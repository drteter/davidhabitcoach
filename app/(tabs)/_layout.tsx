import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { Platform, TouchableOpacity, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CreateHabitModal } from '@/components/CreateHabitModal';
import { habitService } from '@/services/habitService';
import { HabitType } from '@/types/habit';

// Add type declaration for global
declare global {
  var addHabit: (() => void) | undefined;
  var loadHabits: (() => void) | undefined;
  var updateHabitCompletion: ((habitId: string, completed: boolean) => void) | undefined;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCreateHabit = async (habitData: {
    name: string;
    type: HabitType;
    goal: {
      frequency: number;
      period: 'day' | 'week' | 'month' | 'year';
      target?: number;
    };
  }) => {
    try {
      console.log('Creating habit with data:', habitData); // Debug log
      
      const newHabit = await habitService.addHabit({
        name: habitData.name,
        type: habitData.type,
        createdAt: new Date(),
        completedDates: [],
        completions: [],
        metadata: {
          goal: habitData.goal,
        },
      });
      
      console.log('Created habit:', newHabit); // Debug log
      
      setIsModalVisible(false);
      
      // Remove the timeout and call loadHabits directly
      if (global.loadHabits) {
        global.loadHabits();
      }
      
    } catch (e) {
      console.error('Failed to create habit:', e);
    }
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.background,
          },
          tabBarStyle: {
            backgroundColor: Colors.background,
          },
          tabBarActiveTintColor: Colors.tabIconSelected,
          tabBarInactiveTintColor: Colors.tabIconDefault,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Habits',
            tabBarIcon: ({ color }) => <IconSymbol name="list-outline" color={color} />,
            headerRight: () => (
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setIsModalVisible(true)}
              >
                <IconSymbol name="add-outline" color="white" size={28} />
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="habit"
          options={{
            headerShown: false,
            href: null
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => <IconSymbol name="compass-outline" color={color} size={28} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <IconSymbol name="settings-outline" color={color} />,
          }}
        />
      </Tabs>

      <CreateHabitModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleCreateHabit}
      />
    </>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
