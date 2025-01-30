import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Habit, HabitMetadata, CompletionData } from '../types/habit';

export const habitService = {
  async getHabits(): Promise<Habit[]> {
    const habitsCol = collection(db, 'habits');
    const snapshot = await getDocs(habitsCol);
    const habits = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as Habit[];
    console.log('Fetched habits:', habits); // Debug log
    return habits;
  },

  async addHabit(habit: Omit<Habit, 'id'>): Promise<Habit> {
    const habitsCol = collection(db, 'habits');
    console.log('Adding habit:', habit); // Debug log
    
    // Ensure all required fields are present
    const habitData = {
      ...habit,
      createdAt: new Date(),
      completedDates: [],
      completions: [],
      type: habit.type || 'boolean', // Default to boolean if not specified
    };
    
    const docRef = await addDoc(habitsCol, habitData);
    
    // Fetch the newly created document to ensure it exists
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Failed to create habit');
    }
    
    const newHabit = {
      id: docRef.id,
      ...habitData,
    };
    
    console.log('Created habit:', newHabit); // Debug log
    return newHabit;
  },

  async toggleHabitCompletion(
    habitId: string, 
    date: string, 
    metadata?: HabitMetadata
  ): Promise<void> {
    console.log('Starting toggleHabitCompletion for habit:', habitId, 'date:', date);
    const habitRef = doc(db, 'habits', habitId);
    const habitDoc = await getDoc(habitRef);
    const habitData = habitDoc.data();
    
    if (!habitData) {
      console.log('No habit found in Firebase');
      return;
    }

    // Initialize arrays if they don't exist
    const completedDates = [...(habitData.completedDates || [])];
    const completions = [...(habitData.completions || [])];

    if (completedDates.includes(date)) {
      // Remove the date
      const filteredDates = completedDates.filter(d => d !== date);
      const filteredCompletions = completions.filter(c => c.date !== date);
      
      await updateDoc(habitRef, {
        completedDates: filteredDates,
        completions: filteredCompletions,
      });
    } else {
      // Add the date
      const newCompletedDates = [...completedDates, date];
      
      // Create completion data without undefined values
      const completionData: CompletionData = { date };
      
      // Only add metadata if it contains actual data
      if (metadata && Object.keys(metadata).length > 0) {
        // Filter out any undefined values from metadata
        const cleanMetadata = Object.fromEntries(
          Object.entries(metadata).filter(([_, value]) => value !== undefined)
        );
        
        if (Object.keys(cleanMetadata).length > 0) {
          completionData.metadata = cleanMetadata;
        }
      }
      
      const newCompletions = [...completions, completionData];
      
      await updateDoc(habitRef, {
        completedDates: newCompletedDates,
        completions: newCompletions,
      });
    }
    
    console.log('Successfully updated habit in Firebase');
  },

  async deleteHabit(habitId: string): Promise<void> {
    const habitRef = doc(db, 'habits', habitId);
    await deleteDoc(habitRef);
  },

  async updateHabit(habitId: string, updates: Partial<Habit>): Promise<void> {
    const habitRef = doc(db, 'habits', habitId);
    await updateDoc(habitRef, updates);
  },
}; 