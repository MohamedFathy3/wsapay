// src/services/setting.service.ts
import api from "@/lib/api";

export interface BankAccount {
  id: number;
  accountName: string;
  accountType: string;
  accountNumber: string | null;
  bankName: string | null;
  bankCountry: string;
  beneficiaryBank: string | null;
  beneficiaryBankAddress: string | null;
  swift: string | null;
  routingNumber: string | null;
  beneficiaryName: string | null;
  beneficiaryAddress: string | null;
  beneficiaryAccountNumber: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsResponse {
  data: BankAccount[];
  result: string;
  message: string;
  status: number;
}

class SettingService {
  /**
   * 📥 جلب الحسابات البنكية
   */
  async getBankAccounts(): Promise<BankAccount[]> {
    try {
      console.log("📥 Fetching bank accounts...");
      const response = await api.get<SettingsResponse>("/setting-public");
      console.log("✅ Bank accounts loaded:", response.data.data.length);
      return response.data.data || [];
    } catch (error) {
      console.error("❌ Error fetching bank accounts:", error);
      return [];
    }
  }

  /**
   * 🔍 جلب حساب بنكي بالـ ID
   */
  async getBankAccountById(id: number): Promise<BankAccount | null> {
    try {
      const accounts = await this.getBankAccounts();
      return accounts.find((a) => a.id === id) || null;
    } catch (error) {
      console.error("❌ Error fetching bank account:", error);
      return null;
    }
  }
}

export const settingService = new SettingService();
