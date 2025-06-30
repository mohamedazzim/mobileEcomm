import { useEffect, useState } from 'react';
import { useAuthStore } from '@store/authStore';
import { User } from '@types/index';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    changePassword,
    initializeAuth,
  } = useAuthStore();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      if (!isInitialized) {
        await initializeAuth();
        setIsInitialized(true);
      }
    };

    initialize();
  }, [initializeAuth, isInitialized]);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      return await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleRegister = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<boolean> => {
    try {
      return await register(name, email, password, phone);
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleForgotPassword = async (email: string): Promise<boolean> => {
    try {
      return await forgotPassword(email);
    } catch (error) {
      console.error('Forgot password error:', error);
      return false;
    }
  };

  const handleResetPassword = async (token: string, password: string): Promise<boolean> => {
    try {
      return await resetPassword(token, password);
    } catch (error) {
      console.error('Reset password error:', error);
      return false;
    }
  };

  const handleUpdateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      return await updateProfile(data);
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    try {
      return await changePassword(currentPassword, newPassword);
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  };

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    isInitialized,

    // Actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
    updateProfile: handleUpdateProfile,
    changePassword: handleChangePassword,

    // Utils
    isLoggedIn: isAuthenticated && !!user,
    isAdmin: user?.role === 'admin',
    userName: user?.name || 'User',
    userEmail: user?.email || '',
    userPhone: user?.phone || '',
    isVerified: user?.verified || false,
  };
};

export default useAuth;
