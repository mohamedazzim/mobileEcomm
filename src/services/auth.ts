import { apiService } from './api';
import { Config } from '@constants/Config';
import { User, ApiResponse } from '@types/index';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>(Config.endpoints.auth.login, credentials);
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>(Config.endpoints.auth.register, data);
  }

  async logout(): Promise<ApiResponse<void>> {
    return apiService.post<void>(Config.endpoints.auth.logout);
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return apiService.post<void>(Config.endpoints.auth.forgotPassword, { email });
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse<void>> {
    return apiService.post<void>(Config.endpoints.auth.resetPassword, {
      token,
      password,
    });
  }

  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return apiService.post<void>(Config.endpoints.auth.verifyEmail, { token });
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>(Config.endpoints.auth.refresh);
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return apiService.get<User>(Config.endpoints.user.profile);
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return apiService.put<User>(Config.endpoints.user.updateProfile, data);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiService.post<void>(Config.endpoints.user.changePassword, {
      currentPassword,
      newPassword,
    });
  }
}

export const authService = new AuthService();
