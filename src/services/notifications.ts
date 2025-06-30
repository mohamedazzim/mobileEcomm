import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { apiService } from './api';
import { Config } from '@constants/Config';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  private expoPushToken: string | null = null;

  async initializeNotifications(): Promise<void> {
    if (!Config.features.pushNotifications) {
      return;
    }

    try {
      // Request permissions
      await this.requestPermissions();
      
      // Get push token
      const token = await this.getPushToken();
      if (token) {
        this.expoPushToken = token;
        // Register token with backend
        await this.registerPushToken(token);
      }

      // Set up notification listeners
      this.setupNotificationListeners();
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  private async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.warn('Push notifications don\'t work on simulator');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
      return false;
    }

    // Android specific channel setup
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });

      // Booking notifications channel
      await Notifications.setNotificationChannelAsync('booking', {
        name: 'Booking Updates',
        description: 'Notifications about your drone bookings',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#1e3a8a',
      });

      // Payment notifications channel
      await Notifications.setNotificationChannelAsync('payment', {
        name: 'Payment Updates',
        description: 'Notifications about payment status',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#10b981',
      });
    }

    return true;
  }

  private async getPushToken(): Promise<string | null> {
    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-expo-project-id', // Replace with your actual project ID
      });
      return token.data;
    } catch (error) {
      console.error('Failed to get push token:', error);
      return null;
    }
  }

  private async registerPushToken(token: string): Promise<void> {
    try {
      await apiService.post('/api/user/push-token', {
        token,
        platform: Platform.OS,
      });
    } catch (error) {
      console.error('Failed to register push token:', error);
    }
  }

  private setupNotificationListeners(): void {
    // Handle notifications received while app is foregrounded
    Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
      // Handle foreground notification
      this.handleForegroundNotification(notification);
    });

    // Handle notification taps
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification tapped:', response);
      // Handle notification tap
      this.handleNotificationTap(response);
    });
  }

  private handleForegroundNotification(notification: Notifications.Notification): void {
    // Show in-app notification or update UI
    // This can be handled by the UI store
  }

  private handleNotificationTap(response: Notifications.NotificationResponse): void {
    const data = response.notification.request.content.data;
    
    // Navigate based on notification type
    if (data.type === 'booking' && data.booking_id) {
      // Navigate to booking details
      // This will be handled by the navigation service
    } else if (data.type === 'payment' && data.payment_id) {
      // Navigate to payment details
    }
  }

  async scheduleLocalNotification(
    title: string,
    body: string,
    data?: any,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
      },
      trigger: trigger || null,
    });
  }

  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }

  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  async clearBadge(): Promise<void> {
    await Notifications.setBadgeCountAsync(0);
  }

  // Send notification to specific user (admin only)
  async sendNotificationToUser(
    userId: string,
    title: string,
    body: string,
    data?: any
  ): Promise<void> {
    try {
      await apiService.post('/api/admin/send-notification', {
        userId,
        title,
        body,
        data,
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  // Send bulk notifications (admin only)
  async sendBulkNotification(
    userIds: string[],
    title: string,
    body: string,
    data?: any
  ): Promise<void> {
    try {
      await apiService.post('/api/admin/send-bulk-notification', {
        userIds,
        title,
        body,
        data,
      });
    } catch (error) {
      console.error('Failed to send bulk notification:', error);
    }
  }

  get pushToken(): string | null {
    return this.expoPushToken;
  }
}

export const notificationService = new NotificationService();

// Initialize notifications
export const initializeNotifications = () => {
  return notificationService.initializeNotifications();
};
