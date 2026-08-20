/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/auth.service.ts
import api from "@/lib/api";
import { tokenService } from "./token.service";
import type { User } from "@/types/auth.types";

// ✅ تعريف نوع الـ Response من check-auth
interface CheckAuthResponse {
  result: string;
  data: null;
  message: {
    data: {
      id: number;
      name: string;
      displayName: string;
      email_company: string;
      phone: string;
      fax: string;
      address_one: string;
      address_two: string;
      city: string;
      state: string;
      postalCode: string;
      first_name_administrator: string;
      middle_name_administrator: string;
      last_name_administrator: string;
      mobile_administrator: string;
      phone_administrator: string | null;
      email: string;
      status: string;
      country: {
        id: number;
        name: string;
        key: string;
        code: string;
        active: boolean;
        flag: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
        deleted: boolean;
      };
      logo: string | null;
      balances: Array<{
        currency: string;
        balance: string;
      }>;
      subAccounts: any[];
      lastTransactions: Array<{
        id: number;
        amount: string;
        currency: string;
        toUser: string | null;
        type: string;
        status?: string;
        description: string;
        createdAt: string;
      }>;
      Partners?: Array<{
        id: number;
        name: string;
        displayName: string;
        email: string;
        phone: string;
        logo: string | null;
        favorite: boolean;
        favoriteId: number;
      }>;
      pendingTransfer?: {
        id: number;
        amount: string;
        currency: string;
        fromUserId: number;
        toUserId: number;
        type: string;
        status: string;
        description: string;
        toUser: string;
        createdAt: string;
      };
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
      deleted: boolean;
    };
  };
  status: number;
}

// ✅ تعريف نوع الـ Response من login
interface LoginResponse {
  result: string;
  data: null;
  message: {
    type: string;
    access_token: string;
    data: {
      id: number;
      name: string;
      displayName: string;
      email: string;
      email_company: string;
      phone: string;
      fax: string;
      address_one: string;
      address_two: string;
      city: string;
      state: string;
      postalCode: string;
      first_name_administrator: string;
      middle_name_administrator: string;
      last_name_administrator: string;
      mobile_administrator: string;
      phone_administrator: string | null;
      status: string;
      country: {
        id: number;
        name: string;
        key: string;
        code: string;
        active: boolean;
        flag: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
        deleted: boolean;
      };
      logo: string | null;
      balances: Array<{
        currency: string;
        balance: string;
      }>;
      subAccounts: any[];
      lastTransactions: Array<{
        id: number;
        amount: string;
        currency: string;
        toUser: string | null;
        type: string;
        description: string;
        createdAt: string;
      }>;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
      deleted: boolean;
    };
  };
  status: number;
}

class AuthService {
  private readonly USER_KEY = "user_data";

  /**
   * 🔐 تسجيل الدخول - بيحفظ التوكن في Cookies فقط
   */
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const response = await api.post<LoginResponse>("/login/members", { email, password });
      const data = response.data;

      console.log("📥 Login response received");

      // استخراج التوكن من الـ Response
      const token = data.message.access_token;

      // ✅ حفظ التوكن في Cookies فقط (مش في localStorage)
      tokenService.setToken(token);

      // استخراج بيانات المستخدم
      const userData = data.message.data;
      const user = this.mapUserData(userData);

      // ✅ حفظ بيانات المستخدم في localStorage (مش حساسة)
      this.setCurrentUser(user);

      console.log("✅ Login successful for:", user.email);
      console.log("✅ User role:", user.role);

      return { user, token };
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  }

  /**
   * 🔍 التحقق من المصادقة - بيستخدم `/check-auth/members`
   */
  async checkAuth(): Promise<User | null> {
    try {
      const token = tokenService.getToken();
      if (!token) {
        console.log("⚠️ No token found");
        return null;
      }

      console.log("🔍 Checking auth with token...");
      const response = await api.get<CheckAuthResponse>("/check-auth/members");
      const data = response.data;

      console.log("📥 CheckAuth response:", data);

      if (data.result === "success" && data.message?.data) {
        const userData = data.message.data;

        // ✅ تأكد من وجود Partners و pendingTransfer
        console.log("📊 User data from API:", {
          Partners: userData.Partners,
          pendingTransfer: userData.pendingTransfer,
          balances: userData.balances,
          lastTransactions: userData.lastTransactions,
        });

        const user = this.mapUserData(userData);

        // ✅ تحديث بيانات المستخدم
        this.setCurrentUser(user);
        console.log("✅ Auth check successful for:", user.email);
        console.log("✅ Partners count:", user.Partners?.length || 0);
        console.log("✅ Pending Transfer:", user.pendingTransfer ? "Yes" : "No");

        return user;
      }

      console.log("⚠️ Auth check failed");
      return null;
    } catch (error) {
      console.error("❌ Auth check error:", error);
      // لو التوكن غير صالح، نمسحه
      tokenService.removeToken();
      this.removeCurrentUser();
      return null;
    }
  }

  /**
   * 🗺️ تحويل بيانات الـ API إلى كائن User
   */
  private mapUserData(data: any): User {
    return {
      id: data.id,
      name: data.name || data.displayName || data.first_name_administrator,
      email: data.email,
      role: "member",
      displayName: data.displayName,
      email_company: data.email_company,
      phone: data.phone,
      status: data.status,
      country: data.country,
      balances: data.balances || [],
      lastTransactions: data.lastTransactions || [],
      // ✅ إضافة Partners
      Partners: data.Partners || [],
      // ✅ إضافة pendingTransfer
      bankAccounts: data.bankAccounts || [],
      pendingTransfer: data.pendingTransfer || null,
      subAccounts: data.subAccounts || [],
      address_one: data.address_one,
      address_two: data.address_two,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      first_name_administrator: data.first_name_administrator,
      middle_name_administrator: data.middle_name_administrator,
      last_name_administrator: data.last_name_administrator,
      mobile_administrator: data.mobile_administrator,
      created_at: data.createdAt,
      updated_at: data.updatedAt,
    };
  }

  /**
   * 🚪 تسجيل الخروج
   */
  logout(): void {
    tokenService.clearAll();
    this.removeCurrentUser();
    console.log("🚪 Logged out successfully");
  }

  /**
   * 💾 حفظ بيانات المستخدم في localStorage
   */
  setCurrentUser(user: User): void {
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      console.log("✅ User data saved");
      console.log("✅ Saved Partners:", user.Partners?.length || 0);
      console.log("✅ Saved pendingTransfer:", user.pendingTransfer ? "Yes" : "No");
    } catch (error) {
      console.error("❌ Error saving user:", error);
    }
  }

  /**
   * 📖 جلب بيانات المستخدم من localStorage
   */
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      if (!userStr) return null;
      const user = JSON.parse(userStr) as User;
      console.log("📖 User loaded from storage:", {
        Partners: user.Partners?.length || 0,
        pendingTransfer: user.pendingTransfer ? "Yes" : "No",
      });
      return user;
    } catch (error) {
      console.error("❌ Error parsing user:", error);
      localStorage.removeItem(this.USER_KEY);
      return null;
    }
  }

  /**
   * 🗑️ حذف بيانات المستخدم
   */
  removeCurrentUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * ✅ التحقق من المصادقة
   */
  isAuthenticated(): boolean {
    return !!tokenService.getToken();
  }

  /**
   * 👤 جلب دور المستخدم
   */
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }
}

export const authService = new AuthService();
