import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { Colors, StatusColors } from '@constants/Colors';
import { useBookingStore } from '@store/bookingStore';
import { useUIStore } from '@store/uiStore';
import { Booking } from '@types/index';
import Header from '@components/common/Header';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';
import { formatDate, formatTime } from '@utils/dateUtils';
import { formatCurrency } from '@utils/helpers';

interface BookingDetailsScreenProps {
  navigation: any;
  route: {
    params: {
      bookingId: string;
    };
  };
}

const BookingDetailsScreen: React.FC<BookingDetailsScreenProps> = ({ 
  navigation, 
  route 
}) => {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState<Booking | null>(null);

  const { 
    getBookingDetails, 
    cancelBooking, 
    updateBooking,
    isLoading, 
    error,
    clearError 
  } = useBookingStore();
  const { showToast } = useUIStore();

  useEffect(() => {
    loadBookingDetails();
  }, [bookingId]);

  const loadBookingDetails = async () => {
    const bookingData = await getBookingDetails(bookingId);
    if (bookingData) {
      setBooking(bookingData);
    }
  };

  const handleCancelBooking = () => {
    if (!booking) return;

    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? This action cannot be undone.',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            const success = await cancelBooking(booking.id);
            if (success) {
              showToast('Booking cancelled successfully', 'success');
              setBooking(prev => prev ? { ...prev, status: 'cancelled' } : null);
            } else {
              showToast('Failed to cancel booking', 'error');
            }
          },
        },
      ]
    );
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+1234567890');
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@dronebooking.com');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return 'clock';
      case 'confirmed':
        return 'check';
      case 'in_progress':
        return 'play';
      case 'completed':
        return 'check-circle';
      case 'cancelled':
        return 'x-circle';
      default:
        return 'help-circle';
    }
  };

  const getStatusColor = (status: string) => {
    return StatusColors[status as keyof typeof StatusColors] || Colors.gray500;
  };

  const canCancelBooking = (booking: Booking) => {
    return booking.status === 'pending' || booking.status === 'confirmed';
  };

  const canRescheduleBooking = (booking: Booking) => {
    return booking.status === 'pending' || booking.status === 'confirmed';
  };

  if (isLoading && !booking) {
    return <LoadingSpinner />;
  }

  if (error && !booking) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Booking Details" showBack onBack={() => navigation.goBack()} />
        <ErrorMessage
          message={error}
          onRetry={() => {
            clearError();
            loadBookingDetails();
          }}
        />
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Booking Details" showBack onBack={() => navigation.goBack()} />
        <View style={styles.emptyState}>
          <Feather name="alert-circle" size={80} color={Colors.gray300} />
          <Text style={styles.emptyStateTitle}>Booking not found</Text>
          <Text style={styles.emptyStateSubtitle}>
            The booking you're looking for doesn't exist or has been removed.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Booking Details" showBack onBack={() => navigation.goBack()} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIconContainer}>
              <Feather
                name={getStatusIcon(booking.status)}
                size={24}
                color={getStatusColor(booking.status)}
              />
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('_', ' ')}
              </Text>
              <Text style={styles.bookingId}>Booking ID: #{booking.id.slice(-8)}</Text>
            </View>
          </View>
        </Card>

        {/* Service Details */}
        <Card style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Service Details</Text>
          
          <View style={styles.detailRow}>
            <Feather name="airplay" size={20} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Service Type</Text>
              <Text style={styles.detailValue}>{booking.service_type}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Feather name="settings" size={20} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Drone Type</Text>
              <Text style={styles.detailValue}>{booking.drone_type}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Feather name="clock" size={20} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>{booking.duration} hours</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Feather name="file-text" size={20} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Purpose</Text>
              <Text style={styles.detailValue}>{booking.purpose}</Text>
            </View>
          </View>
        </Card>

        {/* Schedule Details */}
        <Card style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Schedule</Text>
          
          <View style={styles.detailRow}>
            <Feather name="calendar" size={20} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formatDate(booking.booking_date)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Feather name="clock" size={20} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{formatTime(booking.booking_time)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Feather name="map-pin" size={20} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{booking.location}</Text>
            </View>
          </View>
        </Card>

        {/* Payment Details */}
        <Card style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Payment</Text>
          
          <View style={styles.detailRow}>
            <Feather name="dollar-sign" size={20} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Total Amount</Text>
              <Text style={styles.detailValue}>{formatCurrency(booking.total_amount)}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Feather 
              name={booking.payment_status === 'paid' ? 'check-circle' : 'clock'} 
              size={20} 
              color={booking.payment_status === 'paid' ? Colors.success : Colors.warning} 
            />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Payment Status</Text>
              <Text 
                style={[
                  styles.detailValue,
                  { color: StatusColors[booking.payment_status] || Colors.textPrimary }
                ]}
              >
                {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Special Instructions */}
        {booking.special_instructions && (
          <Card style={styles.detailsCard}>
            <Text style={styles.cardTitle}>Special Instructions</Text>
            <Text style={styles.instructionsText}>{booking.special_instructions}</Text>
          </Card>
        )}

        {/* Pilot Information */}
        {booking.pilot_assigned && (
          <Card style={styles.detailsCard}>
            <Text style={styles.cardTitle}>Assigned Pilot</Text>
            <View style={styles.detailRow}>
              <Feather name="user" size={20} color={Colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Pilot</Text>
                <Text style={styles.detailValue}>{booking.pilot_assigned}</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {canCancelBooking(booking) && (
            <Button
              title="Cancel Booking"
              onPress={handleCancelBooking}
              variant="outline"
              style={[styles.actionButton, { borderColor: Colors.error }]}
              textStyle={{ color: Colors.error }}
            />
          )}

          {canRescheduleBooking(booking) && (
            <Button
              title="Reschedule"
              onPress={() => {
                // Navigate to reschedule screen
                showToast('Reschedule feature coming soon', 'info');
              }}
              style={styles.actionButton}
            />
          )}
        </View>

        {/* Support Section */}
        <Card style={styles.supportCard}>
          <Text style={styles.cardTitle}>Need Help?</Text>
          <Text style={styles.supportText}>
            If you have any questions about your booking, feel free to contact our support team.
          </Text>
          
          <View style={styles.supportButtons}>
            <TouchableOpacity style={styles.supportButton} onPress={handleCallSupport}>
              <Feather name="phone" size={20} color={Colors.primary} />
              <Text style={styles.supportButtonText}>Call Support</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.supportButton} onPress={handleEmailSupport}>
              <Feather name="mail" size={20} color={Colors.primary} />
              <Text style={styles.supportButtonText}>Email Support</Text>
            </TouchableOpacity>
          </View>
        </Card>
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
  statusCard: {
    marginTop: 20,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  bookingId: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  detailsCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailContent: {
    flex: 1,
    marginLeft: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  instructionsText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  actionContainer: {
    marginVertical: 20,
  },
  actionButton: {
    marginBottom: 12,
  },
  supportCard: {
    marginBottom: 32,
  },
  supportText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  supportButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  supportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 6,
  },
  supportButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default BookingDetailsScreen;
