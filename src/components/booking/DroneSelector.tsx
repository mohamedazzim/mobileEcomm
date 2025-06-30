import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@constants/Colors';
import { DroneType } from '@types/index';
import Card from '@components/common/Card';

interface DroneSelectorProps {
  droneTypes: DroneType[];
  selectedDrone?: string;
  onSelect: (droneType: string) => void;
  error?: string;
}

const DroneSelector: React.FC<DroneSelectorProps> = ({
  droneTypes,
  selectedDrone,
  onSelect,
  error,
}) => {
  const getDroneIcon = (name: string) => {
    if (name.toLowerCase().includes('professional') || name.toLowerCase().includes('pro')) {
      return 'airplay';
    } else if (name.toLowerCase().includes('basic') || name.toLowerCase().includes('standard')) {
      return 'smartphone';
    } else if (name.toLowerCase().includes('enterprise') || name.toLowerCase().includes('commercial')) {
      return 'monitor';
    }
    return 'airplay';
  };

  const getSpecsDisplay = (drone: DroneType) => {
    return [
      { icon: 'clock', label: 'Flight Time', value: `${drone.max_flight_time} min` },
      { icon: 'radio', label: 'Range', value: `${drone.max_range} km` },
      { icon: 'camera', label: 'Camera', value: drone.camera_specs },
    ];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.fieldLabel}>Choose Drone Type *</Text>
      
      <ScrollView 
        style={styles.droneList}
        showsVerticalScrollIndicator={false}
      >
        {droneTypes.map((drone) => {
          const isSelected = selectedDrone === drone.name;
          const isAvailable = drone.availability;
          
          return (
            <TouchableOpacity
              key={drone.id}
              onPress={() => isAvailable && onSelect(drone.name)}
              disabled={!isAvailable}
              activeOpacity={0.7}
            >
              <Card
                style={[
                  styles.droneCard,
                  isSelected && styles.droneCardSelected,
                  !isAvailable && styles.droneCardDisabled,
                ]}
              >
                <View style={styles.droneHeader}>
                  <View style={styles.droneIconContainer}>
                    <View
                      style={[
                        styles.droneIcon,
                        { backgroundColor: isSelected ? Colors.primary : Colors.gray100 },
                        !isAvailable && { backgroundColor: Colors.gray200 },
                      ]}
                    >
                      <Feather
                        name={getDroneIcon(drone.name)}
                        size={24}
                        color={isSelected ? Colors.white : (isAvailable ? Colors.primary : Colors.gray400)}
                      />
                    </View>
                  </View>
                  
                  <View style={styles.droneInfo}>
                    <View style={styles.droneNameRow}>
                      <Text
                        style={[
                          styles.droneName,
                          !isAvailable && styles.droneNameDisabled,
                        ]}
                      >
                        {drone.name}
                      </Text>
                      {!isAvailable && (
                        <View style={styles.unavailableBadge}>
                          <Text style={styles.unavailableText}>Unavailable</Text>
                        </View>
                      )}
                    </View>
                    
                    <Text
                      style={[
                        styles.droneDescription,
                        !isAvailable && styles.droneDescriptionDisabled,
                      ]}
                      numberOfLines={2}
                    >
                      {drone.description}
                    </Text>
                    
                    <View style={styles.priceContainer}>
                      <Text
                        style={[
                          styles.priceLabel,
                          !isAvailable && styles.priceLabelDisabled,
                        ]}
                      >
                        Starting from
                      </Text>
                      <Text
                        style={[
                          styles.price,
                          !isAvailable && styles.priceDisabled,
                        ]}
                      >
                        ₹{drone.price_per_hour.toLocaleString()}/hour
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.selectionIndicator}>
                    {isSelected && (
                      <View style={styles.selectedIcon}>
                        <Feather name="check" size={16} color={Colors.white} />
                      </View>
                    )}
                  </View>
                </View>
                
                {/* Drone Specifications */}
                <View style={styles.specsContainer}>
                  {getSpecsDisplay(drone).map((spec, index) => (
                    <View key={index} style={styles.specItem}>
                      <Feather
                        name={spec.icon as any}
                        size={14}
                        color={isAvailable ? Colors.textSecondary : Colors.gray400}
                      />
                      <Text
                        style={[
                          styles.specLabel,
                          !isAvailable && styles.specLabelDisabled,
                        ]}
                      >
                        {spec.label}:
                      </Text>
                      <Text
                        style={[
                          styles.specValue,
                          !isAvailable && styles.specValueDisabled,
                        ]}
                      >
                        {spec.value}
                      </Text>
                    </View>
                  ))}
                </View>
                
                {/* Selection Border */}
                {isSelected && <View style={styles.selectedBorder} />}
              </Card>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      {error && (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={14} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {droneTypes.length === 0 && (
        <View style={styles.emptyState}>
          <Feather name="airplay" size={48} color={Colors.gray300} />
          <Text style={styles.emptyStateTitle}>No drones available</Text>
          <Text style={styles.emptyStateSubtitle}>
            Please try again later or contact support
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  droneList: {
    maxHeight: 400,
  },
  droneCard: {
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  droneCardSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  droneCardDisabled: {
    opacity: 0.6,
  },
  droneHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  droneIconContainer: {
    marginRight: 12,
  },
  droneIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  droneInfo: {
    flex: 1,
  },
  droneNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  droneName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  droneNameDisabled: {
    color: Colors.gray500,
  },
  unavailableBadge: {
    backgroundColor: Colors.error,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unavailableText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '500',
  },
  droneDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  droneDescriptionDisabled: {
    color: Colors.gray400,
  },
  priceContainer: {
    alignItems: 'flex-start',
  },
  priceLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  priceLabelDisabled: {
    color: Colors.gray400,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  priceDisabled: {
    color: Colors.gray500,
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  specsContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 12,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  specLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 6,
    minWidth: 80,
  },
  specLabelDisabled: {
    color: Colors.gray400,
  },
  specValue: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '500',
    marginLeft: 4,
  },
  specValueDisabled: {
    color: Colors.gray500,
  },
  selectedBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    backgroundColor: Colors.primary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default DroneSelector;
