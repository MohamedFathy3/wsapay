// src/services/notification.service.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/api";

export interface Notification {
  id: number;
  user_id: number;
  user_name: string;
  from_user_id: number | null;
  from_user_name: string | null;
  to_user_id: number | null;
  to_user_name: string | null;
  amount: string;
  currency: string;
  type: string;
  description: string;
  status: string;
  read: number;
  created_at: string;
  updated_at: string;
}

class NotificationService {
  // ✅ جلب الإشعارات - user_id جوه filters
  async getNotifications(userId: number, filters?: { read?: number }): Promise<any> {
    try {
      const response = await api.post("/transactions-member/index", {
        filters: {
          read: filters?.read ?? 0,
          user_id: userId, // ✅ user_id جوه filters
        },
        orderBy: "id",
        orderByDirection: "desc",
        perPage: 10,
        paginate: 1,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  // ✅ جلب عدد الإشعارات غير المقروءة - user_id جوه filters
  async getUnreadCount(userId: number): Promise<number> {
    try {
      const response = await api.post("/transactions-member/index", {
        filters: {
          read: 0,
          user_id: userId, // ✅ user_id جوه filters
        },
        perPage: 1,
        paginate: 0,
      });
      return response.data?.meta?.total || 0;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      return 0;
    }
  }

  // ✅ تحديد إشعار كمقروء
  async markAsRead(notificationId: number): Promise<any> {
    try {
      const response = await api.post(`/wallet-transactions/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  // ✅ تحديد كل الإشعارات كمقروءة
  async markAllAsRead(): Promise<any> {
    try {
      const response = await api.post("/wallet-transactions/read-all");
      return response.data;
    } catch (error) {
      console.error("Error marking all as read:", error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
