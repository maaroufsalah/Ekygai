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