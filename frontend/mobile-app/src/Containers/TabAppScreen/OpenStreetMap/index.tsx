import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import OpenStreetMapView, { OpenStreetMapViewRef, Region } from './OpenStreetMapView';
import { Route, TrackingStats } from '../../../types/types';
import GpsTrackingService from '../../../Helper/GpsTrackingService';
import { getCurrentPosition, useCurrentLocation } from '../../../Services/LocationService';

const { width, height } = Dimensions.get('window');

const OpenStreetMap: React.FC = () => {
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [stats, setStats] = useState<TrackingStats>({
    currentSpeed: 0,
    averageSpeed: 0,
    distance: 0,
    duration: 0,
    currentAltitude: 0,
    elevationGain: 0,
    elevationLoss: 0,
    terrainType: 'flat',
  });
  const [route, setRoute] = useState<Route>({ points: [] });
  const [currentLocation, setCurrentLocation] = useState<Region>({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState<boolean>(false);
  
  const mapRef = useRef<OpenStreetMapViewRef>(null);
  
  // Use our custom location hook
  const { 
    location, 
    error, 
    loading, 
    getLocation 
  } = useCurrentLocation({ enableHighAccuracy: true });

  // Update map when location changes
  useEffect(() => {
    if (location && location.coords) {
      const newRegion: Region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      
      setCurrentLocation(newRegion);
      
      // If map ref is ready and we're not tracking yet, animate to the new location
      if (mapRef.current && !isTracking && mapReady) {
        try {
          mapRef.current.animateToRegion(newRegion, 1000);
        } catch (err) {
          console.error('Error animating to region:', err);
          setMapError('Error updating map location');
        }
      }
    }
  }, [location, mapReady]);

  // Show error if location service fails
  useEffect(() => {
    if (error) {
      Alert.alert('Location Error', error);
    }
  }, [error]);

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

  const handleMapReady = () => {
    console.log('Map is fully loaded');
    setMapReady(true);
  };

  const handleMapError = (error: string) => {
    console.error('Map error:', error);
    setMapError(error);
  };

  const handleRegionChange = (region: Region) => {
    // Only update currentLocation state if we're not tracking
    if (!isTracking) {
      setCurrentLocation(region);
    }
  };

  const handleStartTracking = async () => {
    try {
      // Get current location before starting tracking
      setIsLocating(true);
      const position = await getCurrentPosition({ 
        enableHighAccuracy: true,
        timeout: 10000
      });
      
      if (position) {
        // Initialize route with current position
        const newPoint = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude || 0,
          accuracy: position.coords.accuracy || 0,
          speed: position.coords.speed || 0,
          timestamp: position.timestamp
        };
        
        setRoute({
          points: [newPoint]
        });
        
        const startRegion: Region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        
        if (mapRef.current && mapReady) {
          try {
            mapRef.current.animateToRegion(startRegion, 1000);
          } catch (err) {
            console.error('Error animating to region:', err);
          }
        }
        
        setCurrentLocation(startRegion);
        setIsTracking(true);
        
        // Start a timer to update duration
        const startTime = Date.now();
        const durationInterval = setInterval(() => {
          if (isTracking) {
            const elapsedSeconds = (Date.now() - startTime) / 1000;
            setStats(prev => ({
              ...prev,
              duration: elapsedSeconds
            }));
          } else {
            clearInterval(durationInterval);
          }
        }, 1000);
        
        // Start watching position for tracking
        watchLocationForTracking();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Failed to start tracking: ${errorMessage}`);
    } finally {
      setIsLocating(false);
    }
  };

  const watchLocationForTracking = () => {
    // Use GpsTrackingService to handle tracking
    GpsTrackingService.startTracking((updatedStats, updatedRoute) => {
      // Update stats and route when the tracking service provides new data
      setStats(updatedStats);
      setRoute(updatedRoute);
      
      // Update map position if we have points and tracking is active
      if (updatedRoute.points.length > 0 && isTracking && mapRef.current && mapReady) {
        const lastPoint = updatedRoute.points[updatedRoute.points.length - 1];
        
        const region: Region = {
          latitude: lastPoint.latitude,
          longitude: lastPoint.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        
        try {
          mapRef.current.animateToRegion(region, 500);
        } catch (err) {
          console.error('Error animating to region:', err);
        }
      }
    });
    
    // Return a cleanup function to stop tracking
    return () => {
      GpsTrackingService.stopTracking();
    };
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    GpsTrackingService.stopTracking();
  };

  const handleSaveActivity = () => {
    // Implementation for saving the activity
    Alert.alert('Success', 'Activity saved successfully!');
    
    // Reset the state after saving
    setRoute({ points: [] });
    setStats({
      currentSpeed: 0,
      averageSpeed: 0,
      distance: 0,
      duration: 0,
      currentAltitude: 0,
      elevationGain: 0,
      elevationLoss: 0,
      terrainType: 'flat',
    });
  };

  const handleDiscardActivity = () => {
    // Reset the state
    setRoute({ points: [] });
    setStats({
      currentSpeed: 0,
      averageSpeed: 0,
      distance: 0,
      duration: 0,
      currentAltitude: 0,
      elevationGain: 0,
      elevationLoss: 0,
      terrainType: 'flat',
    });
  };

  const handleLocateMe = async () => {
    try {
      setIsLocating(true);
      
      // Get current position and center map
      const position = await getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });
      
      if (position && mapRef.current && mapReady) {
        const region: Region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.005, // Zoom in closer
          longitudeDelta: 0.005,
        };
        
        // Animate to the new region
        try {
          mapRef.current.animateToRegion(region, 1000);
        } catch (err) {
          console.error('Error animating to region:', err);
        }
        
        // Update current location state
        setCurrentLocation(region);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error getting current location:', errorMessage);
      Alert.alert('Location Error', 'Could not retrieve your current location');
    } finally {
      setIsLocating(false);
    }
  };

  // Simple fallback map component when native map has errors
  const renderFallbackMap = () => (
    <View style={styles.fallbackMapContainer}>
      <Text style={styles.fallbackMapText}>Map is currently unavailable</Text>
      {mapError && <Text style={styles.mapErrorText}>Error: {mapError}</Text>}
      <Text style={styles.fallbackMapCoords}>
        Current Position: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
      </Text>
    </View>
  );

  if (loading && !location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Map or Fallback */}
      {mapError ? renderFallbackMap() : (
        <OpenStreetMapView
          ref={mapRef}
          style={styles.map}
          initialRegion={currentLocation}
          onMapReady={handleMapReady}
          onRegionChange={handleRegionChange}
          showsUserLocation={true}
          followsUserLocation={isTracking}
          onError={handleMapError}
        />
      )}
      
      {/* Overlay to ensure UI visibility */}
      <View style={styles.mapOverlay} pointerEvents="none" />
      
      {/* Current Location Button */}
      <TouchableOpacity 
        style={styles.myLocationButton} 
        onPress={handleLocateMe}
        activeOpacity={0.8}
        disabled={isLocating}
      >
        <View style={styles.myLocationButtonInner}>
          {isLocating ? (
            <ActivityIndicator size="small" color="#4285F4" />
          ) : (
            <Text style={styles.myLocationIcon}>📍</Text>
          )}
        </View>
      </TouchableOpacity>
      
      {/* Location Display */}
      <View style={styles.locationInfoContainer}>
        <Text style={styles.locationInfoText}>
          {currentLocation ? 
            `Lat: ${currentLocation.latitude.toFixed(5)}, Lng: ${currentLocation.longitude.toFixed(5)}` : 
            'Location unavailable'}
        </Text>
      </View>
      
      {/* Stats Display */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
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

        <View style={styles.statsRow}>
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
      </View>
      
      {/* Main Action Buttons - Using elevated z-index */}
      <View style={styles.actionButtonContainer}>
        {isTracking ? (
          <TouchableOpacity 
            style={[styles.actionButton, styles.pauseButton]} 
            onPress={handleStopTracking}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>Pause</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.actionButton, styles.startButton]} 
            onPress={handleStartTracking}
            activeOpacity={0.8}
            disabled={isLocating}
          >
            {isLocating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.actionButtonText}>Start GPS</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {/* Save/Discard Buttons - Using elevated z-index */}
      {!isTracking && route.points.length > 0 && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]} 
            onPress={handleSaveActivity}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.discardButton]} 
            onPress={handleDiscardActivity}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Discard</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Debug info */}
      {__DEV__ && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>
            Map Ready: {mapReady ? "Yes" : "No"} | 
            Error: {mapError ? "Yes" : "No"}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1, // Ensure map stays below UI elements
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.05)',
    zIndex: 2,
    pointerEvents: 'none',
  },
  fallbackMapContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  fallbackMapText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  mapErrorText: {
    color: 'red',
    marginBottom: 10,
  },
  fallbackMapCoords: {
    fontSize: 14,
    color: '#777',
  },
  debugContainer: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 5,
    zIndex: 20,
  },
  debugText: {
    color: 'white',
    fontSize: 10,
  },
  myLocationButton: {
    position: 'absolute',
    right: 16,
    top: Platform.OS === 'ios' ? 60 : 20, // Adjust for different platforms
    width: 50, // Slightly larger
    height: 50, // Slightly larger
    borderRadius: 25,
    backgroundColor: 'white',
    elevation: 8, // Increased
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, // Increased
    shadowOpacity: 0.3, // Increased
    shadowRadius: 4, // Increased
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Above map but below other controls
    borderWidth: 2, // Added border
    borderColor: '#4285F4', // Added blue border
  },
  myLocationButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  myLocationIcon: {
    fontSize: 26, // Larger
    color: '#4285F4', // Blue color
  },
  locationInfoContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 110 : 70,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // More opaque
    borderRadius: 8,
    padding: 8,
    elevation: 4, // Increased
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Increased
    shadowOpacity: 0.25, // Increased
    shadowRadius: 3, // Increased
    zIndex: 10,
    borderWidth: 1, // Added border
    borderColor: '#ddd', // Light border
  },
  locationInfoText: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '500', // Slightly bolder
  },
  statsContainer: {
    position: 'absolute',
    bottom: 120, // Moved higher up to make room for action buttons
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    padding: 12, // Slightly more padding
    elevation: 6, // Increased
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, // Increased
    shadowOpacity: 0.3, // Increased
    shadowRadius: 5, // Increased
    zIndex: 10, // Ensure stats container is above map
    borderWidth: 1, // Added border
    borderColor: '#ddd', // Light border
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10, // Slightly more space
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18, // Larger
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#555', // Slightly darker
    marginTop: 2, // Added margin
  },
  // Main action button (Start/Pause)
  actionButtonContainer: {
    position: 'absolute',
    bottom: 40, // Moved higher up
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15, // Higher z-index to ensure visibility
  },
  actionButton: {
    width: 160, // Wider
    height: 55, // Taller
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10, // Increased
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 }, // Increased
    shadowOpacity: 0.4, // Increased
    shadowRadius: 6, // Increased
    borderWidth: 3, // Thicker border
    borderColor: '#FFFFFF', // White border
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20, // Larger
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // Darker shadow
    textShadowOffset: { width: 0, height: 2 }, // More offset
    textShadowRadius: 3, // More blur
  },
  // Secondary buttons (Save/Discard)
  buttonContainer: {
    position: 'absolute',
    bottom: 40, // Match with actionButtonContainer
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 15, // Higher z-index to ensure visibility
  },
  button: {
    flex: 1,
    height: 50, // Taller
    marginHorizontal: 8, // More space between buttons
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10, // Increased
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 }, // Increased
    shadowOpacity: 0.4, // Increased
    shadowRadius: 6, // Increased
    borderWidth: 2.5, // Thicker border
    borderColor: '#FFFFFF', // White border
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18, // Larger
    textShadowColor: 'rgba(0, 0, 0, 0.5)', // Darker shadow
    textShadowOffset: { width: 0, height: 2 }, // More offset
    textShadowRadius: 3, // More blur
  },
  startButton: {
    backgroundColor: '#4CAF50', // Green
    marginBottom: 10, // Space below
  },
  pauseButton: {
    backgroundColor: '#FF9800', // Orange
    marginBottom: 10, // Space below
  },
  saveButton: {
    backgroundColor: '#2196F3', // Blue
  },
  discardButton: {
    backgroundColor: '#F44336', // Red
  },
});

export default OpenStreetMap;