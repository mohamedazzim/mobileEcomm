import { create } from 'zustand';
import { User, AuthState } from '@types/index';
import { authService } from '@services/auth';
import { storeToken, getStoredToken, removeStoredToken } from '@services/storage';
import { webSocketService } from '@services/websocket';

interface AuthStore extends AuthState {
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  initializeAuth: () => Promise<void>;
  clearAuthState: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  // Actions
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    
    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Store token securely
        await storeToken(token);
        
        // Update state
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        // Connect to WebSocket
        webSocketService.connect();
        
        return true;
      } else {
        set({ isLoading: false });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      set({ isLoading: false });
      return false;
    }
  },

  register: async (name: string, email: string, password: string, phone?: string) => {
    set({ isLoading: true });
    
    try {
      const response = await authService.register({ name, email, password, phone });
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Store token securely
        await storeToken(token);
        
        // Update state
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        // Connect to WebSocket
        webSocketService.connect();
        
        return true;
      } else {
        set({ isLoading: false });
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      set({ isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    
    try {
      // Call logout API
      await authService.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear stored token
      await removeStoredToken();
      
      // Clear state
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });

      // Disconnect WebSocket
      webSocketService.disconnect();
    }
  },

  forgotPassword: async (email: string) => {
    set({ isLoading: true });
    
    try {
      const response = await authService.forgotPassword(email);
      set({ isLoading: false });
      return response.success;
    } catch (error) {
      console.error('Forgot password error:', error);
      set({ isLoading: false });
      return false;
    }
  },

  resetPassword: async (token: string, password: string) => {
    set({ isLoading: true });
    
    try {
      const response = await authService.resetPassword(token, password);
      set({ isLoading: false });
      return response.success;
    } catch (error) {
      console.error('Reset password error:', error);
      set({ isLoading: false });
      return false;
    }
  },

  updateProfile: async (data: Partial<User>) => {
    set({ isLoading: true });
    
    try {
      const response = await authService.updateProfile(data);
      
      if (response.success && response.data) {
        set({
          user: response.data,
          isLoading: false,
        });
        return true;
      } else {
        set({ isLoading: false });
        return false;
      }
    } catch (error) {
      console.error('Update profile error:', error);
      set({ isLoading: false });
      return false;
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    set({ isLoading: true });
    
    try {
      const response = await authService.changePassword(currentPassword, newPassword);
      set({ isLoading: false });
      return response.success;
    } catch (error) {
      console.error('Change password error:', error);
      set({ isLoading: false });
      return false;
    }
  },

  initializeAuth: async () => {
    set({ isLoading: true });
    
    try {
      const token = await getStoredToken();
      
      if (token) {
        // Validate token by fetching user profile
        const response = await authService.getProfile();
        
        if (response.success && response.data) {
          set({
            user: response.data,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Connect to WebSocket
          webSocketService.connect();
        } else {
          // Token is invalid, clear it
          await removeStoredToken();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Initialize auth error:', error);
      // Clear potentially invalid token
      await removeStoredToken();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearAuthState: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
