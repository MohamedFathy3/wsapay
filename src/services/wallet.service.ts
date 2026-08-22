/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/wallet.service.ts
import api from "@/lib/api";

export interface WithdrawRequest {
  amount: number;
  currency: string;
  description: string;
}

export interface TransferRequest {
  to_user_id: number;
  amount: number;
  currency: string;
  description: string;
}

export interface WalletResponse {
  result: string;
  message: string;
  data: any;
  status: number;
}

class WalletService {
  /**
   * 💰 سحب أموال
   */
  async withdraw(data: WithdrawRequest): Promise<WalletResponse> {
    try {
      console.log("📤 Withdraw request:", data);
      const response = await api.post<WalletResponse>("/wallet/withdraw", data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Withdraw error:", error);
      throw error;
    }
  }

  /**
   * 🔄 تحويل أموال لشريك
   */
  async transfer(data: TransferRequest): Promise<WalletResponse> {
    try {
      console.log("📤 Transfer request:", data);
      const response = await api.post<WalletResponse>("/wallet/transfer", data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Transfer error:", error);
      throw error;
    }
  }

  /**
   * 📥 جلب المفضلة (الشركاء المفضلين)
   */
  async getFavorites(): Promise<any[]> {
    try {
      const response = await api.get("/user/members/favorites");
      return response.data.data || [];
    } catch (error) {
      console.error("❌ Error fetching favorites:", error);
      return [];
    }
  }

  /**
   * 📥 جلب كل الشركاء
   */
  async getAllMembers(page: number = 1, name: string = ""): Promise<any> {
    try {
      const response = await api.post("/user/members", {
        filters: {
          ...(name && { name }),
        },
        orderBy: "id",
        orderByDirection: "desc",
        perPage: 20,
        paginate: 1,
        page,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching members:", error);
      throw error;
    }
  }
}

export const walletService = new WalletService();
