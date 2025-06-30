import { useEffect, useCallback, useRef } from 'react';
import { webSocketService } from '@services/websocket';
import { useAuthStore } from '@store/authStore';
import { useUIStore } from '@store/uiStore';
import { useBookingStore } from '@store/bookingStore';

type EventCallback = (data: any) => void;

export const useWebSocket = () => {
  const { isAuthenticated } = useAuthStore();
  const { addNotification, setOnlineStatus } = useUIStore();
  const { fetchBookings, fetchDashboardStats } = useBookingStore();
  
  const listenersRef = useRef<Map<string, EventCallback[]>>(new Map());
  const isConnectedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated) {
      connectWebSocket();
    } else {
      disconnectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [isAuthenticated]);

  const connectWebSocket = useCallback(async () => {
    try {
      await webSocketService.connect();
      
      // Set up default event listeners
      webSocketService.on('connected', handleConnected);
      webSocketService.on('disconnected', handleDisconnected);
      webSocketService.on('error', handleError);
      webSocketService.on('booking_update', handleBookingUpdate);
      webSocketService.on('notification', handleNotification);
      webSocketService.on('maxReconnectAttemptsReached', handleMaxReconnectAttempts);
      
      isConnectedRef.current = true;
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setOnlineStatus(false);
    }
  }, []);

  const disconnectWebSocket = useCallback(() => {
    webSocketService.disconnect();
    isConnectedRef.current = false;
    setOnlineStatus(false);
  }, []);

  const handleConnected = useCallback(() => {
    console.log('WebSocket connected');
    setOnlineStatus(true);
  }, [setOnlineStatus]);

  const handleDisconnected = useCallback(() => {
    console.log('WebSocket disconnected');
    setOnlineStatus(false);
    isConnectedRef.current = false;
  }, [setOnlineStatus]);

  const handleError = useCallback((error: any) => {
    console.error('WebSocket error:', error);
    setOnlineStatus(false);
  }, [setOnlineStatus]);

  const handleBookingUpdate = useCallback(async (data: any) => {
    console.log('Booking update received:', data);
    
    // Refresh booking data
    await fetchBookings();
    await fetchDashboardStats();
    
    // Show notification for booking updates
    if (data.message) {
      addNotification({
        id: Date.now().toString(),
        title: 'Booking Update',
        body: data.message,
        type: 'booking',
        booking_id: data.booking_id,
        read: false,
        created_at: new Date().toISOString(),
      });
    }
  }, [fetchBookings, fetchDashboardStats, addNotification]);

  const handleNotification = useCallback((data: any) => {
    console.log('Notification received:', data);
    
    addNotification({
      id: data.id || Date.now().toString(),
      title: data.title || 'New Notification',
      body: data.body || data.message || '',
      type: data.type || 'general',
      booking_id: data.booking_id,
      read: false,
      created_at: data.created_at || new Date().toISOString(),
    });
  }, [addNotification]);

  const handleMaxReconnectAttempts = useCallback(() => {
    console.error('Max WebSocket reconnection attempts reached');
    setOnlineStatus(false);
    // Could show a user-friendly message here
  }, [setOnlineStatus]);

  const subscribe = useCallback((event: string, callback: EventCallback) => {
    webSocketService.on(event, callback);
    
    // Keep track of custom listeners for cleanup
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, []);
    }
    listenersRef.current.get(event)!.push(callback);
  }, []);

  const unsubscribe = useCallback((event: string, callback?: EventCallback) => {
    if (callback) {
      webSocketService.off(event, callback);
      
      // Remove from custom listeners
      const listeners = listenersRef.current.get(event);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    } else {
      webSocketService.off(event);
      listenersRef.current.delete(event);
    }
  }, []);

  const send = useCallback((type: string, data: any) => {
    if (webSocketService.isConnected) {
      webSocketService.send(type, data);
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  const reconnect = useCallback(() => {
    disconnectWebSocket();
    setTimeout(() => {
      connectWebSocket();
    }, 1000);
  }, [connectWebSocket, disconnectWebSocket]);

  // Cleanup custom listeners on unmount
  useEffect(() => {
    return () => {
      for (const [event, callbacks] of listenersRef.current.entries()) {
        callbacks.forEach(callback => {
          webSocketService.off(event, callback);
        });
      }
      listenersRef.current.clear();
    };
  }, []);

  return {
    isConnected: webSocketService.isConnected,
    subscribe,
    unsubscribe,
    send,
    reconnect,
    
    // Utility methods
    sendBookingUpdate: (bookingId: string, data: any) => {
      send('booking_update', { booking_id: bookingId, ...data });
    },
    
    sendChatMessage: (message: string, bookingId?: string) => {
      send('chat_message', { message, booking_id: bookingId });
    },
    
    requestDroneStatus: (droneId?: string) => {
      send('drone_status_request', { drone_id: droneId });
    },
    
    // Real-time subscriptions
    subscribeToBookingUpdates: (callback: EventCallback) => {
      subscribe('booking_update', callback);
    },
    
    subscribeToDroneStatus: (callback: EventCallback) => {
      subscribe('drone_status', callback);
    },
    
    subscribeToNotifications: (callback: EventCallback) => {
      subscribe('notification', callback);
    },
    
    subscribeToChatMessages: (callback: EventCallback) => {
      subscribe('chat_message', callback);
    },
  };
};

export default useWebSocket;
