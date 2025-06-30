import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@constants/Colors';

interface CalendarPickerProps {
  selectedDate?: string;
  selectedTime?: string;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  errors?: {
    date?: string;
    time?: string;
  };
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  errors,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDisplayTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isTimeSlotDisabled = (timeSlot: string) => {
    if (!selectedDate) return false;
    
    const selectedDateObj = new Date(selectedDate);
    const today = new Date();
    
    // If selected date is today, disable past time slots
    if (selectedDateObj.toDateString() === today.toDateString()) {
      const [hours, minutes] = timeSlot.split(':').map(Number);
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);
      
      const currentTime = new Date();
      currentTime.setMinutes(currentTime.getMinutes() + 60); // 1 hour buffer
      
      return slotTime <= currentTime;
    }
    
    return false;
  };

  return (
    <View style={styles.container}>
      {/* Date Picker */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Date *</Text>
        <TouchableOpacity
          style={[
            styles.pickerButton,
            errors?.date && styles.pickerButtonError,
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <Feather name="calendar" size={20} color={Colors.primary} />
          <Text style={[styles.pickerText, !selectedDate && styles.placeholderText]}>
            {selectedDate ? formatDisplayDate(selectedDate) : 'Select date'}
          </Text>
          <Feather name="chevron-down" size={20} color={Colors.gray400} />
        </TouchableOpacity>
        {errors?.date && (
          <Text style={styles.errorText}>{errors.date}</Text>
        )}
      </View>

      {/* Time Picker */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Time *</Text>
        <TouchableOpacity
          style={[
            styles.pickerButton,
            errors?.time && styles.pickerButtonError,
            !selectedDate && styles.pickerButtonDisabled,
          ]}
          onPress={() => selectedDate && setShowTimePicker(true)}
          disabled={!selectedDate}
        >
          <Feather name="clock" size={20} color={selectedDate ? Colors.primary : Colors.gray400} />
          <Text style={[styles.pickerText, !selectedTime && styles.placeholderText]}>
            {selectedTime ? formatDisplayTime(selectedTime) : 'Select time'}
          </Text>
          <Feather name="chevron-down" size={20} color={Colors.gray400} />
        </TouchableOpacity>
        {errors?.time && (
          <Text style={styles.errorText}>{errors.time}</Text>
        )}
      </View>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Date</Text>
            <View style={styles.modalHeaderSpacer} />
          </View>
          
          <ScrollView style={styles.dateList}>
            {generateDates().map((date, index) => {
              const dateString = formatDate(date);
              const isSelected = selectedDate === dateString;
              const isDisabled = isDateDisabled(date);
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateOption,
                    isSelected && styles.dateOptionSelected,
                    isDisabled && styles.dateOptionDisabled,
                  ]}
                  onPress={() => {
                    if (!isDisabled) {
                      onDateSelect(dateString);
                      setShowDatePicker(false);
                    }
                  }}
                  disabled={isDisabled}
                >
                  <View style={styles.dateOptionContent}>
                    <Text style={[
                      styles.dateOptionDay,
                      isSelected && styles.dateOptionTextSelected,
                      isDisabled && styles.dateOptionTextDisabled,
                    ]}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </Text>
                    <Text style={[
                      styles.dateOptionDate,
                      isSelected && styles.dateOptionTextSelected,
                      isDisabled && styles.dateOptionTextDisabled,
                    ]}>
                      {date.getDate()}
                    </Text>
                    <Text style={[
                      styles.dateOptionMonth,
                      isSelected && styles.dateOptionTextSelected,
                      isDisabled && styles.dateOptionTextDisabled,
                    ]}>
                      {date.toLocaleDateString('en-US', { month: 'short' })}
                    </Text>
                  </View>
                  {isSelected && (
                    <Feather name="check" size={20} color={Colors.white} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowTimePicker(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Time</Text>
            <View style={styles.modalHeaderSpacer} />
          </View>
          
          <ScrollView style={styles.timeList}>
            {generateTimeSlots().map((timeSlot, index) => {
              const isSelected = selectedTime === timeSlot;
              const isDisabled = isTimeSlotDisabled(timeSlot);
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeOption,
                    isSelected && styles.timeOptionSelected,
                    isDisabled && styles.timeOptionDisabled,
                  ]}
                  onPress={() => {
                    if (!isDisabled) {
                      onTimeSelect(timeSlot);
                      setShowTimePicker(false);
                    }
                  }}
                  disabled={isDisabled}
                >
                  <Text style={[
                    styles.timeOptionText,
                    isSelected && styles.timeOptionTextSelected,
                    isDisabled && styles.timeOptionTextDisabled,
                  ]}>
                    {formatDisplayTime(timeSlot)}
                  </Text>
                  {isSelected && (
                    <Feather name="check" size={20} color={Colors.white} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    minHeight: 48,
  },
  pickerButtonError: {
    borderColor: Colors.error,
  },
  pickerButtonDisabled: {
    backgroundColor: Colors.gray100,
    opacity: 0.6,
  },
  pickerText: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  placeholderText: {
    color: Colors.gray400,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalCancelText: {
    fontSize: 16,
    color: Colors.primary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  modalHeaderSpacer: {
    width: 60,
  },
  dateList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dateOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 4,
    backgroundColor: Colors.gray50,
  },
  dateOptionSelected: {
    backgroundColor: Colors.primary,
  },
  dateOptionDisabled: {
    backgroundColor: Colors.gray100,
    opacity: 0.5,
  },
  dateOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateOptionDay: {
    fontSize: 14,
    color: Colors.textSecondary,
    width: 40,
  },
  dateOptionDate: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    width: 40,
    textAlign: 'center',
  },
  dateOptionMonth: {
    fontSize: 14,
    color: Colors.textSecondary,
    width: 40,
    marginLeft: 8,
  },
  dateOptionTextSelected: {
    color: Colors.white,
  },
  dateOptionTextDisabled: {
    color: Colors.gray400,
  },
  timeList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  timeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 2,
    backgroundColor: Colors.gray50,
  },
  timeOptionSelected: {
    backgroundColor: Colors.primary,
  },
  timeOptionDisabled: {
    backgroundColor: Colors.gray100,
    opacity: 0.5,
  },
  timeOptionText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  timeOptionTextSelected: {
    color: Colors.white,
  },
  timeOptionTextDisabled: {
    color: Colors.gray400,
  },
});

export default CalendarPicker;
