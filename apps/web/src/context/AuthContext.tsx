import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../services/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
  lastLoginAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('auth_token') ||
          localStorage.getItem('user_token') ||
          localStorage.getItem('admin_token')
        : null;

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await apiClient.getMe();
      if (res?.user) {
        setUser(res.user);
      } else {
        setUser(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_token');
          localStorage.removeItem('admin_token');
        }
      }
    } catch {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_token');
        localStorage.removeItem('admin_token');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await apiClient.login(credentials);
    if (res?.user) {
      setUser(res.user);
    }
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    const res = await apiClient.register(data);
    if (res?.user) {
      setUser(res.user);
    }
  };

  const logout = async () => {
    await apiClient.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  const isAdmin = Boolean(user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'));

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: Boolean(user),
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
