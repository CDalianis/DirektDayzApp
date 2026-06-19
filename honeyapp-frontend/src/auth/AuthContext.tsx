import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { authApi } from '../api/directdayzapp';

interface AuthContextValue {
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<string>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(() => localStorage.getItem('role'));

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      role,
      isAuthenticated: !!token,
      login: async (username, password) => {
        const response = await authApi.login(username, password);
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        setToken(response.token);
        setRole(response.role);
        return response.role;
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setToken(null);
        setRole(null);
      },
    }),
    [token, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
