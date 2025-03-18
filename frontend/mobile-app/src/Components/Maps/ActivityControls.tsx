import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ActivityControlsProps {
  isTracking: boolean;
  onStartTracking: () => void;
  onStopTracking: () => void;
  onSaveActivity: () => void;
  onDiscardActivity: () => void;
}

const ActivityControls: React.FC<ActivityControlsProps> = ({
  isTracking,
  onStartTracking,
  onStopTracking,
  onSaveActivity,
  onDiscardActivity,
}) => {
  return (
    <View style={styles.container}>
      {isTracking ? (
        <TouchableOpacity style={styles.button} onPress={onStopTracking}>
          <Icon name="pause" size={24} color="#fff" />
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, styles.startButton]} onPress={onStartTracking}>
          <Icon name="play-arrow" size={24} color="#fff" />
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      )}

      {!isTracking && (
        <>
          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={onSaveActivity}>
            <Icon name="save" size={24} color="#fff" />
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.discardButton]} onPress={onDiscardActivity}>
            <Icon name="delete" size={24} color="#fff" />
            <Text style={styles.buttonText}>Discard</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#666',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  discardButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  }
});

export default ActivityControls;