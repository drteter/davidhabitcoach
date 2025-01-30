import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Habit } from '../types/habit';

export const habitService = {
  async getHabits(): Promise<Habit[]> {
    const habitsCol = collection(db, 'habits');
    const snapshot = await getDocs(habitsCol);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as Habit[];
  },

  async addHabit(habit: Omit<Habit, 'id'>): Promise<Habit> {
    const habitsCol = collection(db, 'habits');
    const docRef = await addDoc(habitsCol, {
      ...habit,
      createdAt: new Date(),
      completedDates: [],
    });
    
    return {
      id: docRef.id,
      ...habit,
      createdAt: new Date(),
      completedDates: [],
    };
  },

  async toggleHabitCompletion(habitId: string, date: string): Promise<void> {
    const habitRef = doc(db, 'habits', habitId);
    const habitDoc = await getDoc(habitRef);
    const completedDates = habitDoc.data()?.completedDates || [];
    
    if (completedDates.includes(date)) {
      await updateDoc(habitRef, {
        completedDates: completedDates.filter((d: string) => d !== date),
      });
    } else {
      await updateDoc(habitRef, {
        completedDates: [...completedDates, date],
      });
    }
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