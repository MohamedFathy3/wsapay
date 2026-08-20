// src/services/partner.service.ts
import api from "@/lib/api";

export interface Partner {
  id: number;
  name: string;
  displayName: string;
  email_company?: string;
  phone: string;
  email: string;
  status?: string;
  city?: string;
  state?: string;
  country?: {
    id: number;
    name: string;
    key: string;
    code: string;
    flag: string;
  };
  balances?: Array<{
    currency: string;
    balance: string;
  }>;
  logo?: string | null;
  favorite?: boolean;
  favoriteId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PartnersResponse {
  result: string;
  message: string;
  data: Partner[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  status: number;
}

// ✅ الـ Response الجديد للمفضلة
export interface FavoritesResponse {
  data: Partner[]; // 👈 مباشرة array من الشركاء مع favorite: true
  result: string;
  message: string;
  status: number;
}

export interface MemberFilters {
  filters?: {
    search?: string;
    name?: string;
    email?: string;
    displayName?: string;
    email_company?: string;
    phone?: string;
    status?: string;
    country_id?: number;
    city?: string;
    state?: string;
    [key: string]: any;
  };
  orderBy?: string;
  orderByDirection?: "asc" | "desc";
  perPage?: number;
  paginate?: boolean | number;
  page?: number;
}

class PartnerService {
  /**
   * 📥 جلب كل الشركاء (Members) - باستخدام POST مع filters
   */
  async getAllMembers(filters: MemberFilters = {}): Promise<PartnersResponse> {
    try {
      const payload = {
        filters: filters.filters || {},
        orderBy: filters.orderBy || "id",
        orderByDirection: filters.orderByDirection || "desc",
        perPage: filters.perPage || 10,
        paginate: filters.paginate !== undefined ? filters.paginate : 1,
        ...(filters.page && { page: filters.page }),
      };

      console.log("📥 Fetching members with filters:", payload);

      const response = await api.post<PartnersResponse>("/user/members", payload);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching members:", error);
      throw error;
    }
  }

  /**
   * 📥 جلب شركاء المفضلة
   */
  async getFavorites(): Promise<Partner[]> {
    try {
      console.log("📥 Fetching favorites...");
      const response = await api.get<FavoritesResponse>("/user/members/favorites");
      console.log("✅ Favorites response:", response.data);
      return response.data.data || [];
    } catch (error) {
      console.error("❌ Error fetching favorites:", error);
      return [];
    }
  }

  /**
   * ➕ إضافة شريك للمفضلة
   */
  async addFavorite(userId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post("/user/members/favorite", { user_id: userId });
      return {
        success: true,
        message: response.data.message || "Partner added to favorites",
      };
    } catch (error: any) {
      console.error("❌ Error adding favorite:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add favorite",
      };
    }
  }

  /**
   * ❌ إزالة شريك من المفضلة
   */
  async removeFavorite(userId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete("/user/members/favorite", {
        data: { user_id: userId },
      });
      return {
        success: true,
        message: response.data.message || "Partner removed from favorites",
      };
    } catch (error: any) {
      console.error("❌ Error removing favorite:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to remove favorite",
      };
    }
  }

  /**
   * 🔍 التحقق إذا كان الشريك في المفضلة
   */
  async isFavorite(userId: number): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some((fav) => fav.id === userId);
    } catch (error) {
      return false;
    }
  }
}

export const partnerService = new PartnerService();
