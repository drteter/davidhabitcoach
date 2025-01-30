import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
} from 'react-native';
import { ThemedText } from './ThemedText';
import { Colors } from '../constants/Colors';

interface Props {
  visible: boolean;
  date: string;
  onClose: () => void;
  onSubmit: (count: number) => void;
}

export function CounterInputModal({ visible, date, onClose, onSubmit }: Props) {
  const [count, setCount] = useState('');

  const handleSubmit = () => {
    const numberCount = parseInt(count);
    if (numberCount > 0) {
      onSubmit(numberCount);
      setCount('');
    }
    onClose();
  };

  // Format the date string correctly by parsing it as UTC
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;
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
          <ThemedText type="title" style={styles.modalTitle}>
            Add Count for {formatDate(date)}
          </ThemedText>

          <TextInput
            style={styles.input}
            value={count}
            onChangeText={setCount}
            placeholder="Enter count"
            keyboardType="number-pad"
            autoFocus
          />

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
              <ThemedText style={styles.buttonText}>Save</ThemedText>
            </TouchableOpacity>
          </View>
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
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
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