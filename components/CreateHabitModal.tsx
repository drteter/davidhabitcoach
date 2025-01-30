import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { ThemedText } from './ThemedText';
import { Colors } from '../constants/Colors';
import { HabitType } from '../types/habit';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (habitData: {
    name: string;
    type: HabitType;
    goal: {
      frequency: number;
      period: 'day' | 'week' | 'month' | 'year';
      target?: number;
    };
  }) => void;
}

export function CreateHabitModal({ visible, onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState<HabitType>('boolean');
  const [frequency, setFrequency] = useState('1');
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [target, setTarget] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;

    const habitData = {
      name: name.trim(),
      type,
      goal: {
        frequency: parseInt(frequency) || 1,
        period,
        ...(type === 'counter' ? { target: parseInt(target) || 0 } : {}),
      },
    };

    console.log('Submitting habit:', habitData); // Debug log
    onSubmit(habitData);

    // Reset form
    setName('');
    setType('boolean');
    setFrequency('1');
    setPeriod('week');
    setTarget('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <ThemedText type="title" style={styles.modalTitle}>
              Create New Habit
            </ThemedText>

            <View style={styles.inputGroup}>
              <ThemedText type="defaultSemiBold">Habit Name</ThemedText>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter habit name"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText type="defaultSemiBold">Habit Type</ThemedText>
              <View style={styles.typeContainer}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    type === 'boolean' && styles.typeButtonSelected,
                  ]}
                  onPress={() => setType('boolean')}
                >
                  <ThemedText
                    style={[
                      styles.typeButtonText,
                      type === 'boolean' && styles.typeButtonTextSelected,
                    ]}
                  >
                    Yes/No
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    type === 'counter' && styles.typeButtonSelected,
                  ]}
                  onPress={() => setType('counter')}
                >
                  <ThemedText
                    style={[
                      styles.typeButtonText,
                      type === 'counter' && styles.typeButtonTextSelected,
                    ]}
                  >
                    Counter
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText type="defaultSemiBold">Goal</ThemedText>
              <View style={styles.goalContainer}>
                <TextInput
                  style={[styles.input, styles.numberInput]}
                  value={frequency}
                  onChangeText={setFrequency}
                  keyboardType="number-pad"
                  placeholder="1"
                  placeholderTextColor="#999"
                />
                <View style={styles.periodSelector}>
                  {(['day', 'week', 'month', 'year'] as const).map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.periodButton,
                        period === p && styles.periodButtonSelected,
                      ]}
                      onPress={() => setPeriod(p)}
                    >
                      <ThemedText
                        style={[
                          styles.periodButtonText,
                          period === p && styles.periodButtonTextSelected,
                        ]}
                      >
                        {p}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {type === 'counter' && (
                <View style={styles.targetContainer}>
                  <ThemedText>Target:</ThemedText>
                  <TextInput
                    style={[styles.input, styles.numberInput]}
                    value={target}
                    onChangeText={setTarget}
                    keyboardType="number-pad"
                    placeholder="e.g., 50000"
                    placeholderTextColor="#999"
                  />
                  <ThemedText>per year</ThemedText>
                </View>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <ThemedText style={styles.buttonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
              >
                <ThemedText style={styles.buttonText}>Create</ThemedText>
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
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
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
  typeContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeButtonText: {
    color: '#666',
  },
  typeButtonTextSelected: {
    color: 'white',
  },
  goalContainer: {
    marginTop: 8,
  },
  numberInput: {
    width: 80,
  },
  periodSelector: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  periodButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  periodButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  periodButtonText: {
    color: '#666',
  },
  periodButtonTextSelected: {
    color: 'white',
  },
  targetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
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