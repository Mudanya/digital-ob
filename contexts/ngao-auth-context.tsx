'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { NgaoTokenPayload } from '@/lib/ngao-auth';

interface NgaoUser {
  id: string;
  name: string;
  serviceId: string;
  role: string;
  phone: string;
  email?: string | null;
  subCounty?: { id: string; name: string } | null;
  location?: { id: string; name: string } | null;
  subLocation?: { id: string; name: string } | null;
  lastLogin?: string | null;
}

interface NgaoAuthContextType {
  ngaoUser: NgaoUser | null;
  ngaoToken: string | null;
  login: (serviceId: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const NgaoAuthContext = createContext<NgaoAuthContextType | undefined>(undefined);

export function NgaoAuthProvider({ children }: { children: React.ReactNode }) {
  const [ngaoUser, setNgaoUser] = useState<NgaoUser | null>(null);
  const [ngaoToken, setNgaoToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('ngao_token');
    const storedUser = localStorage.getItem('ngao_user');
    if (storedToken && storedUser) {
      setNgaoToken(storedToken);
      setNgaoUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (serviceId: string, password: string) => {
    const res = await fetch('/api/ngao/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Login failed');
    }

    const { token, officer } = await res.json();
    setNgaoToken(token);
    setNgaoUser(officer);
    localStorage.setItem('ngao_token', token);
    localStorage.setItem('ngao_user', JSON.stringify(officer));
  };

  const logout = () => {
    setNgaoToken(null);
    setNgaoUser(null);
    localStorage.removeItem('ngao_token');
    localStorage.removeItem('ngao_user');
  };

  return (
    <NgaoAuthContext.Provider value={{ ngaoUser, ngaoToken, login, logout, isLoading }}>
      {children}
    </NgaoAuthContext.Provider>
  );
}

export function useNgaoAuth() {
  const ctx = useContext(NgaoAuthContext);
  if (!ctx) throw new Error('useNgaoAuth must be used within NgaoAuthProvider');
  return ctx;
}
