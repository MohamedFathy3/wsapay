// src/components/wsa/NotificationDropdown.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { Bell, Check, CheckCheck, X, Loader2, ArrowRight } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, fetchNotifications } =
    useNotifications();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(notificationId);
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    if (notifications.length === 0) return;

    try {
      await markAllAsRead();
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      deposit: "💰",
      withdraw: "💸",
      transfer: "🔄",
      add: "➕",
    };
    return icons[type] || "📊";
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      deposit: "text-green-600 bg-green-50",
      withdraw: "text-red-600 bg-red-50",
      transfer: "text-blue-600 bg-blue-50",
      add: "text-purple-600 bg-purple-50",
    };
    return colors[type] || "text-gray-600 bg-gray-50";
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-white/80" />

        {unreadCount > 0 && (
          <>
            <span
              className={`
              absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center 
              rounded-full bg-red-500 text-[10px] font-bold text-white
              animate-pulse
            `}
            >
              {unreadCount > 99 ? "99+" : unreadCount > 9 ? "9+" : unreadCount}
            </span>

            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[420px] max-h-[500px] overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/10 z-50">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
                >
                  <CheckCheck className="h-3 w-3" />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Bell className="h-12 w-12 mb-2 opacity-20" />
                <p className="text-sm">No new notifications</p>
                <p className="text-xs">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="group flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div
                      className={`
                      flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                      ${getTypeColor(notification.type)}
                    `}
                    >
                      <span className="text-lg">{getTypeIcon(notification.type)}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{notification.user_name}</span>
                        {notification.type === "deposit" && " deposited "}
                        {notification.type === "withdraw" && " withdrew "}
                        {notification.type === "transfer" && " transferred "}
                        {notification.type === "add" && " added "}
                        <span className="font-semibold">
                          {notification.amount} {notification.currency}
                        </span>
                        {notification.to_user_name && ` to ${notification.to_user_name}`}
                      </p>
                      {notification.description && (
                        <p className="text-xs text-gray-500 truncate">{notification.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`
                          text-[10px] font-medium px-2 py-0.5 rounded-full
                          ${
                            notification.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : notification.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                          }
                        `}
                        >
                          {notification.status}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {formatTime(notification.created_at)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-200"
                    >
                      <Check className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="border-t border-gray-200 px-4 py-2">
              <Link
                to="/transactions"
                className="flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                View all transactions
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
