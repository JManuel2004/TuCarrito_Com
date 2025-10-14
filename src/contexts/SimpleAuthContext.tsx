import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { LocalUser, localStorageService } from '../lib/localStorageService';

interface AuthContextType {
  user: LocalUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    idNumber: string;
    userType: 'buyer' | 'seller' | 'both';
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SimpleAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario al inicializar
    const currentUser = localStorageService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await localStorageService.login(email, password);
    
    if (result.success && result.user) {
      setUser(result.user);
    }
    
    return { success: result.success, message: result.message };
  };

  const register = async (userData: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    idNumber: string;
    userType: 'buyer' | 'seller' | 'both';
  }) => {
    const result = await localStorageService.register(userData);
    return { success: result.success, message: result.message };
  };

  const logout = () => {
    localStorageService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSimpleAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
}