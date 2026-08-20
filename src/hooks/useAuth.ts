/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from "react";
import { authService } from "@/services/auth.service";
import { tokenService } from "@/services/token.service";
import type { User } from "@/types/auth.types";

interface UseAuthReturn {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  role: string | null;
  checkAuth: () => Promise<void>; // ✅ دالة للتحقق
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ دالة التحقق من المصادقة
  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = tokenService.getToken();
      if (token) {
        setToken(token);
        // ✅ استخدم checkAuth من الخدمة
        const userData = await authService.checkAuth();
        if (userData) {
          setUser(userData);
          console.log("✅ User authenticated:", userData.email);
        } else {
          // لو فشل التحقق، نمسح التوكن
          tokenService.removeToken();
          setUser(null);
          setToken(null);
        }
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("❌ Auth check error:", error);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ تحميل المستخدم عند بدء التطبيق
  useEffect(() => {
    const loadUser = async () => {
      await checkAuth();
    };
    loadUser();
  }, [checkAuth]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { user, token } = await authService.login(email, password);
      setUser(user);
      setToken(token);
      console.log("✅ Login successful, role:", user.role);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message?.message ||
        err.response?.data?.message ||
        err.message ||
        "Login failed";
      setError(errorMessage);
      console.error("❌ Login error:", errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    console.log("🚪 Logging out...");
    authService.logout();
    setUser(null);
    setToken(null);
    setError(null);
  }, []);

  const isAuthenticated = authService.isAuthenticated();
  const role = user?.role || null;

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    error,
    role,
    checkAuth, // ✅ إرجاع دالة التحقق
  };
};
