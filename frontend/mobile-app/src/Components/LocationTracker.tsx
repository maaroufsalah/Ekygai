import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
  PermissionsAndroid,
  Dimensions,
} from "react-native";
import MapView, { Marker, Polyline, UrlTile } from "react-native-maps"; // Add UrlTile
import Geolocation from "react-native-geolocation-service";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

// Define log tag
const LOG_TAG = "Aerofit:GPSTracker";

// API endpoint for your .NET backend
const API_CONFIG = {
  BASE_URL: "https://your-dotnet-api.com/api", // Replace with your actual API URL
  ENDPOINTS: {
    TRACKING_DATA: "/fitness/trackingData",
  },
  SYNC_INTERVAL: 30000, // 30 seconds
};

// Tracking configuration
const TRACKING_CONFIG = {
  LOCATION_UPDATE_INTERVAL: 3000, // 3 seconds
  LOCATION_DISTANCE_FILTER: 3, // 3 meters (minimum distance between location updates)
  STEP_LENGTH_METERS: 0.75, // Average step length for step count estimation
  CALORIES_PER_KM: 65, // Average calories burned per km
};

// Interface for GPS coordinates
interface Coordinate {
  latitude: number;
  longitude: number;
  timestamp?: number;
  altitude?: number | null;
  speed?: number | null;
  accuracy?: number | null;
}

// Interface for tracking metrics
interface TrackingMetrics {
  totalDistance: number;
  currentSpeed: number;
  averageSpeed: number;
  calories: number;
  steps: number;
  duration: number;
  elevationGain: number;
}

// Interface for component props
interface GPSTrackerProps {
  onDataUpdate?: (metrics: TrackingMetrics, coordinates: Coordinate[]) => void;
  userId?: string;
  showMap?: boolean;
  apiEndpoint?: string;
}

// The GPS Tracker Component
const GPSTracker: React.FC<GPSTrackerProps> = ({
  onDataUpdate,
  userId = "default_user",
  showMap = true,
  apiEndpoint,
}) => {
  // State for location and tracking
  const [location, setLocation] = useState<Coordinate | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mapVisible, setMapVisible] = useState(showMap);
  
  // Tracking metrics state
  const [metrics, setMetrics] = useState<TrackingMetrics>({
    totalDistance: 0,
    currentSpeed: 0,
    averageSpeed: 0,
    calories: 0,
    steps: 0,
    duration: 0,
    elevationGain: 0,
  });
  
  // References
  const mapRef = useRef<MapView | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastAltitudeRef = useRef<number | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Default map region
  const defaultRegion = {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  // Check location permission on component mount
  useEffect(() => {
    console.log(`${LOG_TAG} Component mounted`);
    checkLocationPermission();
    
    return () => {
      console.log(`${LOG_TAG} Component will unmount, cleaning up`);
      stopTracking();
    };
  }, []);

  // Update metrics when route coordinates change
  useEffect(() => {
    if (routeCoordinates.length >= 2 && isTracking && !isPaused) {
      updateMetrics();
    }
  }, [routeCoordinates, isTracking, isPaused]);

  // Set up data syncing to API when tracking is active
  useEffect(() => {
    if (isTracking && !isPaused && routeCoordinates.length > 0) {
      startDataSync();
    } else {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    }
    
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [isTracking, isPaused, routeCoordinates]);

  // Check if location permission is granted
  const checkLocationPermission = async () => {
    console.log(`${LOG_TAG} Checking location permission`);
    try {
      let permissionStatus;
      if (Platform.OS === "ios") {
        permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      } else {
        permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      }

      if (permissionStatus === RESULTS.GRANTED) {
        console.log(`${LOG_TAG} Permission already granted`);
        setPermissionGranted(true);
      } else {
        console.log(`${LOG_TAG} Permission not granted`);
        setPermissionGranted(false);
      }
    } catch (error) {
      console.error(`${LOG_TAG} Error checking location permission:`, error);
    }
  };

  // Request location permission
  const requestLocationPermission = async () => {
    console.log(`${LOG_TAG} Requesting location permission`);
    try {
      setLoading(true);
      let permissionStatus;

      if (Platform.OS === "ios") {
        permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      } else {
        permissionStatus = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
      }

      if (permissionStatus === RESULTS.GRANTED || permissionStatus === PermissionsAndroid.RESULTS.GRANTED) {
        console.log(`${LOG_TAG} Permission granted by user`);
        setPermissionGranted(true);
        return true;
      } else {
        console.log(`${LOG_TAG} Permission denied by user`);
        Alert.alert(
          "Permission Denied",
          "Please enable location access in settings to use tracking features.",
          [{ text: "OK" }]
        );
        return false;
      }
    } catch (error) {
      console.error(`${LOG_TAG} Error requesting location permission:`, error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Calculate distance between two coordinates
  const calculateDistance = (coord1: Coordinate, coord2: Coordinate): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (coord2.latitude - coord1.latitude) * (Math.PI / 180);
    const dLon = (coord2.longitude - coord1.longitude) * (Math.PI / 180);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1.latitude * (Math.PI / 180)) *
        Math.cos(coord2.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  // Calculate total distance of route
  const calculateTotalDistance = (coordinates: Coordinate[]): number => {
    let totalDistance = 0;
    
    for (let i = 1; i < coordinates.length; i++) {
      const segmentDistance = calculateDistance(coordinates[i - 1], coordinates[i]);
      
      // Filter out erroneous readings (prevent big jumps)
      if (segmentDistance < 0.1) { // Less than 100 meters per update
        totalDistance += segmentDistance;
      } else {
        console.log(`${LOG_TAG} Filtered out suspicious distance jump: ${segmentDistance.toFixed(5)} km`);
      }
    }
    
    return totalDistance;
  };

  // Update tracking metrics
  const updateMetrics = () => {
    if (routeCoordinates.length < 2) return;
    
    const totalDistance = calculateTotalDistance(routeCoordinates);
    const currentTime = Date.now();
    const duration = startTimeRef.current > 0 ? (currentTime - startTimeRef.current) / 1000 : 0; // in seconds
    
    // Calculate current speed (from device if available, or calculate from distance)
    const lastCoord = routeCoordinates[routeCoordinates.length - 1];
    const currentSpeed = lastCoord.speed !== undefined && lastCoord.speed !== null 
      ? lastCoord.speed * 3.6 // Convert m/s to km/h
      : 0;
    
    // Calculate average speed
    const averageSpeed = duration > 0 ? (totalDistance / (duration / 3600)) : 0; // km/h
    
    // Estimate steps based on distance
    const steps = Math.round(totalDistance * 1000 / TRACKING_CONFIG.STEP_LENGTH_METERS);
    
    // Calculate calories burned
    const calories = Math.round(totalDistance * TRACKING_CONFIG.CALORIES_PER_KM);
    
    // Calculate elevation gain
    let elevationGain = metrics.elevationGain;
    if (lastCoord.altitude !== undefined && lastCoord.altitude !== null && lastAltitudeRef.current !== null) {
      const altitudeDiff = lastCoord.altitude - lastAltitudeRef.current;
      if (altitudeDiff > 0) {
        elevationGain += altitudeDiff;
      }
    }
    
    if (lastCoord.altitude !== undefined && lastCoord.altitude !== null) {
      lastAltitudeRef.current = lastCoord.altitude;
    }
    
    const updatedMetrics = {
      totalDistance,
      currentSpeed,
      averageSpeed,
      calories,
      steps,
      duration: Math.round(duration),
      elevationGain,
    };
    
    setMetrics(updatedMetrics);
    
    // Call the callback function if provided
    if (onDataUpdate) {
      onDataUpdate(updatedMetrics, routeCoordinates);
    }
  };

  // Get current location
  const handleGetLocation = async () => {
    console.log(`${LOG_TAG} Get Location button pressed`);
    if (!permissionGranted) {
      console.log(`${LOG_TAG} Permission not granted, requesting...`);
      const granted = await requestLocationPermission();
      if (!granted) {
        console.log(`${LOG_TAG} User denied permission, exiting`);
        return;
      }
    }

    console.log(`${LOG_TAG} Getting current location...`);
    setLoading(true);

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, altitude, speed, accuracy } = position.coords;
        console.log(`${LOG_TAG} Position received: ${latitude}, ${longitude}, alt: ${altitude}, speed: ${speed}, accuracy: ${accuracy}`);
        
        const newLocation = {
          latitude,
          longitude,
          timestamp: position.timestamp,
          altitude,
          speed,
          accuracy
        };

        setLocation(newLocation);
        
        if (mapVisible && mapRef.current) {
          console.log(`${LOG_TAG} Animating map to new location`);
          mapRef.current.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }, 1000);
        }

        setLoading(false);
      },
      (error) => {
        console.error(`${LOG_TAG} Location Error:`, error);
        console.log(`${LOG_TAG} Error code: ${error.code}, message: ${error.message}`);

        Alert.alert(
          "Location Error",
          "Please check if GPS is enabled and permissions are granted.",
          [{ text: "OK" }]
        );

        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 5000,
        forceRequestLocation: true,
      }
    );
  };

  // Start tracking
  const startTracking = async () => {
    console.log(`${LOG_TAG} Start Tracking button pressed`);
    if (!permissionGranted) {
      console.log(`${LOG_TAG} Permission not granted, requesting...`);
      const granted = await requestLocationPermission();
      if (!granted) {
        console.log(`${LOG_TAG} User denied permission, exiting`);
        return;
      }
    }
    
    // If paused, just resume
    if (isPaused) {
      console.log(`${LOG_TAG} Resuming tracking from paused state`);
      setIsPaused(false);
      return;
    }

    // Clean up any existing tracking
    if (watchIdRef.current !== null) {
      console.log(`${LOG_TAG} Clearing previous watch ID: ${watchIdRef.current}`);
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    // Reset tracking data
    console.log(`${LOG_TAG} Resetting tracking data`);
    setRouteCoordinates([]);
    setMetrics({
      totalDistance: 0,
      currentSpeed: 0,
      averageSpeed: 0,
      calories: 0,
      steps: 0,
      duration: 0,
      elevationGain: 0,
    });
    
    startTimeRef.current = Date.now();
    lastAltitudeRef.current = null;
    setLoading(true);

    // Get initial position
    console.log(`${LOG_TAG} Getting initial position for tracking`);
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, altitude, speed, accuracy } = position.coords;
        console.log(`${LOG_TAG} Initial position: ${latitude}, ${longitude}, alt: ${altitude}, speed: ${speed}, accuracy: ${accuracy}`);
        
        const initialCoordinate = {
          latitude,
          longitude,
          timestamp: position.timestamp,
          altitude,
          speed,
          accuracy
        };
        
        setRouteCoordinates([initialCoordinate]);
        setLocation(initialCoordinate);
        lastAltitudeRef.current = altitude !== undefined ? altitude : null;

        // Start watching location
        console.log(`${LOG_TAG} Starting location watch`);
        watchIdRef.current = Geolocation.watchPosition(
          (position) => {
            if (isPaused) return;
            
            const { latitude, longitude, altitude, speed, accuracy } = position.coords;
            
            const newCoordinate = {
              latitude,
              longitude,
              timestamp: position.timestamp,
              altitude,
              speed,
              accuracy
            };
            
            setLocation(newCoordinate);
            setRouteCoordinates((prev) => [...prev, newCoordinate]);

            if (mapVisible && mapRef.current) {
              mapRef.current.animateToRegion({
                latitude,
                longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }, 1000);
            }
          },
          (error) => {
            console.error(`${LOG_TAG} Tracking Error:`, error);
            console.log(`${LOG_TAG} Error code: ${error.code}, message: ${error.message}`);
          },
          { 
            enableHighAccuracy: true, 
            distanceFilter: TRACKING_CONFIG.LOCATION_DISTANCE_FILTER, 
            interval: TRACKING_CONFIG.LOCATION_UPDATE_INTERVAL 
          }
        );

        console.log(`${LOG_TAG} Watch started with ID: ${watchIdRef.current}`);
        setIsTracking(true);
        setLoading(false);
      },
      (error) => {
        console.error(`${LOG_TAG} Tracking Start Error:`, error);
        console.log(`${LOG_TAG} Error code: ${error.code}, message: ${error.message}`);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 5000 }
    );
  };

  // Pause tracking
  const pauseTracking = () => {
    console.log(`${LOG_TAG} Pause Tracking button pressed`);
    setIsPaused(true);
  };

  // Stop tracking
  const stopTracking = () => {
    console.log(`${LOG_TAG} Stop Tracking button pressed`);
    
    if (watchIdRef.current !== null) {
      console.log(`${LOG_TAG} Clearing watch ID: ${watchIdRef.current}`);
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    
    setIsTracking(false);
    setIsPaused(false);
    
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }
    
    // Send final data to server
    syncDataWithServer(true);
  };

  // Start periodic data syncing with server
  const startDataSync = () => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }
    
    syncIntervalRef.current = setInterval(() => {
      syncDataWithServer();
    }, API_CONFIG.SYNC_INTERVAL);
    
    // Immediate first sync
    syncDataWithServer();
  };

  // Send data to .NET API
  const syncDataWithServer = async (isFinal = false) => {
    if (!isTracking || routeCoordinates.length === 0) {
      return;
    }
    
    console.log(`${LOG_TAG} [TEST MODE] Would sync data with server. Final sync: ${isFinal}`);
    console.log(`${LOG_TAG} [TEST MODE] Data:`, {
      userId,
      routePoints: routeCoordinates.length,
      metrics
    });
    
    // For testing - pretend we successfully synced
    return true;
  };

  // Format duration in seconds to MM:SS or HH:MM:SS
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${Math.floor(remainingSeconds).toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${Math.floor(remainingSeconds).toString().padStart(2, '0')}`;
    }
  };

  return (
    <View style={styles.container}>
      {/* Map view */}
      {mapVisible && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={defaultRegion}
          region={location ? {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          } : undefined}
        >
          {/* Add OpenStreetMap tile layer */}
          <UrlTile
            urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
          />
          {location && <Marker coordinate={location} />}
          {routeCoordinates.length > 1 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={4}
              strokeColor="#FF5722"
            />
          )}
        </MapView>
      )}

      {/* Stats display */}
      <View style={styles.statsContainer}>
        <View style={styles.statRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>{metrics.totalDistance.toFixed(2)} km</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Duration</Text>
            <Text style={styles.statValue}>{formatDuration(metrics.duration)}</Text>
          </View>
        </View>
        
        <View style={styles.statRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Speed</Text>
            <Text style={styles.statValue}>{metrics.currentSpeed.toFixed(1)} km/h</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Steps</Text>
            <Text style={styles.statValue}>{metrics.steps}</Text>
          </View>
        </View>
      </View>

      {/* Control buttons */}
      <View style={styles.buttonContainer}>
        {!isTracking ? (
          <>
            <TouchableOpacity onPress={handleGetLocation} style={styles.button}>
              <Text style={styles.buttonText}>Get Location</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={startTracking} style={[styles.button, styles.primaryButton]}>
              <Text style={styles.buttonText}>Start Tracking</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {isPaused ? (
              <TouchableOpacity onPress={startTracking} style={[styles.button, styles.resumeButton]}>
                <Text style={styles.buttonText}>Resume</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={pauseTracking} style={[styles.button, styles.pauseButton]}>
                <Text style={styles.buttonText}>Pause</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity onPress={stopTracking} style={[styles.button, styles.stopButton]}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {loading && <ActivityIndicator size="large" color="#FF5722" style={styles.loader} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  map: {
    height: Dimensions.get("window").height * 0.5,
    width: "100%",
  },
  statsContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statBox: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
  },
  pauseButton: {
    backgroundColor: "#FFC107",
  },
  resumeButton: {
    backgroundColor: "#4CAF50",
  },
  stopButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
});

export default GPSTracker;