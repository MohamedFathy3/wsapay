/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import { tokenService } from "@/services/token.service";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // ✅ دالة جلب المستخدم - استخدم authService.checkAuth()
  const fetchUser = async () => {
    try {
      const userData = await authService.checkAuth();
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
        return userData;
      } else {
        tokenService.removeToken();
        setUser(null);
        setIsAuthenticated(false);
        return null;
      }
    } catch (error: any) {
      console.error("Error fetching user:", error);
      throw error;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const userData = await authService.checkAuth();

        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          tokenService.removeToken();
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        tokenService.removeToken();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await authService.login(email, password);
      setUser(result.user);
      setIsAuthenticated(true);

      return result;
    } catch (err: any) {
      setError(err.message || "Login failed");
      setIsAuthenticated(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    navigate({ to: "/" });
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    refreshUser: fetchUser,
  };
};
