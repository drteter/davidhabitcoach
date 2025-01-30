import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
} from 'react-native';
import { ThemedText } from './ThemedText';
import { Colors } from '../constants/Colors';
import { Habit, HabitMetadata } from '../types/habit';

interface Props {
  visible: boolean;
  habit: Habit;
  onClose: () => void;
  onSave: (updates: Partial<Habit>) => void;
}

export function EditHabitModal({ visible, habit, onClose, onSave }: Props) {
  const [name, setName] = useState(habit.name);
  const [goal, setGoal] = useState(habit.metadata?.goal?.target?.toString() || '');
  const [period, setPeriod] = useState(habit.metadata?.goal?.period || 'year');

  const handleSave = () => {
    const updates: Partial<Habit> = {
      name,
      metadata: {
        ...habit.metadata,
        goal: {
          target: parseInt(goal) || 0,
          period,
          frequency: 1, // Default frequency
        },
      },
    };
    onSave(updates);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <ThemedText type="title" style={styles.modalTitle}>
              Edit {habit.name}
            </ThemedText>

            <View style={styles.inputGroup}>
              <ThemedText>Habit Name</ThemedText>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Habit name"
              />
            </View>

            {habit.type === 'counter' && (
              <View style={styles.inputGroup}>
                <ThemedText>Goal Target</ThemedText>
                <TextInput
                  style={styles.input}
                  value={goal}
                  onChangeText={setGoal}
                  placeholder="Enter goal (e.g., 100000)"
                  keyboardType="number-pad"
                />
                
                <ThemedText>Goal Period</ThemedText>
                <View style={styles.periodContainer}>
                  {['day', 'week', 'month', 'year'].map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.periodButton,
                        period === p && styles.periodButtonActive,
                      ]}
                      onPress={() => setPeriod(p as 'day' | 'week' | 'month' | 'year')}
                    >
                      <ThemedText
                        style={[
                          styles.periodButtonText,
                          period === p && styles.periodButtonTextActive,
                        ]}
                      >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <ThemedText style={styles.buttonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSave}
              >
                <ThemedText style={styles.buttonText}>Save</ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: 8,
  },
  periodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  periodButtonActive: {
    backgroundColor: Colors.primary,
  },
  periodButtonText: {
    color: '#666',
  },
  periodButtonTextActive: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  submitButton: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
}); 