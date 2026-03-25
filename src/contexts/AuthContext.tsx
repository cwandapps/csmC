import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { api } from "@/lib/api";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  organizationType: string;
  organizationId: number;
  role: string;
  isPrimary: boolean;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationName: string;
  organizationType: "school" | "company";
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("csms_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.login(email, password);
    localStorage.setItem("csms_token", res.token);
    localStorage.setItem("csms_user", JSON.stringify(res.user));
    setUser(res.user);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const res = await api.register(data);
    localStorage.setItem("csms_token", res.token);
    localStorage.setItem("csms_user", JSON.stringify(res.user));
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("csms_token");
    localStorage.removeItem("csms_user");
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await api.getMe();
      localStorage.setItem("csms_user", JSON.stringify(userData));
      setUser(userData);
    } catch {
      logout();
    }
  }, [logout]);

  // Validate token on mount
  useEffect(() => {
    const token = localStorage.getItem("csms_token");
    if (token && user) {
      setLoading(true);
      api.getMe()
        .then((userData) => {
          localStorage.setItem("csms_user", JSON.stringify(userData));
          setUser(userData);
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
