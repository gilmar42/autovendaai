"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Types matching the FastAPI backend schema
export interface ProfessionalInfo {
  specialty?: string;
  experience?: number;
  bio?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  professionalInfo?: ProfessionalInfo;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // We use a macrotask (setTimeout) instead of a microtask to ensure
    // React's hydration is fully complete before we trigger state changes.
    // This avoids both Next.js Hydration Mismatches and the React Compiler's
    // warning about synchronous state updates inside effects.
    const timer = setTimeout(() => {
      const storedToken = localStorage.getItem('vendai_token');
      const storedUser = localStorage.getItem('vendai_user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
        } catch (e) {
          console.error("Failed to parse user data from storage", e);
          localStorage.removeItem('vendai_user');
          localStorage.removeItem('vendai_token');
        }
      }
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('vendai_token', newToken);
    localStorage.setItem('vendai_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    
    // Redirect to dashboard after login if on an auth page
    if (pathname === '/login' || pathname === '/register') {
      router.push('/dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('vendai_token');
    localStorage.removeItem('vendai_user');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  const updateUser = (userData: User) => {
    localStorage.setItem('vendai_user', JSON.stringify(userData));
    setUser(userData);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
