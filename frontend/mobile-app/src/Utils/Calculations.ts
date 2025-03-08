/**
 * Calculates the distance between two geographical coordinates using the Haversine formula
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
    const R: number = 6371; // Earth radius in km
    const dLat: number = (lat2 - lat1) * (Math.PI / 180);
    const dLon: number = (lon2 - lon1) * (Math.PI / 180);
    const a: number = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };
  
  /**
   * Calculates calories burned based on distance, speed, and weight
   * @param distance - Distance traveled in kilometers
   * @param speed - Current speed in km/h
   * @param weight - Athlete's weight in kilograms
   * @returns Calories burned
   */
  export const calculateCalories = (
    distance: number, 
    speed: number, 
    weight: number
  ): number => {
    // MET values based on running speed
    // Walking: ~3-4 METs, Jogging: ~7-8 METs, Running: ~10-12+ METs
    let MET: number;
    
    if (speed < 4) { // Walking
      MET = 3.5;
    } else if (speed < 8) { // Jogging
      MET = 8;
    } else if (speed < 12) { // Running
      MET = 11.5;
    } else { // Fast running
      MET = 14;
    }
    
    // Calories = MET * weight (kg) * time (hours)
    // Since we have distance and speed, time = distance / speed
    const timeHours: number = distance / Math.max(speed, 1) * 1000; // Avoid division by zero
    const calories: number = MET * weight * timeHours;
    
    return calories;
  };
  
  /**
   * Calculates the pace in minutes per kilometer
   * @param speed - Speed in kilometers per hour
   * @returns Pace as string in format "MM:SS" per kilometer
   */
  export const calculatePace = (speed: number): string => {
    if (speed <= 0) return "--:--";
    
    // Convert km/h to min/km
    const paceInMinutes: number = 60 / speed;
    const minutes: number = Math.floor(paceInMinutes);
    const seconds: number = Math.floor((paceInMinutes - minutes) * 60);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  /**
   * Calculates the average speed from total distance and time
   * @param totalDistance - Total distance in kilometers
   * @param totalTime - Total time in seconds
   * @returns Average speed in kilometers per hour
   */
  export const calculateAverageSpeed = (
    totalDistance: number, 
    totalTime: number
  ): number => {
    if (totalTime <= 0) return 0;
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
   * Calculates elevation gain/loss between points
   * @param points - Array of points with altitude data
   * @returns Object containing total elevation gain and loss in meters
   */
  export const calculateElevation = (points: ElevationPoint[]): { gain: number; loss: number } => {
    let gain: number = 0;
    let loss: number = 0;
    
    for (let i = 1; i < points.length; i++) {
      const elevationDiff: number = points[i].altitude - points[i-1].altitude;
      
      if (elevationDiff > 0) {
        gain += elevationDiff;
      } else {
        loss += Math.abs(elevationDiff);
      }
    }
    
    return { gain, loss };
  };