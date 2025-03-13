import { PermissionsAndroid, Platform, Alert } from 'react-native';

export const requestLocationPermission = async (): Promise<boolean> => {
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
        console.log('[Permissions] Location permissions granted');
        return true;
      } else {
        console.log('[Permissions] Location permissions denied');
        Alert.alert(
          'Location Permission Required',
          'This app needs location permission to show your position on the map. Please grant location permission in app settings.',
          [
            { 
              text: 'OK', 
              onPress: () => console.log('OK Pressed')
            }
          ]
        );
        return false;
      }
    } catch (err) {
      console.warn('[Permissions] Error requesting location permissions:', err);
      return false;
    }
  } else if (Platform.OS === 'ios') {
    // For iOS, Geolocation.requestAuthorization() is handled by the Geolocation module
    return true;
  }
  
  return false;
};

export const checkLocationPermission = async (): Promise<boolean> => {
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
      console.warn('[Permissions] Error checking location permissions:', err);
      return false;
    }
  } else if (Platform.OS === 'ios') {
    // For iOS, we assume permissions are handled by the Geolocation module
    return true;
  }
  
  return false;
};