import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SECURE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  BIOMETRIC_ENABLED: 'biometric_enabled',
};

const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  OFFLINE_DATA: 'offline_data',
  CACHED_BOOKINGS: 'cached_bookings',
  NOTIFICATIONS: 'notifications',
};

// Secure storage methods (for sensitive data)
export const storeToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(SECURE_KEYS.TOKEN, token);
  } catch (error) {
    console.error('Error storing token:', error);
    throw error;
  }
};

export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(SECURE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeStoredToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(SECURE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

export const storeRefreshToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(SECURE_KEYS.REFRESH_TOKEN, token);
  } catch (error) {
    console.error('Error storing refresh token:', error);
    throw error;
  }
};

export const getStoredRefreshToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(SECURE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

export const removeStoredRefreshToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(SECURE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error removing refresh token:', error);
  }
};

// Regular storage methods (for non-sensitive data)
export const storeData = async (key: string, data: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error storing data for key ${key}:`, error);
    throw error;
  }
};

export const getData = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error getting data for key ${key}:`, error);
    return null;
  }
};

export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
    await SecureStore.deleteItemAsync(SECURE_KEYS.TOKEN);
    await SecureStore.deleteItemAsync(SECURE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};

// User preferences
export const storeUserPreferences = async (preferences: any): Promise<void> => {
  return storeData(STORAGE_KEYS.USER_PREFERENCES, preferences);
};

export const getUserPreferences = async (): Promise<any> => {
  return getData(STORAGE_KEYS.USER_PREFERENCES);
};

// Offline data
export const storeOfflineData = async (data: any): Promise<void> => {
  return storeData(STORAGE_KEYS.OFFLINE_DATA, data);
};

export const getOfflineData = async (): Promise<any> => {
  return getData(STORAGE_KEYS.OFFLINE_DATA);
};

// Cached bookings
export const storeCachedBookings = async (bookings: any[]): Promise<void> => {
  return storeData(STORAGE_KEYS.CACHED_BOOKINGS, bookings);
};

export const getCachedBookings = async (): Promise<any[]> => {
  const bookings = await getData(STORAGE_KEYS.CACHED_BOOKINGS);
  return bookings || [];
};

// Notifications
export const storeNotifications = async (notifications: any[]): Promise<void> => {
  return storeData(STORAGE_KEYS.NOTIFICATIONS, notifications);
};

export const getNotifications = async (): Promise<any[]> => {
  const notifications = await getData(STORAGE_KEYS.NOTIFICATIONS);
  return notifications || [];
};

// Biometric settings
export const setBiometricEnabled = async (enabled: boolean): Promise<void> => {
  try {
    await SecureStore.setItemAsync(SECURE_KEYS.BIOMETRIC_ENABLED, enabled.toString());
  } catch (error) {
    console.error('Error setting biometric enabled:', error);
  }
};

export const isBiometricEnabled = async (): Promise<boolean> => {
  try {
    const value = await SecureStore.getItemAsync(SECURE_KEYS.BIOMETRIC_ENABLED);
    return value === 'true';
  } catch (error) {
    console.error('Error getting biometric enabled:', error);
    return false;
  }
};
