import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, StatusColors } from '@constants/Colors';
import { Booking } from '@types/index';
import Card from '@components/common/Card';
import { formatDate, formatTime } from '@utils/dateUtils';
import { formatCurrency } from '@utils/helpers';

interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
  onCancel?: () => void;
  showDetails?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onPress,
  onCancel,
  showDetails = true,
}) => {
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

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceType}>{booking.service_type}</Text>
            <Text style={styles.bookingId}>#{booking.id.slice(-8)}</Text>
          </View>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: `${getStatusColor(booking.status)}20` },
              ]}
            >
              <Feather
                name={getStatusIcon(booking.status)}
                size={12}
                color={getStatusColor(booking.status)}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(booking.status) },
                ]}
              >
                {formatStatus(booking.status)}
              </Text>
            </View>
          </View>
        </View>

        {/* Details */}
        {showDetails && (
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Feather name="calendar" size={16} color={Colors.textSecondary} />
              <Text style={styles.detailText}>
                {formatDate(booking.booking_date)} at {formatTime(booking.booking_time)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Feather name="map-pin" size={16} color={Colors.textSecondary} />
              <Text style={styles.detailText} numberOfLines={1}>
                {booking.location}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Feather name="airplay" size={16} color={Colors.textSecondary} />
              <Text style={styles.detailText}>{booking.drone_type}</Text>
            </View>

            <View style={styles.detailRow}>
              <Feather name="clock" size={16} color={Colors.textSecondary} />
              <Text style={styles.detailText}>{booking.duration} hours</Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Total Amount</Text>
            <Text style={styles.price}>{formatCurrency(booking.total_amount)}</Text>
          </View>

          <View style={styles.paymentStatus}>
            <Feather
              name={booking.payment_status === 'paid' ? 'check-circle' : 'clock'}
              size={14}
              color={StatusColors[booking.payment_status] || Colors.warning}
            />
            <Text
              style={[
                styles.paymentText,
                { color: StatusColors[booking.payment_status] || Colors.warning },
              ]}
            >
              {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Actions */}
        {(booking.status === 'pending' || booking.status === 'confirmed') && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.viewButton} onPress={onPress}>
              <Text style={styles.viewButtonText}>View Details</Text>
            </TouchableOpacity>
            
            {onCancel && booking.status === 'pending' && (
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceType: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  bookingId: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  details: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    marginBottom: 12,
  },
  priceContainer: {
    alignItems: 'flex-start',
  },
  priceLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginRight: 8,
  },
  viewButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.error,
    marginLeft: 8,
  },
  cancelButtonText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default BookingCard;
