import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthStore } from '@store/authStore';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import BookingDetailsScreen from '@screens/booking/BookingDetailsScreen';
import EditProfileScreen from '@screens/profile/EditProfileScreen';

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen 
            name="BookingDetails" 
            component={BookingDetailsScreen}
            options={{
              headerShown: true,
              title: 'Booking Details',
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen 
            name="EditProfile" 
            component={EditProfileScreen}
            options={{
              headerShown: true,
              title: 'Edit Profile',
              headerBackTitle: 'Back',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
