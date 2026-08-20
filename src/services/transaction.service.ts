// src/services/transaction.service.ts
import api from "@/lib/api";

export interface Transaction {
  id: number;
  user_id: number;
  user_name: string;
  from_user_id: number | null;
  from_user_name: string | null;
  to_user_id: number | null;
  to_user_name: string | null;
  amount: string;
  currency: string;
  type: "add" | "withdraw" | "transfer";
  description: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface TransactionsResponse {
  data: Transaction[];
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
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
  result: string;
  message: string;
  status: number;
}

export interface TransactionFilters {
  filters?: {
    search?: string;
    type?: string;
    currency?: string;
    status?: string;
    user_name?: string;
    from_user_name?: string;
    to_user_name?: string;
    date_from?: string;
    date_to?: string;
    [key: string]: any;
  };
  orderBy?: string;
  orderByDirection?: "asc" | "desc";
  perPage?: number;
  paginate?: boolean | number;
  page?: number;
}

class TransactionService {
  /**
   * 📥 جلب المعاملات مع filters
   */
  async getTransactions(filters: TransactionFilters = {}): Promise<TransactionsResponse> {
    try {
      const payload = {
        filters: filters.filters || {},
        orderBy: filters.orderBy || "id",
        orderByDirection: filters.orderByDirection || "desc",
        perPage: filters.perPage || 10,
        paginate: filters.paginate !== undefined ? filters.paginate : 1,
        ...(filters.page && { page: filters.page }),
      };

      console.log("📥 Fetching transactions with filters:", payload);

      const response = await api.post<TransactionsResponse>("/transactions-member/index", payload);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching transactions:", error);
      throw error;
    }
  }

  /**
   * 📥 جلب معاملة بالـ ID
   */
  async getTransactionById(id: number): Promise<Transaction | null> {
    try {
      const response = await api.get(`/transactions-member/${id}`);
      return response.data.data || null;
    } catch (error) {
      console.error("❌ Error fetching transaction:", error);
      return null;
    }
  }

  /**
   * 📊 جلب إحصائيات المعاملات
   */
  async getTransactionStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    totalAmount: number;
  }> {
    try {
      const response = await this.getTransactions({ perPage: 100, paginate: 0 });
      const transactions = response.data;

      return {
        total: transactions.length,
        pending: transactions.filter((t) => t.status === "pending").length,
        approved: transactions.filter((t) => t.status === "approved").length,
        totalAmount: transactions.reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0),
      };
    } catch (error) {
      console.error("❌ Error fetching stats:", error);
      return { total: 0, pending: 0, approved: 0, totalAmount: 0 };
    }
  }
}

export const transactionService = new TransactionService();
