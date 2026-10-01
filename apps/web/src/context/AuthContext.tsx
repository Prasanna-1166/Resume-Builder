import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../services/api';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Only attempt profile verification if a token exists or in browser context
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    apiClient.getAdminMe()
      .then(res => {
        if (res.user) {
          setUser(res.user);
        } else {
          setUser(null);
          if (typeof window !== 'undefined') localStorage.removeItem('admin_token');
        }
      })
      .catch(() => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_token');
        }
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await apiClient.adminLogin(credentials);
    if (res.user) {
      setUser(res.user);
    }
  };

  const logout = async () => {
    await apiClient.adminLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: Boolean(user)
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
