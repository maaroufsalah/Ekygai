import { PermissionsAndroid, Platform, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { TrackingStats, Route } from '../types/types';

// Define the LocationData interface here to ensure type consistency
export interface LocationData {
  latitude: number;
  longitude: number;
  altitude: number;
  accuracy: number;
  speed: number;
  timestamp: number;
}

class GpsTrackingService {
  private isTracking: boolean = false;
  private watchId: number | null = null;
  private route: Route = { points: [] };
  private stats: TrackingStats = {
    currentSpeed: 0,
    averageSpeed: 0,
    distance: 0,
    duration: 0,
    currentAltitude: 0,
    elevationGain: 0,
    elevationLoss: 0,
    terrainType: 'flat',
  };
  private startTime: number | null = null;
  private updateCallback: ((stats: TrackingStats, route: Route) => void) | null = null;
  private lastLocation: LocationData | null = null;
  private locationUpdateInterval: number = 1000; // milliseconds

  // Request location permissions with improved error handling
  async requestLocationPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        const granted = await Geolocation.requestAuthorization('whenInUse');
        return granted === 'granted';
      }
      
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location to track your activities.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          
          // Try to request background location permission (Android 10+)
          if (Platform.Version >= 29) {
            try {
              await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
                {
                  title: 'Background Location Permission',
                  message: 'We need access to your location in the background to continue tracking when the app is minimized.',
                  buttonNeutral: 'Ask Me Later',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'OK',
                }
              );
            } catch (err) {
              console.log('Background location permission request failed or not supported');
            }
          }
          
          // Return true only if foreground location is granted
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.error('Error requesting location permission:', err);
          return false;
        }
      }
    } catch (err) {
      console.error('Error in requestLocationPermission:', err);
    }
    
    return false;
  }

  // Get the current position once
  getCurrentPosition(callback: (position: Geolocation.GeoPosition | null) => void): void {
    Geolocation.getCurrentPosition(
      (position) => {
        callback(position);
      },
      (error) => {
        console.error('Error getting current position:', error);
        callback(null);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 10000 
      }
    );
  }

  // Start tracking location with improved error handling
  async startTracking(callback: (stats: TrackingStats, route: Route) => void): Promise<boolean> {
    try {
      if (this.isTracking) return true;
      
      const permissionGranted = await this.requestLocationPermission();
      if (!permissionGranted) return false;
      
      this.isTracking = true;
      this.startTime = Date.now();
      this.route.points = [];
      this.resetStats();
      this.updateCallback = callback;
      
      // First, get the current position to initialize tracking
      this.getCurrentPosition((position) => {
        if (position) {
          const initialLocation: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude !== null ? position.coords.altitude : 0,
            accuracy: position.coords.accuracy !== null ? position.coords.accuracy : 0,
            speed: position.coords.speed !== null ? position.coords.speed : 0,
            timestamp: position.timestamp,
          };
          
          this.lastLocation = initialLocation;
          this.route.points.push(initialLocation);
          
          // Now start watching position
          this.watchId = Geolocation.watchPosition(
            this.handleLocationUpdate,
            this.handleLocationError,
            {
              enableHighAccuracy: true,
              distanceFilter: 2, // update every 2 meters
              interval: this.locationUpdateInterval, // update every second (Android)
              fastestInterval: 500, // fastest update interval (Android)
              forceRequestLocation: true, // Forces location request (Android)
            }
          );
          
          // Notify callback with initial location
          if (this.updateCallback) {
            this.updateCallback(this.stats, this.route);
          }
        } else {
          // Handle case where current position couldn't be obtained
          this.isTracking = false;
          Alert.alert(
            'Location Error',
            'Could not get your current location. Please ensure location services are enabled.'
          );
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error starting tracking:', error);
      this.isTracking = false;
      return false;
    }
  }

  // Stop tracking location with cleanup
  stopTracking(): void {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isTracking = false;
    this.startTime = null;
    this.updateCallback = null;
    this.lastLocation = null;
  }

  // Get current tracking status
  isCurrentlyTracking(): boolean {
    return this.isTracking;
  }

  // Get current route
  getCurrentRoute(): Route {
    return this.route;
  }

  // Get current stats
  getCurrentStats(): TrackingStats {
    return this.stats;
  }

  // Reset stats
  private resetStats(): void {
    this.stats = {
      currentSpeed: 0,
      averageSpeed: 0,
      distance: 0,
      duration: 0,
      currentAltitude: 0,
      elevationGain: 0,
      elevationLoss: 0,
      terrainType: 'flat',
    };
  }

  // Handle location updates with improved filtering
  private handleLocationUpdate = (position: Geolocation.GeoPosition): void => {
    // Validate position data to avoid errors
    if (!position || !position.coords) {
      console.warn('Invalid position data received');
      return;
    }
    
    const newLocation: LocationData = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      altitude: position.coords.altitude !== null ? position.coords.altitude : 0,
      accuracy: position.coords.accuracy !== null ? position.coords.accuracy : 0,
      speed: position.coords.speed !== null ? position.coords.speed : 0,
      timestamp: position.timestamp,
    };

    // Apply some basic filtering to avoid jumps in position
    if (this.lastLocation && newLocation.accuracy > 30) {
      // If accuracy is poor, skip this update
      console.log('Skipping low accuracy location update:', newLocation.accuracy);
      return;
    }

    // Calculate speed if not provided or suspect
    if (this.lastLocation && newLocation.speed === 0) {
      const timeDiff = (newLocation.timestamp - this.lastLocation.timestamp) / 1000; // seconds
      if (timeDiff > 0) {
        const distance = this.calculateDistance(
          this.lastLocation.latitude,
          this.lastLocation.longitude,
          newLocation.latitude,
          newLocation.longitude
        );
        newLocation.speed = distance / timeDiff; // m/s
      }
    }

    // Add the new location to the route
    this.route.points.push(newLocation);
    this.lastLocation = newLocation;
    
    // Update statistics
    this.updateStats(newLocation);
    
    // Notify the callback
    if (this.updateCallback) {
      this.updateCallback(this.stats, this.route);
    }
  }

  // Handle location errors with improved messaging
  private handleLocationError = (error: Geolocation.GeoError): void => {
    console.error('Location error:', error);
    
    let errorMessage = 'An unknown error occurred with location services.';
    
    // Provide more specific error messages based on error code
    switch (error.code) {
      case 1:
        errorMessage = 'Location permission denied. Please enable location permissions for this app.';
        break;
      case 2:
        errorMessage = 'Location unavailable. Please check if your device\'s location services are enabled.';
        break;
      case 3:
        errorMessage = 'Location request timed out. Please try again.';
        break;
    }
    
    // Only show alert if tracking is active
    if (this.isTracking) {
      Alert.alert('Location Error', errorMessage);
    }
  }

  // Update statistics based on new location with improved calculations
  private updateStats(newLocation: LocationData): void {
    // Calculate duration
    if (this.startTime !== null) {
      this.stats.duration = (Date.now() - this.startTime) / 1000;
    }

    // Update current altitude
    this.stats.currentAltitude = newLocation.altitude;

    // Calculate current speed (convert from m/s to km/h)
    // Apply some smoothing by using a weighted average with previous speed
    const newSpeedKmh = newLocation.speed * 3.6;
    this.stats.currentSpeed = this.stats.currentSpeed === 0 
      ? newSpeedKmh 
      : this.stats.currentSpeed * 0.7 + newSpeedKmh * 0.3; // Weighted average

    // Calculate distance and determine terrain type
    if (this.route.points.length > 1) {
      const prevLocation = this.route.points[this.route.points.length - 2];
      const distance = this.calculateDistance(
        prevLocation.latitude,
        prevLocation.longitude,
        newLocation.latitude,
        newLocation.longitude
      );
      
      // Only add to total distance if it's a reasonable value
      if (distance < 50) { // Ignore jumps greater than 50m
        this.stats.distance += distance;
      }
      
      // Calculate average speed
      if (this.stats.duration > 0) {
        this.stats.averageSpeed = (this.stats.distance / 1000) / (this.stats.duration / 3600);
      }
      
      // Calculate elevation change and determine terrain type
      const elevationChange = newLocation.altitude - prevLocation.altitude!;
      
      // Update elevation gain/loss
      if (elevationChange > 0) {
        this.stats.elevationGain += elevationChange;
      } else if (elevationChange < 0) {
        this.stats.elevationLoss += Math.abs(elevationChange);
      }
      
      // Determine terrain type based on recent elevation changes
      this.updateTerrainType();
    }
  }

  // Update terrain type based on recent elevation changes
  private updateTerrainType(): void {
    // Use the last 5 points (or all points if less than 5) to determine terrain
    const pointsToConsider = Math.min(5, this.route.points.length);
    if (pointsToConsider < 3) return; // Need at least 3 points for a meaningful calculation
    
    const recentPoints = this.route.points.slice(-pointsToConsider);
    let totalDistance = 0;
    let totalElevationChange = 0;
    
    for (let i = 1; i < recentPoints.length; i++) {
      const prevPoint = recentPoints[i-1];
      const currPoint = recentPoints[i];
      
      const segmentDistance = this.calculateDistance(
        prevPoint.latitude,
        prevPoint.longitude,
        currPoint.latitude,
        currPoint.longitude
      );
      
      totalDistance += segmentDistance;
      totalElevationChange += (currPoint.altitude! - prevPoint.altitude!);
    }
    
    if (totalDistance > 0) {
      const grade = (totalElevationChange / totalDistance) * 100; // Grade as percentage
      
      if (grade > 3) {
        this.stats.terrainType = 'uphill';
      } else if (grade < -3) {
        this.stats.terrainType = 'downhill';
      } else {
        this.stats.terrainType = 'flat';
      }
    }
  }

  // Calculate distance between two coordinates (Haversine formula)
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth radius in meters
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Convert degrees to radians
  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export default new GpsTrackingService();