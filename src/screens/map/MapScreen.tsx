import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';

import { Colors } from '@constants/Colors';
import { useBookingStore } from '@store/bookingStore';
import { useUIStore } from '@store/uiStore';
import { useWebSocket } from '@hooks/useWebSocket';
import Header from '@components/common/Header';
import Card from '@components/common/Card';
import DroneMarker from '@components/map/DroneMarker';
import LoadingSpinner from '@components/common/LoadingSpinner';

const { width, height } = Dimensions.get('window');

interface DroneLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: 'available' | 'busy' | 'maintenance' | 'offline';
  pilot?: string;
  booking_id?: string;
}

interface MapScreenProps {
  navigation: any;
}

const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [droneLocations, setDroneLocations] = useState<DroneLocation[]>([]);
  const [selectedDrone, setSelectedDrone] = useState<DroneLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [region, setRegion] = useState<Region>({
    latitude: 28.6139, // Delhi coordinates as default
    longitude: 77.2090,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const mapRef = useRef<MapView>(null);
  const { setActiveScreen, showToast } = useUIStore();
  const { bookings } = useBookingStore();
  const { isConnected, subscribe, unsubscribe } = useWebSocket();

  useEffect(() => {
    setActiveScreen('Map');
    requestLocationPermission();
    loadDroneLocations();
    
    // Subscribe to real-time drone updates
    if (isConnected) {
      subscribe('drone_status', handleDroneStatusUpdate);
    }

    return () => {
      unsubscribe('drone_status', handleDroneStatusUpdate);
    };
  }, [isConnected]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        showToast('Location permission is required to show your position', 'warning');
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserLocation(location);
      
      // Update map region to user's location
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      
      setRegion(newRegion);
      setIsLoading(false);
    } catch (error) {
      console.error('Error getting location:', error);
      showToast('Failed to get your location', 'error');
      setIsLoading(false);
    }
  };

  const loadDroneLocations = () => {
    // Mock drone locations - In a real app, this would come from your API
    const mockDrones: DroneLocation[] = [
      {
        id: '1',
        name: 'Drone Alpha',
        latitude: 28.6129,
        longitude: 77.2295,
        status: 'available',
      },
      {
        id: '2',
        name: 'Drone Beta',
        latitude: 28.6219,
        longitude: 77.2085,
        status: 'busy',
        pilot: 'John Doe',
        booking_id: 'B123',
      },
      {
        id: '3',
        name: 'Drone Gamma',
        latitude: 28.6089,
        longitude: 77.2285,
        status: 'maintenance',
      },
      {
        id: '4',
        name: 'Drone Delta',
        latitude: 28.6339,
        longitude: 77.2195,
        status: 'available',
      },
      {
        id: '5',
        name: 'Drone Epsilon',
        latitude: 28.5989,
        longitude: 77.1985,
        status: 'offline',
      },
    ];

    setDroneLocations(mockDrones);
  };

  const handleDroneStatusUpdate = (data: any) => {
    // Handle real-time drone status updates
    setDroneLocations(prevDrones => 
      prevDrones.map(drone => 
        drone.id === data.drone_id 
          ? { ...drone, ...data }
          : drone
      )
    );
  };

  const handleDronePress = (drone: DroneLocation) => {
    setSelectedDrone(drone);
    
    // Animate to drone location
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: drone.latitude,
        longitude: drone.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const handleMyLocationPress = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } else {
      requestLocationPermission();
    }
  };

  const handleBookDrone = (drone: DroneLocation) => {
    if (drone.status !== 'available') {
      showToast('This drone is not available for booking', 'warning');
      return;
    }

    // Navigate to booking screen with pre-filled drone type
    navigation.navigate('Book', { 
      preselectedDrone: drone.name,
      preselectedLocation: {
        latitude: drone.latitude,
        longitude: drone.longitude,
      }
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'busy':
        return 'In Service';
      case 'maintenance':
        return 'Maintenance';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return Colors.success;
      case 'busy':
        return Colors.warning;
      case 'maintenance':
        return Colors.error;
      case 'offline':
        return Colors.gray500;
      default:
        return Colors.gray500;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Live Map" />
      
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation={!!userLocation}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
        >
          {/* User Location Marker */}
          {userLocation && (
            <Marker
              coordinate={{
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
              }}
              title="Your Location"
              description="You are here"
            >
              <View style={styles.userMarker}>
                <View style={styles.userMarkerInner} />
              </View>
            </Marker>
          )}

          {/* Drone Markers */}
          {droneLocations.map((drone) => (
            <DroneMarker
              key={drone.id}
              drone={drone}
              onPress={() => handleDronePress(drone)}
            />
          ))}

          {/* Active Booking Locations */}
          {bookings
            .filter(booking => booking.status === 'in_progress')
            .map((booking) => (
              <Marker
                key={`booking-${booking.id}`}
                coordinate={{
                  latitude: booking.latitude,
                  longitude: booking.longitude,
                }}
                title="Active Booking"
                description={booking.service_type}
                pinColor={Colors.primary}
              />
            ))}
        </MapView>

        {/* My Location Button */}
        <TouchableOpacity 
          style={styles.myLocationButton}
          onPress={handleMyLocationPress}
        >
          <Feather name="navigation" size={20} color={Colors.primary} />
        </TouchableOpacity>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Legend</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.warning }]} />
              <Text style={styles.legendText}>In Service</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.error }]} />
              <Text style={styles.legendText}>Maintenance</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.gray500 }]} />
              <Text style={styles.legendText}>Offline</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Selected Drone Info */}
      {selectedDrone && (
        <Card style={styles.droneInfoCard}>
          <View style={styles.droneInfoHeader}>
            <View style={styles.droneInfoMain}>
              <Text style={styles.droneName}>{selectedDrone.name}</Text>
              <View style={styles.droneStatus}>
                <View 
                  style={[
                    styles.statusDot, 
                    { backgroundColor: getStatusColor(selectedDrone.status) }
                  ]} 
                />
                <Text style={styles.statusText}>
                  {getStatusText(selectedDrone.status)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedDrone(null)}
            >
              <Feather name="x" size={20} color={Colors.gray400} />
            </TouchableOpacity>
          </View>

          {selectedDrone.pilot && (
            <View style={styles.droneInfoRow}>
              <Feather name="user" size={16} color={Colors.textSecondary} />
              <Text style={styles.droneInfoText}>Pilot: {selectedDrone.pilot}</Text>
            </View>
          )}

          {selectedDrone.booking_id && (
            <View style={styles.droneInfoRow}>
              <Feather name="calendar" size={16} color={Colors.textSecondary} />
              <Text style={styles.droneInfoText}>
                Booking: #{selectedDrone.booking_id}
              </Text>
            </View>
          )}

          {selectedDrone.status === 'available' && (
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => handleBookDrone(selectedDrone)}
            >
              <Text style={styles.bookButtonText}>Book This Drone</Text>
            </TouchableOpacity>
          )}
        </Card>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: width,
    height: '100%',
  },
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  userMarkerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  myLocationButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  legend: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 8,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  legendItems: {
    gap: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  droneInfoCard: {
    margin: 20,
    marginBottom: 32,
  },
  droneInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  droneInfoMain: {
    flex: 1,
  },
  droneName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  droneStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  closeButton: {
    padding: 4,
  },
  droneInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  droneInfoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  bookButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
  },
  bookButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default MapScreen;
