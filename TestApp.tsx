import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from './src/constants/Colors';

const TestApp: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>DroneBooking App</Text>
      <Text style={styles.subtitle}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default TestApp;