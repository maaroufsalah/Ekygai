import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrackingStats } from '../../types/types';

interface TrackingDisplayProps {
  stats: TrackingStats;
}

const TrackingDisplay: React.FC<TrackingDisplayProps> = ({ stats }) => {
  // Format duration as HH:MM:SS
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format distance
  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${meters.toFixed(0)} m`;
    } else {
      return `${(meters / 1000).toFixed(2)} km`;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.currentSpeed.toFixed(1)}</Text>
          <Text style={styles.statLabel}>km/h</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{formatDistance(stats.distance)}</Text>
          <Text style={styles.statLabel}>Distance</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{formatDuration(stats.duration)}</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.currentAltitude.toFixed(0)} m</Text>
          <Text style={styles.statLabel}>Altitude</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>+{stats.elevationGain.toFixed(0)} m</Text>
          <Text style={styles.statLabel}>Elevation Gain</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>-{stats.elevationLoss.toFixed(0)} m</Text>
          <Text style={styles.statLabel}>Elevation Loss</Text>
        </View>
      </View>

      <View style={styles.terrainContainer}>
        <Text style={styles.terrainLabel}>Terrain:</Text>
        <Text style={styles.terrainValue}>{stats.terrainType.charAt(0).toUpperCase() + stats.terrainType.slice(1)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  terrainContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  terrainLabel: {
    fontSize: 14,
    marginRight: 5,
  },
  terrainValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TrackingDisplay;