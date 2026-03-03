import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface User {
  _id: string;
  userName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  register: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to set token cookie with 7-day expiration
const setTokenCookie = (token: string) => {
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const expires = `expires=${expirationDate.toUTCString()}`;
  document.cookie = `token=${token}; ${expires}; path=/; SameSite=Lax`;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user exists in localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    const token = localStorage.getItem("token");
    if (token) {
      setTokenCookie(token);
    }
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const register = (userData: User) => {
    const token = localStorage.getItem("token");
    if (token) {
      setTokenCookie(token);
    }
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
