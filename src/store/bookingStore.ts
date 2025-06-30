import { create } from 'zustand';
import { Booking, DroneType, BookingFormData, DashboardStats } from '@types/index';
import { apiService } from '@services/api';
import { Config } from '@constants/Config';

interface BookingStore {
  // State
  bookings: Booking[];
  droneTypes: DroneType[];
  dashboardStats: DashboardStats | null;
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBookings: () => Promise<void>;
  fetchDroneTypes: () => Promise<void>;
  fetchDashboardStats: () => Promise<void>;
  createBooking: (data: BookingFormData) => Promise<boolean>;
  updateBooking: (id: string, data: Partial<Booking>) => Promise<boolean>;
  cancelBooking: (id: string) => Promise<boolean>;
  getBookingDetails: (id: string) => Promise<Booking | null>;
  setSelectedBooking: (booking: Booking | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  // Initial state
  bookings: [],
  droneTypes: [],
  dashboardStats: null,
  selectedBooking: null,
  isLoading: false,
  error: null,

  // Actions
  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiService.get<Booking[]>(Config.endpoints.bookings.list);
      
      if (response.success && response.data) {
        set({
          bookings: response.data,
          isLoading: false,
        });
      } else {
        set({
          error: response.error || 'Failed to fetch bookings',
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch bookings',
        isLoading: false,
      });
    }
  },

  fetchDroneTypes: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiService.get<DroneType[]>(Config.endpoints.drones.list);
      
      if (response.success && response.data) {
        set({
          droneTypes: response.data,
          isLoading: false,
        });
      } else {
        set({
          error: response.error || 'Failed to fetch drone types',
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch drone types',
        isLoading: false,
      });
    }
  },

  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiService.get<DashboardStats>(Config.endpoints.dashboard.stats);
      
      if (response.success && response.data) {
        set({
          dashboardStats: response.data,
          isLoading: false,
        });
      } else {
        set({
          error: response.error || 'Failed to fetch dashboard stats',
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch dashboard stats',
        isLoading: false,
      });
    }
  },

  createBooking: async (data: BookingFormData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiService.post<Booking>(Config.endpoints.bookings.create, data);
      
      if (response.success && response.data) {
        // Add new booking to the list
        const currentBookings = get().bookings;
        set({
          bookings: [response.data, ...currentBookings],
          isLoading: false,
        });
        return true;
      } else {
        set({
          error: response.error || 'Failed to create booking',
          isLoading: false,
        });
        return false;
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create booking',
        isLoading: false,
      });
      return false;
    }
  },

  updateBooking: async (id: string, data: Partial<Booking>) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiService.put<Booking>(`${Config.endpoints.bookings.update}/${id}`, data);
      
      if (response.success && response.data) {
        // Update booking in the list
        const currentBookings = get().bookings;
        const updatedBookings = currentBookings.map(booking =>
          booking.id === id ? response.data! : booking
        );
        
        set({
          bookings: updatedBookings,
          selectedBooking: response.data,
          isLoading: false,
        });
        return true;
      } else {
        set({
          error: response.error || 'Failed to update booking',
          isLoading: false,
        });
        return false;
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update booking',
        isLoading: false,
      });
      return false;
    }
  },

  cancelBooking: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiService.put<Booking>(`${Config.endpoints.bookings.update}/${id}`, {
        status: 'cancelled',
      });
      
      if (response.success && response.data) {
        // Update booking status in the list
        const currentBookings = get().bookings;
        const updatedBookings = currentBookings.map(booking =>
          booking.id === id ? { ...booking, status: 'cancelled' } : booking
        );
        
        set({
          bookings: updatedBookings,
          isLoading: false,
        });
        return true;
      } else {
        set({
          error: response.error || 'Failed to cancel booking',
          isLoading: false,
        });
        return false;
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to cancel booking',
        isLoading: false,
      });
      return false;
    }
  },

  getBookingDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiService.get<Booking>(`${Config.endpoints.bookings.details}/${id}`);
      
      if (response.success && response.data) {
        set({
          selectedBooking: response.data,
          isLoading: false,
        });
        return response.data;
      } else {
        set({
          error: response.error || 'Failed to fetch booking details',
          isLoading: false,
        });
        return null;
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch booking details',
        isLoading: false,
      });
      return null;
    }
  },

  setSelectedBooking: (booking: Booking | null) => {
    set({ selectedBooking: booking });
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
