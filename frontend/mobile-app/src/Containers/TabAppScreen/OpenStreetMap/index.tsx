import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import OpenStreetMapView from './OpenStreetMapView';

const OpenStreetMap: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const handleMapReady = () => {
    console.log('Map is fully loaded');
  };

  const handleRegionChange = (region: any) => {
    console.log('Map region changed:', region);
    setCurrentLocation(region);
  };

  const recenterMap = () => {
    setCurrentLocation({
      latitude: 37.7749,
      longitude: -122.4194,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  return (
    <View style={styles.container}>
      <OpenStreetMapView
        style={styles.map}
        initialRegion={currentLocation}
        onMapReady={handleMapReady}
        onRegionChange={handleRegionChange}
      />
      
      <TouchableOpacity 
        style={styles.recenterButton} 
        onPress={recenterMap}
      >
        <Text style={styles.recenterButtonText}>
          Recenter
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  recenterButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recenterButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default OpenStreetMap;