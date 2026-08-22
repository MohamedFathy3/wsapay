// src/contexts/NotificationContext.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { notificationService, Notification } from "@/services/Notification.service";
import { useAuth } from "@/hooks/useAuth";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const { user } = useAuth(); // ✅ جلب المستخدم
  const userId = user?.id; // ✅ خذ الـ user_id

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const isFetchingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ جلب الإشعارات غير المقروءة مع user_id
  const fetchNotifications = useCallback(async () => {
    if (isFetchingRef.current || !userId) return; // ✅ لو مفيش user_id متعملش حاجة

    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      const response = await notificationService.getNotifications(userId, { read: 0 });
      const data = response?.data || [];
      setNotifications(data);
      setUnreadCount(data.length);
      return data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [userId]); // ✅ userId في الـ dependency

  // ✅ جلب عدد الإشعارات غير المقروءة مع user_id
  const fetchUnreadCount = useCallback(async () => {
    if (isFetchingRef.current || !userId) return; // ✅ لو مفيش user_id متعملش حاجة

    try {
      isFetchingRef.current = true;
      const count = await notificationService.getUnreadCount(userId);
      setUnreadCount(count);
      return count;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      return 0;
    } finally {
      isFetchingRef.current = false;
    }
  }, [userId]); // ✅ userId في الـ dependency

  // ✅ تحديد إشعار كمقروء
  const markAsRead = useCallback(async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  // ✅ تحديد كل الإشعارات كمقروءة
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  }, []);

  // ✅ إضافة إشعار جديد
  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => {
      if (prev.some((n) => n.id === notification.id)) return prev;
      return [notification, ...prev];
    });
    setUnreadCount((prev) => prev + 1);
  }, []);

  // ✅ حذف إشعار
  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  // ✅ جلب البيانات أول مرة (مرة واحدة فقط)
  useEffect(() => {
    if (!userId || isInitialized) return; // ✅ لو مفيش user_id أو اتهيأت قبل كده

    const init = async () => {
      await Promise.all([fetchNotifications(), fetchUnreadCount()]);
      setIsInitialized(true);
    };
    init();
  }, [userId, isInitialized, fetchNotifications, fetchUnreadCount]);

  // ✅ Polling كل 30 ثانية
  useEffect(() => {
    if (!userId || !isInitialized) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    intervalRef.current = setInterval(async () => {
      try {
        const count = await notificationService.getUnreadCount(userId);
        setUnreadCount(count);
      } catch (error) {
        console.error("Error polling unread count:", error);
      }
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [userId, isInitialized]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
