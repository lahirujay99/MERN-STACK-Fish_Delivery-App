import { createContext, useContext, useState, useEffect } from "react";
import instance from "../utils/axiosConfig";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  console.log("AuthProvider is rendering, setUser:", setUser);

  useEffect(() => {
    const initializeAuth = async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        try {
          const response = await instance.get("/auth/profile");
          setUser(response.data);
        } catch (error) {
          console.error("Token validation failed:", error);
          logout();
        }
      }
    };
    initializeAuth();
  }, []);

  const login = (token, userData, rememberMe) => {
    if (rememberMe) {
      localStorage.setItem("token", token);
    } else {
      sessionStorage.setItem("token", token);
    }
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);