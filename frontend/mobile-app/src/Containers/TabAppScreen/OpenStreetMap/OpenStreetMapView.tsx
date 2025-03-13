import React from 'react';
import { 
  View, 
  StyleSheet, 
  Platform, 
  requireNativeComponent, 
  ViewStyle 
} from 'react-native';

// Type definitions for the map props
interface OpenStreetMapViewProps {
  style?: ViewStyle;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  onMapReady?: () => void;
  onRegionChange?: (region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }) => void;
}

// On Android, use the native OSM component
const OSMMapView = Platform.OS === 'android' 
  ? requireNativeComponent<OpenStreetMapViewProps>('OSMMapView')
  : View;

const OpenStreetMapView: React.FC<OpenStreetMapViewProps> = ({
  style,
  initialRegion = {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  onMapReady,
  onRegionChange,
}) => {
  return (
    <OSMMapView
      style={[styles.map, style]}
      initialRegion={initialRegion}
      onMapReady={onMapReady}
      onRegionChange={onRegionChange}
    />
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default OpenStreetMapView;