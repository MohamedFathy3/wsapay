/* eslint-disable @typescript-eslint/no-explicit-any */
// src/contexts/AppContext.tsx
import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/types/auth.types";
import { useLanguage } from "@/i18n/LanguageContext";

type Theme = "light" | "dark";
type UserRole = "admin" | "teacher" | "student";

export interface BankAccount {
  id: number;
  account_name: string | null;
  account_type: string | null;
  account_number: string | null;
  bank_name: string | null;
  bank_country: string | null;
  beneficiary_bank: string | null;
  beneficiary_bank_address: string | null;
  swift: string | null;
  routing_number: string | null;
  beneficiary_name: string | null;
  beneficiary_address: string | null;
  beneficiary_account_number: string | null;
  user_id: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AppContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInstructor: boolean;
  isStudent: boolean;
  login: (email: string, password: string) => Promise<{ role: string }>;
  logout: () => void;
  error: string | null;
  setRole: (role: UserRole) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: any;
  lang: string;
  setLang: (lang: string) => void;
  bankAccounts: BankAccount[];
  // ✅ إضافة refreshUser هنا
  refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

const AppProviderInner = ({ children }: AppProviderProps) => {
  const { user, token, isLoading, isAuthenticated, login, logout, error, checkAuth } = useAuth();
  const { t, lang, setLang } = useLanguage();

  const [uiRole, setUiRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem("lms-ui-role") as UserRole;
    return savedRole || user?.role || "admin";
  });

  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("lms-theme") as Theme) || "white",
  );

  const role = uiRole || user?.role || null;
  const isAdmin = role === "admin";
  const isInstructor = role === "teacher";
  const isStudent = role === "student";

  const bankAccounts = user?.bankAccounts || [];

  const translate = (key: string): string => {
    if (t && typeof t === "object") {
      const keys = key.split(".");
      let result: any = t;

      for (const k of keys) {
        if (result && typeof result === "object" && k in result) {
          result = result[k];
        } else {
          return key;
        }
      }

      return typeof result === "string" ? result : key;
    }
    return key;
  };

  // ✅ دالة تحديث البيانات فوراً
  const refreshUser = async () => {
    await checkAuth();
  };

  useEffect(() => {
    localStorage.setItem("lms-ui-role", uiRole);
  }, [uiRole]);

  useEffect(() => {
    if (user?.role) {
      setUiRole(user.role);
    }
  }, [user]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("lms-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value: AppContextType = {
    user,
    role,
    token,
    isLoading,
    isAuthenticated,
    isAdmin,
    isInstructor,
    isStudent,
    login,
    logout,
    error,
    setRole: setUiRole,
    theme,
    toggleTheme,
    t: translate,
    lang,
    setLang,
    bankAccounts,
    refreshUser, // ✅ تم إضافة refreshUser
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return <AppProviderInner>{children}</AppProviderInner>;
};
