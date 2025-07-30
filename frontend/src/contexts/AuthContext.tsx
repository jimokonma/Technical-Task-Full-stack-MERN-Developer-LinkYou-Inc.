'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '@/types';
import { authAPI } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { firstName?: string; lastName?: string }) => Promise<void>;
  refreshAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          // First, try to restore user from localStorage for immediate UI
          const user = JSON.parse(storedUser);
          setUser(user);

          // Then try to validate with the server in the background
          try {
            const response = await authAPI.getProfile();
            const freshUser = response.data.user;
            setUser(freshUser);
            localStorage.setItem('user', JSON.stringify(freshUser));
          } catch (serverError: any) {
            // If server returns 401, log out
            if (serverError?.response?.status === 401) {
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
              setUser(null);
            } else {
              // Don't log out the user if server is unreachable
              // The API interceptor will handle token expiration
              console.warn('Server validation failed, but keeping local session:', serverError);
            }
          }
        } else {
          // Explicitly set user to null if not found in localStorage
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Only clear storage if there's a parsing error
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { user, token, refreshToken } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await authAPI.register(credentials);
      const { user, token, refreshToken } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = async (data: { firstName?: string; lastName?: string }) => {
    try {
      const response = await authAPI.updateProfile(data);
      const updatedUser = response.data.user;
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Profile update failed');
    }
  };

  const refreshAuth = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return false;
      }

      const response = await authAPI.refreshToken(refreshToken);
      const { token, refreshToken: newRefreshToken } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 