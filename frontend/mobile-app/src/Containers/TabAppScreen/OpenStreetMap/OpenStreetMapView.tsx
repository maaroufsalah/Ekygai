import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Platform, 
  requireNativeComponent, 
  NativeModules,
  UIManager,
  findNodeHandle,
  ViewStyle,
  Text
} from 'react-native';

// Define interfaces for the component props and refs
export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface OpenStreetMapViewProps {
  style?: ViewStyle;
  initialRegion?: Region;
  onMapReady?: () => void;
  onRegionChange?: (region: Region) => void;
  showsUserLocation?: boolean;
  followsUserLocation?: boolean;
  onError?: (error: string) => void;
}

export interface OpenStreetMapViewRef {
  animateToRegion: (region: Region, duration?: number) => void;
  getMapBoundaries: () => Promise<{ northEast: { latitude: number; longitude: number }; southWest: { latitude: number; longitude: number } }>;
}

// Check if 'OSMMapView' exists in UIManager
const hasOSMMapViewModule = Platform.OS === 'android' && UIManager.getViewManagerConfig ? 
  !!UIManager.getViewManagerConfig('OSMMapView') : false;

// Create the native component reference only if it exists
const OSMMapView = hasOSMMapViewModule
  ? requireNativeComponent<OpenStreetMapViewProps>('OSMMapView')
  : View;

// Create the forwardRef component with explicit TypeScript types
const OpenStreetMapView = forwardRef<OpenStreetMapViewRef, OpenStreetMapViewProps>((props, ref) => {
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Region | null>(null);
  
  const {
    style,
    initialRegion = {
      latitude: 37.7749,
      longitude: -122.4194,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    onMapReady,
    onRegionChange,
    showsUserLocation = true,
    followsUserLocation = false,
    onError,
    ...rest
  } = props;

  // Store initialRegion in currentLocation state when component mounts
  useEffect(() => {
    setCurrentLocation(initialRegion);
  }, []);

  const nativeRef = useRef<any>(null);

  // Check if we have the native module commands
  useEffect(() => {
    if (Platform.OS === 'android') {
      if (!hasOSMMapViewModule) {
        const errorMsg = 'OSMMapView native module not found';
        console.error(errorMsg);
        setMapError(errorMsg);
        if (onError) onError(errorMsg);
        return;
      }
      
      try {
        const commands = UIManager.getViewManagerConfig('OSMMapView').Commands;
        if (!commands || !commands.animateToRegion) {
          const errorMsg = 'animateToRegion command not found in OSMMapView module';
          console.error(errorMsg);
          setMapError(errorMsg);
          if (onError) onError(errorMsg);
        }
      } catch (error) {
        const errorMsg = `Error checking OSMMapView commands: ${error}`;
        console.error(errorMsg);
        setMapError(errorMsg);
        if (onError) onError(errorMsg);
      }
    }
  }, [onError]);

  // JavaScript animation fallback
  const animateToRegionFallback = (region: Region, duration: number = 500) => {
    if (!currentLocation) {
      setCurrentLocation(region);
      return;
    }
    
    const startTime = Date.now();
    const startRegion = { ...currentLocation };
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const newRegion = {
        latitude: startRegion.latitude + (region.latitude - startRegion.latitude) * progress,
        longitude: startRegion.longitude + (region.longitude - startRegion.longitude) * progress,
        latitudeDelta: startRegion.latitudeDelta + (region.latitudeDelta - startRegion.latitudeDelta) * progress,
        longitudeDelta: startRegion.longitudeDelta + (region.longitudeDelta - startRegion.longitudeDelta) * progress,
      };
      
      setCurrentLocation(newRegion);
      if (onRegionChange) {
        onRegionChange(newRegion);
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  // Custom onMapReady handler to set local state
  const handleMapReady = () => {
    console.log('OpenStreetMapView: Map is ready');
    setIsMapReady(true);
    if (onMapReady) {
      onMapReady();
    }
  };

  // Handle region change events from the map
  const handleRegionChange = (region: Region) => {
    setCurrentLocation(region);
    if (onRegionChange) {
      onRegionChange(region);
    }
  };

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    animateToRegion: (region: Region, duration: number = 500) => {
      console.log('animateToRegion called with:', region);
      
      if (!nativeRef.current) {
        const errorMsg = 'animateToRegion: nativeRef is null';
        console.error(errorMsg);
        if (onError) onError(errorMsg);
        animateToRegionFallback(region, duration);
        return;
      }
      
      if (Platform.OS === 'android' && nativeRef.current) {
        try {
          // For debugging, log the handle
          const nodeHandle = findNodeHandle(nativeRef.current);
          console.log('Node handle:', nodeHandle);
          
          if (!nodeHandle) {
            const errorMsg = 'animateToRegion: findNodeHandle returned null';
            console.error(errorMsg);
            if (onError) onError(errorMsg);
            // Use fallback
            animateToRegionFallback(region, duration);
            return;
          }
          
          // Check if we have the command
          const commands = UIManager.getViewManagerConfig('OSMMapView').Commands;
          if (!commands || !commands.animateToRegion) {
            const errorMsg = 'animateToRegion command not available';
            console.error(errorMsg);
            if (onError) onError(errorMsg);
            // Use fallback
            animateToRegionFallback(region, duration);
            return;
          }
          
          // Dispatch the command
          UIManager.dispatchViewManagerCommand(
            nodeHandle,
            commands.animateToRegion,
            [region, duration]
          );
          
          console.log('animateToRegion command dispatched successfully');
        } catch (error) {
          const errorMsg = `Error animating to region: ${error}`;
          console.error(errorMsg);
          if (onError) onError(errorMsg);
          // Use fallback
          animateToRegionFallback(region, duration);
        }
      } else {
        // Use fallback for iOS or if nativeRef is null
        animateToRegionFallback(region, duration);
      }
    },
    getMapBoundaries: () => {
      return new Promise((resolve, reject) => {
        if (Platform.OS === 'android' && nativeRef.current) {
          try {
            // Check if command exists
            const commands = UIManager.getViewManagerConfig('OSMMapView').Commands;
            if (!commands || !commands.getMapBoundaries) {
              const errorMsg = 'getMapBoundaries command not available';
              if (onError) onError(errorMsg);
              reject(new Error(errorMsg));
              return;
            }
            
            const nodeHandle = findNodeHandle(nativeRef.current);
            if (!nodeHandle) {
              const errorMsg = 'getMapBoundaries: findNodeHandle returned null';
              if (onError) onError(errorMsg);
              reject(new Error(errorMsg));
              return;
            }
            
            UIManager.dispatchViewManagerCommand(
              nodeHandle,
              commands.getMapBoundaries,
              []
            );
            
            // Since we can't get actual data back immediately, provide a fallback
            if (currentLocation) {
              const delta = 0.01; // Approximate value for demonstration
              resolve({
                northEast: { 
                  latitude: currentLocation.latitude + delta, 
                  longitude: currentLocation.longitude + delta 
                },
                southWest: { 
                  latitude: currentLocation.latitude - delta, 
                  longitude: currentLocation.longitude - delta 
                }
              });
            } else {
              resolve({
                northEast: { latitude: 0, longitude: 0 },
                southWest: { latitude: 0, longitude: 0 }
              });
            }
          } catch (error) {
            if (onError) onError(`Error getting map boundaries: ${error}`);
            reject(error);
          }
        } else {
          const errorMsg = 'Map boundaries not available';
          if (onError) onError(errorMsg);
          reject(new Error(errorMsg));
        }
      });
    }
  }));

  if (mapError) {
    return (
      <View style={[styles.map, style, styles.errorContainer]}>
        <Text style={styles.errorText}>Map Error: {mapError}</Text>
        {currentLocation && (
          <Text style={styles.fallbackCoords}>
            Current Position: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
          </Text>
        )}
      </View>
    );
  }

  // Fix for TypeScript error: Only pass View props when using View as fallback
  if (!hasOSMMapViewModule) {
    return (
      <View 
        ref={nativeRef}
        style={[styles.map, style, styles.errorContainer]}
        {...rest}
      >
        <Text style={styles.errorText}>OpenStreetMap not available</Text>
        <Text style={styles.errorSubtext}>Native module could not be loaded</Text>
        {currentLocation && (
          <Text style={styles.fallbackCoords}>
            Current Position: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
          </Text>
        )}
      </View>
    );
  }

  // Use actual OSMMapView when available
  return (
    <OSMMapView
      ref={nativeRef}
      style={[styles.map, style]}
      initialRegion={initialRegion}
      onMapReady={handleMapReady}
      onRegionChange={handleRegionChange}
      showsUserLocation={showsUserLocation}
      followsUserLocation={followsUserLocation}
      {...rest}
    />
  );
});

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorSubtext: {
    color: '#666',
    textAlign: 'center',
    padding: 5,
    fontSize: 14,
  },
  fallbackCoords: {
    color: '#444',
    textAlign: 'center',
    padding: 10,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  }
});

export default OpenStreetMapView;