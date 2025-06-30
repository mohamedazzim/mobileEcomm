import { useEffect, useState } from 'react';
import { useBookingStore } from '@store/bookingStore';
import { useUIStore } from '@store/uiStore';
import { Booking, BookingFormData, DroneType, DashboardStats } from '@types/index';

export const useBookings = () => {
  const {
    bookings,
    droneTypes,
    dashboardStats,
    selectedBooking,
    isLoading,
    error,
    fetchBookings,
    fetchDroneTypes,
    fetchDashboardStats,
    createBooking,
    updateBooking,
    cancelBooking,
    getBookingDetails,
    setSelectedBooking,
    clearError,
  } = useBookingStore();

  const { showToast } = useUIStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      initializeBookings();
      setInitialized(true);
    }
  }, [initialized]);

  const initializeBookings = async () => {
    try {
      await Promise.all([
        fetchBookings(),
        fetchDroneTypes(),
        fetchDashboardStats(),
      ]);
    } catch (error) {
      console.error('Failed to initialize bookings:', error);
    }
  };

  const handleCreateBooking = async (data: BookingFormData): Promise<boolean> => {
    try {
      const success = await createBooking(data);
      if (success) {
        showToast('Booking created successfully!', 'success');
        // Refresh data
        await Promise.all([fetchBookings(), fetchDashboardStats()]);
      } else {
        showToast('Failed to create booking', 'error');
      }
      return success;
    } catch (error) {
      console.error('Create booking error:', error);
      showToast('An error occurred while creating booking', 'error');
      return false;
    }
  };

  const handleUpdateBooking = async (
    id: string,
    data: Partial<Booking>
  ): Promise<boolean> => {
    try {
      const success = await updateBooking(id, data);
      if (success) {
        showToast('Booking updated successfully!', 'success');
        // Refresh data
        await Promise.all([fetchBookings(), fetchDashboardStats()]);
      } else {
        showToast('Failed to update booking', 'error');
      }
      return success;
    } catch (error) {
      console.error('Update booking error:', error);
      showToast('An error occurred while updating booking', 'error');
      return false;
    }
  };

  const handleCancelBooking = async (id: string): Promise<boolean> => {
    try {
      const success = await cancelBooking(id);
      if (success) {
        showToast('Booking cancelled successfully', 'success');
        // Refresh data
        await Promise.all([fetchBookings(), fetchDashboardStats()]);
      } else {
        showToast('Failed to cancel booking', 'error');
      }
      return success;
    } catch (error) {
      console.error('Cancel booking error:', error);
      showToast('An error occurred while cancelling booking', 'error');
      return false;
    }
  };

  const handleGetBookingDetails = async (id: string): Promise<Booking | null> => {
    try {
      return await getBookingDetails(id);
    } catch (error) {
      console.error('Get booking details error:', error);
      showToast('Failed to load booking details', 'error');
      return null;
    }
  };

  const handleRefreshData = async (): Promise<void> => {
    try {
      await Promise.all([
        fetchBookings(),
        fetchDroneTypes(),
        fetchDashboardStats(),
      ]);
    } catch (error) {
      console.error('Refresh data error:', error);
      showToast('Failed to refresh data', 'error');
    }
  };

  // Computed values
  const getBookingsByStatus = (status: string): Booking[] => {
    return bookings.filter(booking => booking.status === status);
  };

  const getPendingBookings = (): Booking[] => {
    return getBookingsByStatus('pending');
  };

  const getConfirmedBookings = (): Booking[] => {
    return getBookingsByStatus('confirmed');
  };

  const getCompletedBookings = (): Booking[] => {
    return getBookingsByStatus('completed');
  };

  const getCancelledBookings = (): Booking[] => {
    return getBookingsByStatus('cancelled');
  };

  const getUpcomingBookings = (): Booking[] => {
    const today = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.booking_date);
      return bookingDate >= today && (booking.status === 'pending' || booking.status === 'confirmed');
    });
  };

  const getBookingById = (id: string): Booking | undefined => {
    return bookings.find(booking => booking.id === id);
  };

  const getTotalSpent = (): number => {
    return bookings
      .filter(booking => booking.payment_status === 'paid')
      .reduce((total, booking) => total + booking.total_amount, 0);
  };

  const getAvailableDrones = (): DroneType[] => {
    return droneTypes.filter(drone => drone.availability);
  };

  const getDroneByName = (name: string): DroneType | undefined => {
    return droneTypes.find(drone => drone.name === name);
  };

  const canCancelBooking = (booking: Booking): boolean => {
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return false;
    }

    // Check if booking is at least 24 hours away
    const bookingDateTime = new Date(`${booking.booking_date}T${booking.booking_time}`);
    const now = new Date();
    const timeDiff = bookingDateTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    return hoursDiff >= 24;
  };

  const canRescheduleBooking = (booking: Booking): boolean => {
    return canCancelBooking(booking); // Same conditions for now
  };

  return {
    // State
    bookings,
    droneTypes,
    dashboardStats,
    selectedBooking,
    isLoading,
    error,
    initialized,

    // Actions
    createBooking: handleCreateBooking,
    updateBooking: handleUpdateBooking,
    cancelBooking: handleCancelBooking,
    getBookingDetails: handleGetBookingDetails,
    refreshData: handleRefreshData,
    setSelectedBooking,
    clearError,

    // Computed values
    getBookingsByStatus,
    getPendingBookings,
    getConfirmedBookings,
    getCompletedBookings,
    getCancelledBookings,
    getUpcomingBookings,
    getBookingById,
    getTotalSpent,
    getAvailableDrones,
    getDroneByName,

    // Utils
    canCancelBooking,
    canRescheduleBooking,
    totalBookings: bookings.length,
    pendingCount: getPendingBookings().length,
    confirmedCount: getConfirmedBookings().length,
    completedCount: getCompletedBookings().length,
    upcomingCount: getUpcomingBookings().length,
    hasBookings: bookings.length > 0,
    hasUpcomingBookings: getUpcomingBookings().length > 0,
  };
};

export default useBookings;
