import { Platform, PermissionsAndroid, Alert } from 'react-native';

/**
 * Requests location permission from the user
 * @returns Promise<boolean> True if permission is granted, false otherwise
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    // For iOS, we'll use Geolocation.requestAuthorization() in the component
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message:
          "This app needs access to your location " +
          "to track your activities.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Location permission granted");
      return true;
    } else {
      console.log("Location permission denied");
      Alert.alert(
        "Permission Required",
        "Location permission is required for tracking. Please enable it in your device settings.",
        [{ text: "OK" }]
      );
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};