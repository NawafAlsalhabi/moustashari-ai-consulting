import React, { createContext, useContext, useEffect } from 'react';
import { useGetMe, useLogin, useLogout } from '@workspace/api-client-react';
import type { User, LoginInput } from '@workspace/api-client-react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, refetch } = useGetMe({ 
    query: { 
      retry: false,
      staleTime: Infinity 
    } 
  });
  
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const login = async (data: LoginInput) => {
    const response = await loginMutation.mutateAsync({ data });
    if (response.token) {
      localStorage.setItem('moustashari_token', response.token);
      await refetch();
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      localStorage.removeItem('moustashari_token');
      await refetch();
    }
  };

  return (
    <AuthContext.Provider value={{ user: user || null, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
