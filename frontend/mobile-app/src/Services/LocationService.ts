import { useState, useEffect } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import Geolocation, { GeoPosition, GeoError } from 'react-native-geolocation-service';

// Define the return type for our hook
export interface LocationState {
  location: GeoPosition | null;
  error: string | null;
  loading: boolean;
  getLocation: () => Promise<GeoPosition | null>;
}

// Function to request location permission
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'ios') {
      const status = await Geolocation.requestAuthorization('whenInUse');
      return status === 'granted';
    }
    
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to function properly.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return false;
  } catch (err) {
    console.error('Error requesting location permission:', err);
    return false;
  }
};

// Options interface for getCurrentPosition
export interface LocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  distanceFilter?: number;
  forceRequestLocation?: boolean;
}

// Function to get current position with better error handling
export const getCurrentPosition = (options: LocationOptions = {}): Promise<GeoPosition> => {
  return new Promise(async (resolve, reject) => {
    try {
      const hasPermission = await requestLocationPermission();
      
      if (!hasPermission) {
        reject(new Error('Location permission not granted'));
        return;
      }
      
      // Default options
      const locationOptions = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        ...options
      };
      
      // Set a timeout to catch cases where the native module might hang
      const timeoutId = setTimeout(() => {
        reject(new Error('Location request timed out'));
      }, locationOptions.timeout + 5000);
      
      Geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          resolve(position);
        },
        (error: GeoError) => {
          clearTimeout(timeoutId);
          console.warn('Geolocation error:', error);
          
          // Provide more user-friendly error messages
          switch (error.code) {
            case 1:
              reject(new Error('Location permission denied'));
              break;
            case 2:
              reject(new Error('Location unavailable'));
              break;
            case 3:
              reject(new Error('Location request timed out'));
              break;
            default:
              reject(error);
          }
        },
        locationOptions
      );
    } catch (error) {
      console.error('Unexpected error getting location:', error);
      reject(error instanceof Error ? error : new Error('Unknown error'));
    }
  });
};

// React hook for location
export const useCurrentLocation = (options: LocationOptions = {}): LocationState => {
  const [location, setLocation] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getLocation = async (): Promise<GeoPosition | null> => {
    try {
      setLoading(true);
      setError(null);
      const position = await getCurrentPosition(options);
      setLocation(position);
      return position;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return { location, error, loading, getLocation };
};

// Watch position hook
export const useWatchPosition = (options: LocationOptions = {}): LocationState & { stopWatching: () => void } => {
  const [location, setLocation] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [watchId, setWatchId] = useState<number | null>(null);

  const startWatching = async (): Promise<void> => {
    try {
      const hasPermission = await requestLocationPermission();
      
      if (!hasPermission) {
        setError('Location permission not granted');
        setLoading(false);
        return;
      }
      
      const id = Geolocation.watchPosition(
        (position) => {
          setLocation(position);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.warn('Watch position error:', err);
          setError(err.message || 'Failed to get location updates');
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
          interval: 5000,
          fastestInterval: 2000,
          ...options
        }
      );
      
      setWatchId(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const stopWatching = (): void => {
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  const getLocation = async (): Promise<GeoPosition | null> => {
    try {
      setLoading(true);
      setError(null);
      const position = await getCurrentPosition(options);
      setLocation(position);
      return position;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startWatching();
    return () => stopWatching();
  }, []);

  return { location, error, loading, getLocation, stopWatching };
};