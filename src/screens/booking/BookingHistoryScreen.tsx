import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { Colors, StatusColors } from '@constants/Colors';
import { useBookingStore } from '@store/bookingStore';
import { useUIStore } from '@store/uiStore';
import { Booking } from '@types/index';
import Header from '@components/common/Header';
import BookingCard from '@components/booking/BookingCard';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';

interface BookingHistoryScreenProps {
  navigation: any;
}

const BookingHistoryScreen: React.FC<BookingHistoryScreenProps> = ({ navigation }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  const { 
    bookings, 
    fetchBookings, 
    cancelBooking,
    isLoading, 
    error,
    clearError 
  } = useBookingStore();
  const { isRefreshing, setRefreshing, showToast, setActiveScreen } = useUIStore();

  useEffect(() => {
    setActiveScreen('History');
    loadBookings();
  }, []);

  const loadBookings = async () => {
    await fetchBookings();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const handleBookingPress = (booking: Booking) => {
    navigation.navigate('BookingDetails', { bookingId: booking.id });
  };

  const handleCancelBooking = (booking: Booking) => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel this booking?\n\nService: ${booking.service_type}\nDate: ${new Date(booking.booking_date).toDateString()}`,
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
            } else {
              showToast('Failed to cancel booking', 'error');
            }
          },
        },
      ]
    );
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getFilterCount = (status: string) => {
    if (status === 'all') return bookings.length;
    return bookings.filter(booking => booking.status === status).length;
  };

  const renderFilterButton = (
    status: 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled',
    label: string
  ) => {
    const count = getFilterCount(status);
    const isActive = filter === status;

    return (
      <TouchableOpacity
        style={[
          styles.filterButton,
          { backgroundColor: isActive ? Colors.primary : Colors.white },
        ]}
        onPress={() => setFilter(status)}
      >
        <Text
          style={[
            styles.filterButtonText,
            { color: isActive ? Colors.white : Colors.textSecondary },
          ]}
        >
          {label}
        </Text>
        {count > 0 && (
          <View
            style={[
              styles.filterBadge,
              { backgroundColor: isActive ? Colors.white : Colors.primary },
            ]}
          >
            <Text
              style={[
                styles.filterBadgeText,
                { color: isActive ? Colors.primary : Colors.white },
              ]}
            >
              {count}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <BookingCard
      booking={item}
      onPress={() => handleBookingPress(item)}
      onCancel={item.status === 'pending' ? () => handleCancelBooking(item) : undefined}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather name="calendar" size={80} color={Colors.gray300} />
      <Text style={styles.emptyStateTitle}>
        {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {filter === 'all' 
          ? 'Start by booking your first drone service'
          : `You don't have any ${filter} bookings at the moment`
        }
      </Text>
      {filter === 'all' && (
        <TouchableOpacity 
          style={styles.emptyStateButton} 
          onPress={() => navigation.navigate('Book')}
        >
          <Text style={styles.emptyStateButtonText}>Book Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading && bookings.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && bookings.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="My Bookings" />
        <ErrorMessage
          message={error}
          onRetry={() => {
            clearError();
            loadBookings();
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Bookings" />
      
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          {renderFilterButton('all', 'All')}
          {renderFilterButton('pending', 'Pending')}
          {renderFilterButton('confirmed', 'Confirmed')}
        </View>
        <View style={styles.filterRow}>
          {renderFilterButton('completed', 'Completed')}
          {renderFilterButton('cancelled', 'Cancelled')}
        </View>
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterContainer: {
    padding: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  filterBadge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
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
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyStateButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookingHistoryScreen;
