// src/services/settingsaccount.service.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/api";

// ✅ تعريف الـ Type الجديد (حساب واحد بدل 3)
export interface BankAccountPayload {
  account_name?: string;
  account_type?: string;
  account_number?: string;
  bank_name?: string;
  bank_country?: string;
  beneficiary_bank?: string;
  beneficiary_bank_address?: string;
  swift?: string;
  routing_number?: string;
  beneficiary_name?: string;
  beneficiary_address?: string;
  beneficiary_account_number?: string;
}

class SettingService {
  // ✅ 1. إنشاء حساب بنكي جديد (POST /api/bank-account)
  async createBankAccount(data: BankAccountPayload): Promise<any> {
    try {
      const response = await api.post("/bank-account", data);
      return response.data;
    } catch (error) {
      console.error("Error creating bank account:", error);
      throw error;
    }
  }

  // ✅ 2. تحديث حساب بنكي موجود (PUT /api/setting/{id})
  async updateBankAccount(id: number, data: BankAccountPayload): Promise<any> {
    try {
      const response = await api.put(`/bank-account/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating bank account:", error);
      throw error;
    }
  }

  // ✅ 3. حذف حسابات بنكية (DELETE /api/setting/delete)
  async deleteBankAccounts(ids: number[]): Promise<any> {
    try {
      const response = await api.delete("/bank-account/delete", {
        data: { ids: ids },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting bank accounts:", error);
      throw error;
    }
  }
}

export const settingService = new SettingService();
