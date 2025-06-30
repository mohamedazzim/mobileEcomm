import React from 'react';
import { View, Text } from 'react-native';

export default function App() {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1e3a8a',
    }}>
      <Text style={{
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
      }}>
        DroneBooking App
      </Text>
      <Text style={{
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
      }}>
        React Native is Working!
      </Text>
    </View>
  );
}
