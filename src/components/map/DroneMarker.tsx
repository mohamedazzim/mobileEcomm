import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import { Colors, DroneColors } from '@constants/Colors';

interface DroneLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: 'available' | 'busy' | 'maintenance' | 'offline';
  pilot?: string;
  booking_id?: string;
}

interface DroneMarkerProps {
  drone: DroneLocation;
  onPress: () => void;
}

const DroneMarker: React.FC<DroneMarkerProps> = ({ drone, onPress }) => {
  const getStatusColor = (status: string) => {
    return DroneColors[status as keyof typeof DroneColors] || Colors.gray500;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return 'check-circle';
      case 'busy':
        return 'clock';
      case 'maintenance':
        return 'tool';
      case 'offline':
        return 'x-circle';
      default:
        return 'help-circle';
    }
  };

  const getDroneIcon = () => {
    return 'airplay';
  };

  return (
    <Marker
      coordinate={{
        latitude: drone.latitude,
        longitude: drone.longitude,
      }}
      onPress={onPress}
      tracksViewChanges={false}
    >
      <View style={styles.markerContainer}>
        {/* Drone Marker */}
        <View
          style={[
            styles.droneMarker,
            {
              backgroundColor: getStatusColor(drone.status),
              borderColor: Colors.white,
            },
          ]}
        >
          <Feather
            name={getDroneIcon()}
            size={16}
            color={Colors.white}
          />
        </View>
        
        {/* Status Indicator */}
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(drone.status) },
          ]}
        >
          <Feather
            name={getStatusIcon(drone.status)}
            size={8}
            color={Colors.white}
          />
        </View>
        
        {/* Pulse Animation for Active Drones */}
        {drone.status === 'busy' && (
          <View
            style={[
              styles.pulseCircle,
              { borderColor: getStatusColor(drone.status) },
            ]}
          />
        )}
        
        {/* Drone Name Label */}
        <View style={styles.nameLabel}>
          <Text style={styles.nameLabelText} numberOfLines={1}>
            {drone.name}
          </Text>
        </View>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  droneMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statusIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.white,
  },
  pulseCircle: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    opacity: 0.6,
  },
  nameLabel: {
    marginTop: 4,
    backgroundColor: Colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    maxWidth: 80,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  nameLabelText: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});

export default DroneMarker;
