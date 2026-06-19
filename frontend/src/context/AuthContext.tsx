import { createContext, useContext, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { loginUser, registerUser, type LoginPayload, type RegisterPayload } from '../api/auth';
import type { User } from '../types';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): User | null {
  const value = localStorage.getItem('ethara_user');
  if (!value) return null;

  try {
    return JSON.parse(value) as User;
  } catch {
    localStorage.removeItem('ethara_user');
    return null;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(() => readStoredUser());
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ethara_token'));

  const persistSession = (nextToken: string, nextUser: User) => {
    localStorage.setItem('ethara_token', nextToken);
    localStorage.setItem('ethara_user', JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login: async (payload) => {
        const response = await loginUser(payload);
        persistSession(response.access_token, response.user);
      },
      register: async (payload) => {
        const response = await registerUser(payload);
        persistSession(response.access_token, response.user);
      },
      logout: () => {
        localStorage.removeItem('ethara_token');
        localStorage.removeItem('ethara_user');
        setToken(null);
        setUser(null);
      },
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
