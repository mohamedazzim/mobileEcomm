import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, StatusColors } from '@constants/Colors';
import { Booking } from '@types/index';
import Card from '@components/common/Card';
import { formatDate, formatTime } from '@utils/dateUtils';

interface RecentBookingsProps {
  bookings: Booking[];
  onBookingPress: (bookingId: string) => void;
  maxItems?: number;
}

const RecentBookings: React.FC<RecentBookingsProps> = ({
  bookings,
  onBookingPress,
  maxItems = 5,
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

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <TouchableOpacity
      onPress={() => onBookingPress(item.id)}
      activeOpacity={0.7}
    >
      <Card style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceType} numberOfLines={1}>
              {item.service_type}
            </Text>
            <Text style={styles.bookingId}>#{item.id.slice(-8)}</Text>
          </View>
          
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${getStatusColor(item.status)}20` },
            ]}
          >
            <Feather
              name={getStatusIcon(item.status)}
              size={10}
              color={getStatusColor(item.status)}
            />
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(item.status) },
              ]}
            >
              {formatStatus(item.status)}
            </Text>
          </View>
        </View>
        
        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <Feather name="calendar" size={12} color={Colors.textSecondary} />
            <Text style={styles.detailText}>
              {formatDate(item.booking_date)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Feather name="clock" size={12} color={Colors.textSecondary} />
            <Text style={styles.detailText}>
              {formatTime(item.booking_time)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Feather name="map-pin" size={12} color={Colors.textSecondary} />
            <Text style={styles.detailText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        </View>
        
        <View style={styles.bookingFooter}>
          <Text style={styles.droneType}>{item.drone_type}</Text>
          <Text style={styles.amount}>₹{item.total_amount.toLocaleString()}</Text>
        </View>
        
        <View style={styles.chevron}>
          <Feather name="chevron-right" size={16} color={Colors.gray400} />
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather name="calendar" size={48} color={Colors.gray300} />
      <Text style={styles.emptyStateTitle}>No recent bookings</Text>
      <Text style={styles.emptyStateSubtitle}>
        Your recent bookings will appear here
      </Text>
    </View>
  );

  const displayBookings = bookings.slice(0, maxItems);

  return (
    <View style={styles.container}>
      {displayBookings.length > 0 ? (
        <FlatList
          data={displayBookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      ) : (
        renderEmptyState()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bookingCard: {
    marginBottom: 12,
    padding: 16,
    position: 'relative',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
    marginRight: 12,
  },
  serviceType: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  bookingId: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 3,
  },
  bookingDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  droneType: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  amount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  chevron: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -8 }],
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

export default RecentBookings;
