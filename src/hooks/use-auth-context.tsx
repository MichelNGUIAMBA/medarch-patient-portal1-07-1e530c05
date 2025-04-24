
import React, { createContext, useContext, useState, useEffect } from "react";

type UserRole = "admin" | "secretary" | "nurse" | "lab" | "doctor";

interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Simulate checking for stored auth on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("medArchUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Mock login function (to be replaced with real auth)
  const login = async (email: string, password: string) => {
    // This is a mock - would be replaced with actual API authentication
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock users for demonstration
      const mockUsers: Record<string, User> = {
        "admin@medarch.com": {
          id: "1",
          name: "Admin Principal",
          role: "admin"
        },
        "secretary@medarch.com": {
          id: "2",
          name: "Marie Secrétaire",
          role: "secretary"
        },
        "nurse@medarch.com": {
          id: "3",
          name: "Jean Infirmier",
          role: "nurse"
        },
        "lab@medarch.com": {
          id: "4",
          name: "Lucie Laboratoire",
          role: "lab"
        },
        "doctor@medarch.com": {
          id: "5",
          name: "Dr. Robert",
          role: "doctor"
        }
      };

      if (email in mockUsers && password === "password") {
        const loggedInUser = mockUsers[email];
        setUser(loggedInUser);
        setIsAuthenticated(true);
        localStorage.setItem("medArchUser", JSON.stringify(loggedInUser));
        return;
      }
      
      throw new Error("Identifiants invalides");
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("medArchUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé avec AuthProvider");
  }
  return context;
};
