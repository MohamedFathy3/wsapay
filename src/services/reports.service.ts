// src/services/reports.service.ts
import api from "@/lib/api";

export interface TransferReportResponse {
  data: Array<{
    id: number;
    user_id: number;
    user_name: string;
    from_user_id: number | null;
    from_user_name: string | null;
    to_user_id: number | null;
    to_user_name: string | null;
    amount: string;
    currency: string;
    type: "add" | "withdraw" | "transfer" | "deposit";
    description: string;
    status: "pending" | "approved" | "rejected";
    created_at: string;
    updated_at: string;
  }>;
  summary: {
    month: string;
    from: string;
    to: string;
    total_amount: number;
    transactions: number;
    types: {
      add: { amount: number; transactions: number };
      withdraw: { amount: number; transactions: number };
      transfer: { amount: number; transactions: number };
      deposit: { amount: number; transactions: number };
    };
    daily: Array<{
      date: string;
      day: string;
      day_name: string;
      total_amount: number;
      transactions: number;
      types: {
        add: { amount: number; transactions: number };
        withdraw: { amount: number; transactions: number };
        transfer: { amount: number; transactions: number };
        deposit: { amount: number; transactions: number };
      };
    }>;
  };
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
  result: "success";
  message: string;
  status: number;
}

class ReportsService {
  async getTransferReport(page: number = 1, perPage: number = 10): Promise<TransferReportResponse> {
    try {
      const response = await api.get<TransferReportResponse>("/user/transfer-report", {
        params: { page, per_page: perPage },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching transfer report:", error);
      throw error;
    }
  }
}

export const reportsService = new ReportsService();
