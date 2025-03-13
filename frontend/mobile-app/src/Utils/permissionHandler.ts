import { PermissionsAndroid, Platform } from 'react-native';

/**
 * Request location permissions for Android
 * @returns Promise resolving to boolean indicating if permissions were granted
 */
export const requestLocationPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const grants = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]);

      if (
        grants[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED &&
        grants[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Location permissions granted');
        return true;
      } else {
        console.log('Location permissions denied');
        return false;
      }
    } catch (err) {
      console.warn('Error requesting location permissions:', err);
      return false;
    }
  } else if (Platform.OS === 'ios') {
    // For iOS, you would typically use Geolocation.requestAuthorization()
    // This is a simplified example
    return true;
  }
  
  return false;
};

/**
 * Check if location permissions are already granted
 * @returns Promise resolving to boolean indicating if permissions are granted
 */
export const checkLocationPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const fineLocation = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      const coarseLocation = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      );

      return fineLocation && coarseLocation;
    } catch (err) {
      console.warn('Error checking location permissions:', err);
      return false;
    }
  } else if (Platform.OS === 'ios') {
    // For iOS, implement checking Geolocation permissions
    return true;
  }
  
  return false;
};