import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@constants/Colors';
import Card from '@components/common/Card';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  onPress?: () => void;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  color,
  onPress,
  subtitle,
  trend,
}) => {
  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
            <Feather name={icon} size={20} color={color} />
          </View>
          {trend && (
            <View style={styles.trendContainer}>
              <Feather
                name={trend.isPositive ? 'trending-up' : 'trending-down'}
                size={14}
                color={trend.isPositive ? Colors.success : Colors.error}
              />
              <Text
                style={[
                  styles.trendText,
                  {
                    color: trend.isPositive ? Colors.success : Colors.error,
                  },
                ]}
              >
                {trend.value}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.content}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
        </View>
        
        {onPress && (
          <View style={styles.footer}>
            <Text style={styles.viewMore}>View details</Text>
            <Feather name="arrow-right" size={14} color={Colors.primary} />
          </View>
        )}
      </Card>
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: 12,
  },
  card: {
    padding: 16,
    height: 120,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  viewMore: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
});

export default SummaryCard;
