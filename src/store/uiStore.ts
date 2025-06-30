import { create } from 'zustand';
import { NotificationData } from '@types/index';

interface UIStore {
  // State
  notifications: NotificationData[];
  isOnline: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  unreadNotificationsCount: number;
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'warning' | 'info' | null;
  isRefreshing: boolean;
  activeScreen: string;

  // Actions
  addNotification: (notification: NotificationData) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  setOnlineStatus: (isOnline: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: string) => void;
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  hideToast: () => void;
  setRefreshing: (refreshing: boolean) => void;
  setActiveScreen: (screen: string) => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  // Initial state
  notifications: [],
  isOnline: true,
  theme: 'system',
  language: 'en',
  unreadNotificationsCount: 0,
  toastMessage: null,
  toastType: null,
  isRefreshing: false,
  activeScreen: 'Dashboard',

  // Actions
  addNotification: (notification: NotificationData) => {
    const currentNotifications = get().notifications;
    const newNotifications = [notification, ...currentNotifications];
    const unreadCount = newNotifications.filter(n => !n.read).length;
    
    set({
      notifications: newNotifications,
      unreadNotificationsCount: unreadCount,
    });
  },

  markNotificationAsRead: (id: string) => {
    const currentNotifications = get().notifications;
    const updatedNotifications = currentNotifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    const unreadCount = updatedNotifications.filter(n => !n.read).length;
    
    set({
      notifications: updatedNotifications,
      unreadNotificationsCount: unreadCount,
    });
  },

  markAllNotificationsAsRead: () => {
    const currentNotifications = get().notifications;
    const updatedNotifications = currentNotifications.map(notification => ({
      ...notification,
      read: true,
    }));
    
    set({
      notifications: updatedNotifications,
      unreadNotificationsCount: 0,
    });
  },

  removeNotification: (id: string) => {
    const currentNotifications = get().notifications;
    const updatedNotifications = currentNotifications.filter(n => n.id !== id);
    const unreadCount = updatedNotifications.filter(n => !n.read).length;
    
    set({
      notifications: updatedNotifications,
      unreadNotificationsCount: unreadCount,
    });
  },

  clearAllNotifications: () => {
    set({
      notifications: [],
      unreadNotificationsCount: 0,
    });
  },

  setOnlineStatus: (isOnline: boolean) => {
    set({ isOnline });
  },

  setTheme: (theme: 'light' | 'dark' | 'system') => {
    set({ theme });
  },

  setLanguage: (language: string) => {
    set({ language });
  },

  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    set({
      toastMessage: message,
      toastType: type,
    });

    // Auto hide toast after 3 seconds
    setTimeout(() => {
      set({
        toastMessage: null,
        toastType: null,
      });
    }, 3000);
  },

  hideToast: () => {
    set({
      toastMessage: null,
      toastType: null,
    });
  },

  setRefreshing: (refreshing: boolean) => {
    set({ isRefreshing: refreshing });
  },

  setActiveScreen: (screen: string) => {
    set({ activeScreen: screen });
  },
}));
