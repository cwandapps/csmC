import React, { createContext, useContext, useState, useCallback } from "react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  role: string;
  avatar?: string;
  trialEndsAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
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

const DEMO_USER: User = {
  id: "1",
  email: "admin@csms.io",
  firstName: "Alex",
  lastName: "Morgan",
  organizationName: "TechCorp Academy",
  role: "admin",
  trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("csms_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (_email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    setUser(DEMO_USER);
    localStorage.setItem("csms_user", JSON.stringify(DEMO_USER));
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    await new Promise((r) => setTimeout(r, 800));
    const newUser: User = {
      ...DEMO_USER,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      organizationName: data.organizationName,
    };
    setUser(newUser);
    localStorage.setItem("csms_user", JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("csms_user");
  }, []);

  const forgotPassword = useCallback(async (_email: string) => {
    await new Promise((r) => setTimeout(r, 800));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
