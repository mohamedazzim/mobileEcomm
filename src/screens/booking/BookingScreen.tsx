import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { Colors } from '@constants/Colors';
import { useBookingStore } from '@store/bookingStore';
import { useUIStore } from '@store/uiStore';
import { BookingFormData } from '@types/index';
import Header from '@components/common/Header';
import BookingForm from '@components/booking/BookingForm';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';

interface BookingScreenProps {
  navigation: any;
}

const BookingScreen: React.FC<BookingScreenProps> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BookingFormData>>({});

  const { 
    createBooking, 
    fetchDroneTypes, 
    droneTypes, 
    isLoading, 
    error,
    clearError 
  } = useBookingStore();
  const { showToast, setActiveScreen } = useUIStore();

  useEffect(() => {
    setActiveScreen('Book');
    loadDroneTypes();
  }, []);

  const loadDroneTypes = async () => {
    await fetchDroneTypes();
  };

  const handleStepComplete = (stepData: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmitBooking();
    }
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitBooking = async () => {
    if (!isFormDataComplete(formData)) {
      showToast('Please complete all required fields', 'error');
      return;
    }

    const success = await createBooking(formData as BookingFormData);
    
    if (success) {
      showToast('Booking created successfully!', 'success');
      // Navigate to payment or booking details
      navigation.navigate('History');
      // Reset form
      setFormData({});
      setCurrentStep(1);
    } else {
      showToast('Failed to create booking. Please try again.', 'error');
    }
  };

  const isFormDataComplete = (data: Partial<BookingFormData>): boolean => {
    return !!(
      data.service_type &&
      data.location &&
      data.latitude &&
      data.longitude &&
      data.booking_date &&
      data.booking_time &&
      data.duration &&
      data.purpose &&
      data.drone_type
    );
  };

  const getStepTitle = (step: number): string => {
    switch (step) {
      case 1:
        return 'Service & Location';
      case 2:
        return 'Date & Time';
      case 3:
        return 'Drone Selection';
      case 4:
        return 'Review & Confirm';
      default:
        return 'Book Drone';
    }
  };

  const renderProgressBar = () => {
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          {[1, 2, 3, 4].map((step) => (
            <View key={step} style={styles.progressStep}>
              <View
                style={[
                  styles.progressDot,
                  {
                    backgroundColor: step <= currentStep ? Colors.primary : Colors.gray300,
                  },
                ]}
              >
                {step < currentStep ? (
                  <Feather name="check" size={12} color={Colors.white} />
                ) : (
                  <Text
                    style={[
                      styles.progressNumber,
                      { color: step <= currentStep ? Colors.white : Colors.gray500 },
                    ]}
                  >
                    {step}
                  </Text>
                )}
              </View>
              {step < 4 && (
                <View
                  style={[
                    styles.progressLine,
                    {
                      backgroundColor: step < currentStep ? Colors.primary : Colors.gray300,
                    },
                  ]}
                />
              )}
            </View>
          ))}
        </View>
        <Text style={styles.stepTitle}>{getStepTitle(currentStep)}</Text>
      </View>
    );
  };

  if (isLoading && droneTypes.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && droneTypes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Book Drone" />
        <ErrorMessage
          message={error}
          onRetry={() => {
            clearError();
            loadDroneTypes();
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Book Drone" 
        showBack={currentStep > 1}
        onBack={handleStepBack}
      />
      
      {renderProgressBar()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <BookingForm
          currentStep={currentStep}
          formData={formData}
          droneTypes={droneTypes}
          onStepComplete={handleStepComplete}
          onStepBack={handleStepBack}
          isLoading={isLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressLine: {
    width: 40,
    height: 2,
    marginHorizontal: 8,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});

export default BookingScreen;
