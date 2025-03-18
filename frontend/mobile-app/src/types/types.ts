// types.ts
export interface Coordinate {
    latitude: number;
    longitude: number;
    timestamp?: number;
    altitude?: number | null;
    speed?: number | null;
    accuracy?: number | null;
  }
  
  export interface TrackingMetrics {
    totalDistance: number;
    currentSpeed: number;
    averageSpeed: number;
    calories: number;
    steps: number;
    duration: number;
    elevationGain: number;
  }

  export interface LocationData {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    speed: number | null; // in meters/second
    timestamp: number;
  }
  
  export interface TrackingStats {
    currentSpeed: number; // in km/h
    averageSpeed: number; // in km/h
    distance: number; // in meters
    duration: number; // in seconds
    currentAltitude: number; // in meters
    elevationGain: number; // in meters (positive)
    elevationLoss: number; // in meters (negative)
    terrainType: 'flat' | 'uphill' | 'downhill';
  }
  
  export interface Route {
    points: LocationData[];
  }