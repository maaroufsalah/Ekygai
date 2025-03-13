/**
 * Enhanced calculation utilities for fitness tracking with OpenStreetMap
 */

/**
 * Calculates the distance between two geographical coordinates using the Haversine formula
 * with improved accuracy for OpenStreetMap coordinates
 * @param lat1 - Latitude of the first point in decimal degrees
 * @param lon1 - Longitude of the first point in decimal degrees
 * @param lat2 - Latitude of the second point in decimal degrees
 * @param lon2 - Longitude of the second point in decimal degrees
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  // Filter out invalid or zero coordinates
  if (
    !isFinite(lat1) || !isFinite(lon1) || 
    !isFinite(lat2) || !isFinite(lon2) ||
    (lat1 === 0 && lon1 === 0) || 
    (lat2 === 0 && lon2 === 0)
  ) {
    return 0;
  }

  const R: number = 6371; // Earth radius in km
  const dLat: number = (lat2 - lat1) * (Math.PI / 180);
  const dLon: number = (lon2 - lon1) * (Math.PI / 180);
  const a: number = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  
  // Apply jitter reduction - if distance is unreasonably small, likely GPS noise
  return distance < 0.001 ? 0 : distance;
};

/**
 * Calculates calories burned based on distance, speed, and weight
 * with enhanced MET values and accuracy
 * @param distance - Distance traveled in kilometers
 * @param speed - Current speed in m/s (will be converted to km/h)
 * @param weight - Athlete's weight in kilograms
 * @returns Calories burned
 */
export const calculateCalories = (
  distance: number, 
  speed: number, 
  weight: number
): number => {
  // Convert m/s to km/h for readability
  const speedKmh = speed * 3.6;
  
  // Enhanced MET values based on running/walking speed
  let MET: number;
  
  if (speedKmh < 4) { // Walking
    MET = 3.0 + (speedKmh / 4) * 1.0; // Variable MET for walking (3.0-4.0)
  } else if (speedKmh < 8) { // Jogging
    MET = 4.0 + ((speedKmh - 4) / 4) * 4.0; // Variable MET for jogging (4.0-8.0)
  } else if (speedKmh < 12) { // Running
    MET = 8.0 + ((speedKmh - 8) / 4) * 4.0; // Variable MET for running (8.0-12.0)
  } else if (speedKmh < 16) { // Fast running
    MET = 12.0 + ((speedKmh - 12) / 4) * 3.0; // Variable MET for fast running (12.0-15.0)
  } else { // Very fast running
    MET = 15.0 + Math.min(3, (speedKmh - 16) / 4); // Cap MET at 18 for very fast speeds
  }
  
  // Calories = MET * weight (kg) * time (hours)
  // Since we have distance and speed, time = distance / speed
  // We need to convert kilometers and km/h to hours
  
  // Safety check to avoid division by zero or tiny numbers that would inflate calories
  if (speedKmh < 0.1) return 0;
  
  const timeHours: number = distance / speedKmh;
  const calories: number = MET * weight * timeHours;
  
  return calories;
};

/**
 * Calculates the pace in minutes per kilometer with improved formatting
 * @param speed - Speed in kilometers per hour
 * @returns Pace as string in format "MM:SS" per kilometer
 */
export const calculatePace = (speed: number): string => {
  if (speed <= 0.1) return "--:--";
  
  // Convert km/h to min/km
  const paceInMinutes: number = 60 / speed;
  const minutes: number = Math.floor(paceInMinutes);
  const seconds: number = Math.floor((paceInMinutes - minutes) * 60);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Calculates the average speed from total distance and time
 * with improved accuracy for low speeds
 * @param totalDistance - Total distance in kilometers
 * @param totalTime - Total time in seconds
 * @returns Average speed in kilometers per hour
 */
export const calculateAverageSpeed = (
  totalDistance: number, 
  totalTime: number
): number => {
  if (totalTime <= 10 || totalDistance < 0.01) return 0;
  // Convert seconds to hours and calculate
  return (totalDistance / (totalTime / 3600));
};

/**
 * Interface for point data with elevation
 */
interface ElevationPoint {
  altitude: number;
  timestamp: number;
}

/**
 * Calculates elevation gain/loss between points with noise filtering
 * @param points - Array of points with altitude data
 * @returns Object containing total elevation gain and loss in meters
 */
export const calculateElevation = (points: ElevationPoint[]): { gain: number; loss: number } => {
  let gain: number = 0;
  let loss: number = 0;
  
  if (points.length < 2) return { gain, loss };
  
  // Filter out invalid altitude values
  const validPoints = points.filter(point => 
    typeof point.altitude === 'number' && 
    isFinite(point.altitude) && 
    point.altitude !== null
  );
  
  if (validPoints.length < 2) return { gain, loss };
  
  // Apply a simple rolling average to reduce noise
  const smoothedPoints = validPoints.map((point, index, array) => {
    if (index === 0 || index === array.length - 1) return point;
    
    const prevAlt = array[index - 1].altitude;
    const currAlt = point.altitude;
    const nextAlt = array[index + 1].altitude;
    
    return {
      ...point,
      altitude: (prevAlt + currAlt + nextAlt) / 3
    };
  });
  
  // Calculate elevation changes with threshold filter
  const ELEVATION_THRESHOLD = 0.5; // Ignore changes less than 0.5m (likely noise)
  
  for (let i = 1; i < smoothedPoints.length; i++) {
    const elevationDiff: number = smoothedPoints[i].altitude - smoothedPoints[i-1].altitude;
    
    if (elevationDiff > ELEVATION_THRESHOLD) {
      gain += elevationDiff;
    } else if (elevationDiff < -ELEVATION_THRESHOLD) {
      loss += Math.abs(elevationDiff);
    }
  }
  
  return { gain, loss };
};

/**
 * Determines if location accuracy is from GPS or network (AGPS) source
 * @param accuracy - Accuracy in meters from geolocation API
 * @returns Source type string ('gps' or 'network')
 */
export const determineLocationSource = (accuracy: number | undefined): 'gps' | 'network' => {
  if (!accuracy) return 'network';
  
  // GPS typically provides better accuracy than network
  // These thresholds are based on typical device performance
  if (accuracy <= 20) return 'gps';
  return 'network';
};

/**
 * Calculates estimated fitness level based on pace and heart rate (if available)
 * @param averageSpeed - Average speed in km/h */