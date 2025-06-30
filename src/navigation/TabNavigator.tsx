import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

import { Colors } from '@constants/Colors';
import { useUIStore } from '@store/uiStore';
import DashboardScreen from '@screens/home/DashboardScreen';
import BookingScreen from '@screens/booking/BookingScreen';
import BookingHistoryScreen from '@screens/booking/BookingHistoryScreen';
import MapScreen from '@screens/map/MapScreen';
import ProfileScreen from '@screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  const { unreadNotificationsCount } = useUIStore();

  const renderTabIcon = (name: string, focused: boolean, size: number) => {
    let iconName: keyof typeof Feather.glyphMap;

    switch (name) {
      case 'Dashboard':
        iconName = 'home';
        break;
      case 'Book':
        iconName = 'plus-circle';
        break;
      case 'History':
        iconName = 'clock';
        break;
      case 'Map':
        iconName = 'map';
        break;
      case 'Profile':
        iconName = 'user';
        break;
      default:
        iconName = 'home';
    }

    return (
      <View style={styles.tabIconContainer}>
        <Feather
          name={iconName}
          size={size}
          color={focused ? Colors.primary : Colors.gray400}
        />
        {name === 'Profile' && unreadNotificationsCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => renderTabIcon(route.name, focused, size),
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray400,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Book" 
        component={BookingScreen}
        options={{ title: 'Book Drone' }}
      />
      <Tab.Screen 
        name="History" 
        component={BookingHistoryScreen}
        options={{ title: 'My Bookings' }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{ title: 'Live Map' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default TabNavigator;
