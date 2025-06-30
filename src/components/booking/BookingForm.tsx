import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Colors } from '@constants/Colors';
import { BookingFormData, DroneType } from '@types/index';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import CalendarPicker from './CalendarPicker';
import DroneSelector from './DroneSelector';

interface BookingFormProps {
  currentStep: number;
  formData: Partial<BookingFormData>;
  droneTypes: DroneType[];
  onStepComplete: (data: Partial<BookingFormData>) => void;
  onStepBack: () => void;
  isLoading: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
  currentStep,
  formData,
  droneTypes,
  onStepComplete,
  onStepBack,
  isLoading,
}) => {
  const [stepData, setStepData] = useState<Partial<BookingFormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateStepData = (field: string, value: any) => {
    setStepData(prev => ({ ...prev, [field]: value }));
    // Clear error when user updates the field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!stepData.service_type) {
          newErrors.service_type = 'Please select a service type';
        }
        if (!stepData.location) {
          newErrors.location = 'Location is required';
        }
        if (!stepData.purpose) {
          newErrors.purpose = 'Purpose is required';
        }
        break;

      case 2:
        if (!stepData.booking_date) {
          newErrors.booking_date = 'Please select a date';
        }
        if (!stepData.booking_time) {
          newErrors.booking_time = 'Please select a time';
        }
        if (!stepData.duration || stepData.duration < 1) {
          newErrors.duration = 'Duration must be at least 1 hour';
        }
        break;

      case 3:
        if (!stepData.drone_type) {
          newErrors.drone_type = 'Please select a drone type';
        }
        break;

      case 4:
        // Final validation - all required fields
        const allData = { ...formData, ...stepData };
        if (!allData.service_type || !allData.location || !allData.purpose ||
            !allData.booking_date || !allData.booking_time || !allData.duration ||
            !allData.drone_type) {
          newErrors.general = 'Please complete all required fields';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      onStepComplete(stepData);
    }
  };

  const renderStep1 = () => (
    <Card style={styles.stepCard}>
      <Text style={styles.stepTitle}>Service & Location</Text>
      
      <View style={styles.serviceTypes}>
        <Text style={styles.fieldLabel}>Service Type *</Text>
        <View style={styles.serviceGrid}>
          {['Photography', 'Videography', 'Survey', 'Inspection', 'Real Estate', 'Event Coverage'].map((service) => (
            <TouchableOpacity
              key={service}
              style={[
                styles.serviceOption,
                stepData.service_type === service && styles.serviceOptionSelected,
              ]}
              onPress={() => updateStepData('service_type', service)}
            >
              <Text
                style={[
                  styles.serviceOptionText,
                  stepData.service_type === service && styles.serviceOptionTextSelected,
                ]}
              >
                {service}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.service_type && (
          <Text style={styles.errorText}>{errors.service_type}</Text>
        )}
      </View>

      <Input
        label="Location"
        placeholder="Enter service location"
        value={stepData.location || ''}
        onChangeText={(value) => updateStepData('location', value)}
        leftIcon="map-pin"
        error={errors.location}
        required
      />

      <Input
        label="Purpose"
        placeholder="Describe the purpose of your drone service"
        value={stepData.purpose || ''}
        onChangeText={(value) => updateStepData('purpose', value)}
        leftIcon="file-text"
        multiline
        numberOfLines={3}
        error={errors.purpose}
        required
      />

      <Input
        label="Special Instructions (Optional)"
        placeholder="Any special requirements or instructions"
        value={stepData.special_instructions || ''}
        onChangeText={(value) => updateStepData('special_instructions', value)}
        leftIcon="message-circle"
        multiline
        numberOfLines={2}
      />

      <Button title="Next" onPress={handleNext} />
    </Card>
  );

  const renderStep2 = () => (
    <Card style={styles.stepCard}>
      <Text style={styles.stepTitle}>Date & Time</Text>
      
      <CalendarPicker
        selectedDate={stepData.booking_date}
        selectedTime={stepData.booking_time}
        onDateSelect={(date) => updateStepData('booking_date', date)}
        onTimeSelect={(time) => updateStepData('booking_time', time)}
        errors={{
          date: errors.booking_date,
          time: errors.booking_time,
        }}
      />

      <View style={styles.durationContainer}>
        <Text style={styles.fieldLabel}>Duration (hours) *</Text>
        <View style={styles.durationOptions}>
          {[1, 2, 3, 4, 6, 8].map((hours) => (
            <TouchableOpacity
              key={hours}
              style={[
                styles.durationOption,
                stepData.duration === hours && styles.durationOptionSelected,
              ]}
              onPress={() => updateStepData('duration', hours)}
            >
              <Text
                style={[
                  styles.durationOptionText,
                  stepData.duration === hours && styles.durationOptionTextSelected,
                ]}
              >
                {hours}h
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.duration && (
          <Text style={styles.errorText}>{errors.duration}</Text>
        )}
      </View>

      <View style={styles.stepActions}>
        <Button
          title="Back"
          onPress={onStepBack}
          variant="outline"
          style={styles.backButton}
        />
        <Button
          title="Next"
          onPress={handleNext}
          style={styles.nextButton}
        />
      </View>
    </Card>
  );

  const renderStep3 = () => (
    <Card style={styles.stepCard}>
      <Text style={styles.stepTitle}>Select Drone</Text>
      
      <DroneSelector
        droneTypes={droneTypes}
        selectedDrone={stepData.drone_type}
        onSelect={(droneType) => updateStepData('drone_type', droneType)}
        error={errors.drone_type}
      />

      <View style={styles.stepActions}>
        <Button
          title="Back"
          onPress={onStepBack}
          variant="outline"
          style={styles.backButton}
        />
        <Button
          title="Next"
          onPress={handleNext}
          style={styles.nextButton}
        />
      </View>
    </Card>
  );

  const renderStep4 = () => {
    const allData = { ...formData, ...stepData };
    const selectedDrone = droneTypes.find(d => d.name === allData.drone_type);
    const totalAmount = selectedDrone ? selectedDrone.price_per_hour * (allData.duration || 1) : 0;

    return (
      <Card style={styles.stepCard}>
        <Text style={styles.stepTitle}>Review & Confirm</Text>
        
        {errors.general && (
          <View style={styles.generalError}>
            <Text style={styles.errorText}>{errors.general}</Text>
          </View>
        )}

        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Service Details</Text>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Service Type:</Text>
            <Text style={styles.reviewValue}>{allData.service_type}</Text>
          </View>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Location:</Text>
            <Text style={styles.reviewValue}>{allData.location}</Text>
          </View>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Purpose:</Text>
            <Text style={styles.reviewValue}>{allData.purpose}</Text>
          </View>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Schedule</Text>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Date:</Text>
            <Text style={styles.reviewValue}>{allData.booking_date}</Text>
          </View>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Time:</Text>
            <Text style={styles.reviewValue}>{allData.booking_time}</Text>
          </View>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Duration:</Text>
            <Text style={styles.reviewValue}>{allData.duration} hours</Text>
          </View>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Drone & Pricing</Text>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Drone Type:</Text>
            <Text style={styles.reviewValue}>{allData.drone_type}</Text>
          </View>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Rate per hour:</Text>
            <Text style={styles.reviewValue}>₹{selectedDrone?.price_per_hour.toLocaleString()}</Text>
          </View>
          <View style={[styles.reviewRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>₹{totalAmount.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.stepActions}>
          <Button
            title="Back"
            onPress={onStepBack}
            variant="outline"
            style={styles.backButton}
          />
          <Button
            title="Confirm Booking"
            onPress={handleNext}
            loading={isLoading}
            style={styles.confirmButton}
          />
        </View>
      </Card>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderCurrentStep()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepCard: {
    marginTop: 20,
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 24,
    textAlign: 'center',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  serviceTypes: {
    marginBottom: 20,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  serviceOption: {
    backgroundColor: Colors.gray100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  serviceOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  serviceOptionText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  serviceOptionTextSelected: {
    color: Colors.white,
  },
  durationContainer: {
    marginBottom: 24,
  },
  durationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  durationOption: {
    backgroundColor: Colors.gray100,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 60,
    alignItems: 'center',
  },
  durationOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  durationOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  durationOptionTextSelected: {
    color: Colors.white,
  },
  stepActions: {
    flexDirection: 'row',
    marginTop: 24,
  },
  backButton: {
    flex: 1,
    marginRight: 8,
  },
  nextButton: {
    flex: 1,
    marginLeft: 8,
  },
  confirmButton: {
    flex: 1,
    marginLeft: 8,
  },
  reviewSection: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  reviewSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  reviewValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
  generalError: {
    backgroundColor: `${Colors.error}10`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
});

export default BookingForm;
