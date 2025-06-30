import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { Colors } from '@constants/Colors';
import { useAuthStore } from '@store/authStore';
import { useUIStore } from '@store/uiStore';
import { User } from '@types/index';
import Header from '@components/common/Header';
import Input from '@components/common/Input';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import { validateEmail, validatePhone } from '@utils/validation';

interface EditProfileScreenProps {
  navigation: any;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const { user, updateProfile, changePassword, isLoading } = useAuthStore();
  const { showToast } = useUIStore();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const validateProfileForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!validateProfileForm()) return;

    const updatedData: Partial<User> = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
    };

    const success = await updateProfile(updatedData);
    
    if (success) {
      showToast('Profile updated successfully!', 'success');
      navigation.goBack();
    } else {
      showToast('Failed to update profile. Please try again.', 'error');
    }
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;

    const success = await changePassword(
      passwordData.currentPassword,
      passwordData.newPassword
    );
    
    if (success) {
      showToast('Password changed successfully!', 'success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
    } else {
      showToast('Failed to change password. Please check your current password.', 'error');
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updatePasswordData = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const hasProfileChanges = () => {
    if (!user) return false;
    return (
      formData.name !== (user.name || '') ||
      formData.email !== (user.email || '') ||
      formData.phone !== (user.phone || '')
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Edit Profile" 
        showBack 
        onBack={() => navigation.goBack()} 
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Picture Section */}
          <Card style={styles.avatarCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {formData.name?.charAt(0)?.toUpperCase() || 'U'}
                </Text>
              </View>
              <TouchableOpacity style={styles.changePhotoButton}>
                <Feather name="camera" size={16} color={Colors.primary} />
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Profile Information */}
          <Card style={styles.formCard}>
            <Text style={styles.cardTitle}>Profile Information</Text>
            
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              autoCapitalize="words"
              leftIcon="user"
              error={errors.name}
            />

            <Input
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail"
              error={errors.email}
            />

            <Input
              label="Phone Number"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={(value) => updateFormData('phone', value)}
              keyboardType="phone-pad"
              leftIcon="phone"
              error={errors.phone}
            />

            <Button
              title="Update Profile"
              onPress={handleUpdateProfile}
              loading={isLoading}
              disabled={!hasProfileChanges()}
              style={styles.updateButton}
            />
          </Card>

          {/* Password Section */}
          <Card style={styles.passwordCard}>
            <View style={styles.passwordHeader}>
              <Text style={styles.cardTitle}>Security</Text>
              <TouchableOpacity
                onPress={() => setShowPasswordForm(!showPasswordForm)}
                style={styles.toggleButton}
              >
                <Text style={styles.toggleButtonText}>
                  {showPasswordForm ? 'Cancel' : 'Change Password'}
                </Text>
                <Feather 
                  name={showPasswordForm ? 'x' : 'edit-2'} 
                  size={16} 
                  color={Colors.primary} 
                />
              </TouchableOpacity>
            </View>

            {!showPasswordForm ? (
              <View style={styles.passwordInfo}>
                <View style={styles.passwordRow}>
                  <Feather name="lock" size={20} color={Colors.textSecondary} />
                  <View style={styles.passwordContent}>
                    <Text style={styles.passwordLabel}>Password</Text>
                    <Text style={styles.passwordValue}>••••••••</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.passwordForm}>
                <Input
                  label="Current Password"
                  placeholder="Enter your current password"
                  value={passwordData.currentPassword}
                  onChangeText={(value) => updatePasswordData('currentPassword', value)}
                  secureTextEntry={!showPasswords.current}
                  leftIcon="lock"
                  rightIcon={showPasswords.current ? "eye-off" : "eye"}
                  onRightIconPress={() => togglePasswordVisibility('current')}
                  error={errors.currentPassword}
                />

                <Input
                  label="New Password"
                  placeholder="Enter your new password"
                  value={passwordData.newPassword}
                  onChangeText={(value) => updatePasswordData('newPassword', value)}
                  secureTextEntry={!showPasswords.new}
                  leftIcon="lock"
                  rightIcon={showPasswords.new ? "eye-off" : "eye"}
                  onRightIconPress={() => togglePasswordVisibility('new')}
                  error={errors.newPassword}
                />

                <Input
                  label="Confirm New Password"
                  placeholder="Confirm your new password"
                  value={passwordData.confirmPassword}
                  onChangeText={(value) => updatePasswordData('confirmPassword', value)}
                  secureTextEntry={!showPasswords.confirm}
                  leftIcon="lock"
                  rightIcon={showPasswords.confirm ? "eye-off" : "eye"}
                  onRightIconPress={() => togglePasswordVisibility('confirm')}
                  error={errors.confirmPassword}
                />

                <Button
                  title="Change Password"
                  onPress={handleChangePassword}
                  loading={isLoading}
                  style={styles.changePasswordButton}
                />
              </View>
            )}
          </Card>

          {/* Account Status */}
          <Card style={styles.statusCard}>
            <Text style={styles.cardTitle}>Account Status</Text>
            
            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <Feather name="check-circle" size={20} color={Colors.success} />
                <Text style={styles.statusText}>Email Verified</Text>
              </View>
              {user?.verified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>

            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <Feather name="calendar" size={20} color={Colors.textSecondary} />
                <Text style={styles.statusText}>
                  Member since {new Date(user?.created_at || '').getFullYear()}
                </Text>
              </View>
            </View>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
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
  avatarCard: {
    marginTop: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  changePhotoText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 6,
  },
  formCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  updateButton: {
    marginTop: 8,
  },
  passwordCard: {
    marginBottom: 16,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 14,
    color: Colors.primary,
    marginRight: 4,
  },
  passwordInfo: {
    paddingVertical: 8,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordContent: {
    marginLeft: 12,
  },
  passwordLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  passwordValue: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  passwordForm: {
    paddingTop: 8,
  },
  changePasswordButton: {
    marginTop: 8,
  },
  statusCard: {
    marginBottom: 32,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  verifiedBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '500',
  },
});

export default EditProfileScreen;
