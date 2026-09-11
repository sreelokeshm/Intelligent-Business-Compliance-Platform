import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Business, UserRole } from '../types.js';
import { api, setAuthToken, removeAuthToken, getAuthToken } from '../lib/api.js';

interface AuthContextType {
  user: User | null;
  business: Business | null;
  role: UserRole | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password?: string, role?: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  switchRoleDemo: (targetRole: UserRole) => Promise<void>;
  refreshProfile: () => Promise<void>;
  setBusiness: (business: Business) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [loading, setLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    try {
      if (getAuthToken()) {
        const res = await api.auth.me();
        setUser(res.user);
        setBusiness(res.business || null);
      } else {
        setUser(null);
        setBusiness(null);
      }
    } catch (err) {
      console.warn('Auth check failed:', err);
      removeAuthToken();
      setToken(null);
      setUser(null);
      setBusiness(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = async (email: string, password = 'password123', role?: string) => {
    setLoading(true);
    try {
      const res = await api.auth.login({ email, password, role });
      setAuthToken(res.token);
      setToken(res.token);
      setUser(res.user);
      // Fetch full profile and business
      const profile = await api.auth.me();
      setBusiness(profile.business || null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    try {
      const res = await api.auth.register(userData);
      setAuthToken(res.token);
      setToken(res.token);
      setUser(res.user);
      const profile = await api.auth.me();
      setBusiness(profile.business || null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // ignore
    }
    removeAuthToken();
    setToken(null);
    setUser(null);
    setBusiness(null);
  };

  // Instant 1-click role switcher for hackathon judges & testers
  const switchRoleDemo = async (targetRole: UserRole) => {
    let email = 'founder@novatech.com';
    let pass = 'business123';

    if (targetRole === 'admin') {
      email = 'admin@compliance.gov.in';
      pass = 'admin123';
    } else if (targetRole === 'department_staff') {
      email = 'staff.fire@compliance.gov.in';
      pass = 'staff123';
    } else if (targetRole === 'inspection_officer') {
      email = 'officer.rajesh@compliance.gov.in';
      pass = 'officer123';
    }

    await login(email, pass, targetRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        role: user?.role || null,
        token,
        loading,
        login,
        register,
        logout,
        switchRoleDemo,
        refreshProfile,
        setBusiness,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
