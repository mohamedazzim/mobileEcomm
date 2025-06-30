import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { Colors } from '@constants/Colors';
import { useAuthStore } from '@store/authStore';
import { useBookingStore } from '@store/bookingStore';
import { useUIStore } from '@store/uiStore';
import Header from '@components/common/Header';
import SummaryCard from '@components/dashboard/SummaryCard';
import RecentBookings from '@components/dashboard/RecentBookings';
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorMessage from '@components/common/ErrorMessage';

interface DashboardScreenProps {
  navigation: any;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { 
    dashboardStats, 
    fetchDashboardStats, 
    isLoading, 
    error,
    clearError 
  } = useBookingStore();
  const { isRefreshing, setRefreshing, setActiveScreen } = useUIStore();

  useEffect(() => {
    setActiveScreen('Dashboard');
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    await fetchDashboardStats();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleBookNow = () => {
    navigation.navigate('Book');
  };

  const handleViewAllBookings = () => {
    navigation.navigate('History');
  };

  const handleViewBookingDetails = (bookingId: string) => {
    navigation.navigate('BookingDetails', { bookingId });
  };

  if (isLoading && !dashboardStats) {
    return <LoadingSpinner />;
  }

  if (error && !dashboardStats) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Dashboard" />
        <ErrorMessage
          message={error}
          onRetry={() => {
            clearError();
            loadDashboardData();
          }}
        />
      </SafeAreaView>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Dashboard" />
      
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>
            {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}!
          </Text>
          <Text style={styles.welcomeSubtext}>
            Ready to book your next drone service?
          </Text>
        </View>

        {/* Quick Action */}
        <TouchableOpacity style={styles.quickActionCard} onPress={handleBookNow}>
          <View style={styles.quickActionContent}>
            <View style={styles.quickActionIcon}>
              <Feather name="plus-circle" size={32} color={Colors.white} />
            </View>
            <View style={styles.quickActionText}>
              <Text style={styles.quickActionTitle}>Book New Service</Text>
              <Text style={styles.quickActionSubtitle}>
                Schedule your drone service now
              </Text>
            </View>
            <Feather name="arrow-right" size={24} color={Colors.white} />
          </View>
        </TouchableOpacity>

        {/* Summary Cards */}
        {dashboardStats && (
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.summaryGrid}>
              <SummaryCard
                title="Total Bookings"
                value={dashboardStats.total_bookings.toString()}
                icon="calendar"
                color={Colors.primary}
              />
              <SummaryCard
                title="Pending"
                value={dashboardStats.pending_bookings.toString()}
                icon="clock"
                color={Colors.warning}
              />
              <SummaryCard
                title="Completed"
                value={dashboardStats.completed_bookings.toString()}
                icon="check-circle"
                color={Colors.success}
              />
              <SummaryCard
                title="Total Spent"
                value={`₹${dashboardStats.total_spent.toLocaleString()}`}
                icon="dollar-sign"
                color={Colors.secondary}
              />
            </View>
          </View>
        )}

        {/* Recent Bookings */}
        {dashboardStats?.upcoming_bookings && dashboardStats.upcoming_bookings.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
              <TouchableOpacity onPress={handleViewAllBookings}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <RecentBookings
              bookings={dashboardStats.upcoming_bookings}
              onBookingPress={handleViewBookingDetails}
            />
          </View>
        )}

        {/* Empty State */}
        {(!dashboardStats || dashboardStats.total_bookings === 0) && (
          <View style={styles.emptyState}>
            <Feather name="calendar" size={80} color={Colors.gray300} />
            <Text style={styles.emptyStateTitle}>No bookings yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Start by booking your first drone service
            </Text>
            <TouchableOpacity style={styles.emptyStateButton} onPress={handleBookNow}>
              <Text style={styles.emptyStateButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  quickActionCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  quickActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionIcon: {
    marginRight: 16,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  summarySection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recentSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DashboardScreen;
