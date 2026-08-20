import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, ChevronDown, HelpCircle, LogOut, User, Settings, Shield } from "lucide-react";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";

const NAV = [
  { label: "Home", to: "/dashboard" },
  { label: "Payments", to: "/payments" },
  { label: "Partners", to: "/partners" },
  { label: "Transactions", to: "/transactions" },
  { label: "Reports", to: "/reports" },
  { label: "Contact", to: "/contact" },
  { label: "Administration", to: "/administration" },
] as const;

export function AppShell({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar?: { title: string; items: { label: string; hint?: string; to: string }[] };
}) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout, isAuthenticated } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ✅ إغلاق الـ Dropdown عند الضغط برا
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ✅ استخراج بيانات المستخدم
  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const userRole = user?.role || "member";
  const companyName = user?.displayName || user?.email_company || "Company";

  // ✅ الحروف الأولى للـ Avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = getInitials(userName);

  // ✅ عرض دور المستخدم بشكل مفهوم
  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      admin: "Administrator",
      member: "Member",
      teacher: "Instructor",
      student: "Student",
    };
    return roles[role] || role;
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-secondary/50">
      <header className="brand-panel sticky top-0 z-30">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-8 px-6">
          <Link to="/dashboard">
            {/* ✅ هنا الشعار الأساسي هو favicon.png */}
            <img src="/WSAPAYLogo-03.png" alt="WSA Pay" className="h-20 w-auto cover" />
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "text-white after:mx-auto after:mt-1 after:block after:h-0.5 after:w-6 after:rounded-full after:bg-brand-magenta"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-4 text-white/80">
            <button className="relative" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-magenta text-[10px] font-bold text-white">
                3
              </span>
            </button>
            <HelpCircle className="h-5 w-5" />

            {/* ✅ Dropdown container */}
            <div className="relative dropdown-container">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-white/10"
              >
                {/* ✅ هنا صورة المستخدم (لو موجودة) أو الأحرف الأولى */}
                {user?.logo ? (
                  <img
                    src={user.logo}
                    alt="User Logo"
                    className="h-9 w-9 rounded-full object-cover border border-white/20"
                    onError={(e) => {
                      // لو الصورة ماتحملتش، نخفيها ونظهر الأحرف الأولى
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-xs font-bold text-white">
                    {initials || "U"}
                  </span>
                )}
                <span className="hidden text-left leading-tight md:block">
                  <span className="block text-sm font-semibold text-white">{userName}</span>
                  <span className="block text-xs text-white/60">
                    {companyName} • {getRoleLabel(userRole)}
                  </span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* ✅ Dropdown menu - ألوان مناسبة للخلفية البيضاء */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-2xl ring-1 ring-black/10">
                  {/* ✅ Header - نص غامق على خلفية بيضاء */}
                  <div className="border-b border-gray-200 px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* ✅ Logo الخاص بالمستخدم جوه الـ Dropdown */}
                      {user?.logo ? (
                        <img
                          src={user.logo}
                          alt="User Logo"
                          className="h-10 w-10 rounded-full object-cover border border-gray-200"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                          {initials || "U"}
                        </span>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{userName}</p>
                        <p className="text-sm text-gray-600">{userEmail}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {companyName} • {getRoleLabel(userRole)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ✅ Menu items - كلها بقت Links بتودي لصفحات */}
                  <div className="p-2">
                    <Link
                      to="/administration"
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="h-4 w-4 text-gray-500" />
                      My Profile
                    </Link>
                  </div>
                  {/* ✅ Logout button */}
                  <div className="border-t border-gray-200 p-2">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 gap-0">
        {sidebar && (
          <aside className="hidden w-64 shrink-0 bg-card px-4 py-6 lg:block">
            <p className="px-2 text-xs font-semibold tracking-widest text-muted-foreground">
              {sidebar.title}
            </p>
            <nav className="mt-4 space-y-1">
              {sidebar.items.map((item) => {
                const active = pathname === item.to;
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                        : "text-foreground/80 hover:bg-secondary"
                    }`}
                  >
                    {item.label}
                    {item.hint && (
                      <span className="block text-xs font-normal text-muted-foreground">
                        {item.hint}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-8 rounded-xl bg-secondary/50 bg-secondary/60 p-4">
              <p className="text-sm font-semibold">Need Help?</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Our support team is here to help you.
              </p>
              <Link
                to="/contact"
                className="mt-3 flex w-full items-center justify-center rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/20"
              >
                Contact Support
              </Link>
            </div>
          </aside>
        )}
        <main className="min-w-0 flex-1 px-6 py-8">{children}</main>
      </div>

      <footer className="brand-panel">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-8 gap-y-3 px-6 py-6 text-sm text-white/70">
          {/* ✅ الشعار الأساسي في الـ Footer هو favicon.png */}
          <img src="/favicon.png" alt="WSA Pay" className="h-8 w-auto" />

          <Link to="/about" className="hover:text-white transition-colors">
            About WSA Pay
          </Link>

          <Link to="/help" className="hover:text-white transition-colors">
            Help Center
          </Link>

          <Link to="/contact" className="hover:text-white transition-colors">
            Contact Support
          </Link>

          <Link to="/terms" className="hover:text-white transition-colors">
            Terms &amp; Conditions
          </Link>

          <Link to="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>

          <span className="ml-auto">© 2026 WSA. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
