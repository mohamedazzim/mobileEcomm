import Constants from 'expo-constants';

const ENV = {
  dev: {
    apiUrl: 'http://localhost:8000',
    wsUrl: 'ws://localhost:8080',
  },
  staging: {
    apiUrl: 'https://staging-api.dronebooking.com',
    wsUrl: 'wss://staging-ws.dronebooking.com',
  },
  prod: {
    apiUrl: 'https://api.dronebooking.com',
    wsUrl: 'wss://ws.dronebooking.com',
  },
};

const getEnvVars = () => {
  if (__DEV__) {
    return ENV.dev;
  } else if (Constants.expoConfig?.releaseChannel === 'staging') {
    return ENV.staging;
  } else {
    return ENV.prod;
  }
};

export const Config = {
  ...getEnvVars(),
  
  // API endpoints
  endpoints: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      logout: '/api/auth/logout',
      refresh: '/api/auth/refresh',
      forgotPassword: '/api/auth/forgot-password',
      resetPassword: '/api/auth/reset-password',
      verifyEmail: '/api/auth/verify-email',
    },
    user: {
      profile: '/api/user/profile',
      updateProfile: '/api/user/profile',
      changePassword: '/api/user/change-password',
    },
    bookings: {
      list: '/api/bookings',
      create: '/api/bookings',
      update: '/api/bookings',
      delete: '/api/bookings',
      details: '/api/bookings',
    },
    drones: {
      list: '/api/drones',
      availability: '/api/drones/availability',
    },
    payment: {
      createOrder: '/api/payment/create-order',
      verify: '/api/payment/verify',
      history: '/api/payment/history',
    },
    dashboard: {
      stats: '/api/dashboard/stats',
    },
  },
  
  // App configuration
  app: {
    name: 'Drone Booking',
    version: '1.0.0',
    supportEmail: 'support@dronebooking.com',
    privacyPolicyUrl: 'https://dronebooking.com/privacy',
    termsUrl: 'https://dronebooking.com/terms',
  },
  
  // External services
  services: {
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    razorpayKeyId: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || '',
  },
  
  // Feature flags
  features: {
    pushNotifications: true,
    realTimeTracking: true,
    offlineMode: true,
    biometricAuth: true,
  },
  
  // Timeouts and limits
  timeouts: {
    api: 30000, // 30 seconds
    websocket: 5000, // 5 seconds
  },
  
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
};
