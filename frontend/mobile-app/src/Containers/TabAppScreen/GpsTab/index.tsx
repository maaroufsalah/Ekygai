import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Alert, Platform } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { Text } from "../../../Theme/Theme";
import STRINGS from "../../../Utils/Constants/String";
import { styles } from "./styles";
import AFSafeAreView from "../../../Components/AFSafeAreaView";
import AFBottomSafeAreView from "../../../Components/AFBottomSafeAreaView";
import AFTabBarVIew from "../../../Components/AFTabBarView";
import { calculateDistance, calculateCalories } from '../../../Utils/Calculations';
import { requestLocationPermission } from '../../../Utils/Permissions';
import Geolocation from '@react-native-community/geolocation';

const GpsTab = () => {
  const [isCounting, setIsCounting] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<RouteCoordinate[]>([]);
  const [kilometers, setKilometers] = useState(0);
  const [calories, setCalories] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [elevationGain, setElevationGain] = useState(0);
  
  const mapRef = useRef<MapView | null>(null);
  const watchId = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Athlete profile (would come from user settings)
  const athleteProfile = {
    weight: 70, // kg
    height: 175, // cm
    age: 30,
    gender: 'male'
  };

  interface RouteCoordinate {
    latitude: number;
    longitude: number;
    altitude: number | null;
    timestamp: number;
  }

  useEffect(() => {
    // Get initial location
    requestLocationPermission().then(granted => {
      if (granted) {
        Geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ latitude, longitude });
          },
          error => {
            console.log(error.code, error.message);
            Alert.alert('Error', 'Unable to get location');
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    });
    
    return () => {
      if (watchId.current) {
        Geolocation.clearWatch(watchId.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (isCounting) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (!isCounting && watchId.current) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isCounting]);

  // Start/stop tracking
  const _startPress = () => {
    if (!isCounting) {
      // Start tracking
      requestLocationPermission().then(granted => {
        if (granted) {
          setRouteCoordinates([]);
          setKilometers(0);
          setCalories(0);
          setElapsedTime(0);
          
          watchId.current = Geolocation.watchPosition(
            position => {
              const { latitude, longitude, altitude, speed } = position.coords;
              const newCoordinate = { latitude, longitude, altitude, timestamp: position.timestamp };
              
              setCurrentLocation({ latitude, longitude });
              setRouteCoordinates(prevCoordinates => {
                const updatedCoordinates = [...prevCoordinates, newCoordinate];
                
                // Calculate new distance
                if (prevCoordinates.length > 0) {
                  const lastCoord = prevCoordinates[prevCoordinates.length - 1];
                  const incrementalDistance = calculateDistance(
                    lastCoord.latitude, 
                    lastCoord.longitude, 
                    latitude, 
                    longitude
                  );
                  
                  // Update distance
                  setKilometers(prev => prev + incrementalDistance);
                  
                  // Update calories based on weight, distance, and speed
                  const caloriesBurned = calculateCalories(
                    incrementalDistance, 
                    speed!, 
                    athleteProfile.weight
                  );
                  setCalories(prev => prev + caloriesBurned);
                  
                  // Update current speed (convert from m/s to km/h)
                  setCurrentSpeed(Number(speed) * 3.6);
                  
                  // Calculate elevation gain if altitude available
                  if (altitude && lastCoord.altitude) {
                    const elevationChange = altitude - lastCoord.altitude;
                    if (elevationChange > 0) {
                      setElevationGain(prev => prev + elevationChange);
                    }
                  }
                }
                
                // Calculate average speed
                if (elapsedTime > 0) {
                  setAverageSpeed(Number((kilometers / (elapsedTime / 3600)).toFixed(2)));
                }
                
                return updatedCoordinates;
              });
              
              // Center map on current location
              mapRef.current?.animateToRegion({
                latitude,
                longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
              });
            },
            error => {
              console.log(error.code, error.message);
              Alert.alert('Error', 'Location tracking failed');
              setIsCounting(false);
            },
            { 
              enableHighAccuracy: true, 
              distanceFilter: 10, // minimum distance in meters
              interval: 2000, // Android only
              fastestInterval: 1000, // Android only
            }
          );
        }
      });
    } else {
      // Stop tracking
      if (watchId.current) {
        Geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    }
    setIsCounting(prev => !prev);
  };

  const formatTime = (seconds: any) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <AFSafeAreView />
      <View style={styles.titleView}>
        <Text variant="inter_SemiBold_17" color="Rich_Black" textAlign="center">
          {STRINGS.location.title}
        </Text>
      </View>

      <View style={styles.container}>
        {currentLocation ? (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            showsUserLocation
            followsUserLocation
          >
            {routeCoordinates.length > 0 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeWidth={4}
                strokeColor="#1E88E5"
              />
            )}
          </MapView>
        ) : (
          <View style={[styles.map, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text variant="inter_Medium_15" color="Rich_Black">Loading map...</Text>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.roundView, isCounting ? { backgroundColor: '#E53935' } : {}]} 
          onPress={_startPress}
        >
          <Text variant="inter_Medium_15" color="white" textAlign="center" style={styles.countTitleText}>
            {isCounting ? formatTime(elapsedTime) : STRINGS.location.start}
          </Text>
        </TouchableOpacity>

        <View style={styles.flexPositionView}>
          <View style={styles.blackBox}>
            <Text
              variant="inter_Medium_15"
              color="lime_green"
              textAlign="center"
              style={styles.countTitleText}
            >
              {STRINGS.location.kilometer}
            </Text>
            <Text
              variant="inter_SemiBold_17"
              color="lime_green"
              textAlign="center"
              style={styles.countText}
            >
              {kilometers.toFixed(2)}
            </Text>
          </View>

          <View style={styles.blackBox}>
            <Text
              variant="inter_Medium_15"
              color="lime_green"
              textAlign="center"
              style={styles.countTitleText}
            >
              {STRINGS.location.calorie}
            </Text>
            <Text
              variant="inter_SemiBold_17"
              color="lime_green"
              textAlign="center"
              style={styles.countText}
            >
              {calories.toFixed(0)}
            </Text>
          </View>
        </View>
      </View>
      <AFTabBarVIew />
      <AFBottomSafeAreView />
    </>
  );
};

export default GpsTab;