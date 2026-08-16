import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, ChevronDown, HelpCircle } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "./Logo";

const NAV = [
  { label: "Home", to: "/dashboard" },
  { label: "Payments", to: "/payments" },
  { label: "Partners", to: "/partners" },
  { label: "Transactions", to: "/transactions" },
  { label: "Reports", to: "/reports" },
  { label: "Administration", to: "/administration" },
] as const;

export function AppShell({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar?: { title: string; items: { label: string; hint?: string; to: string }[] };
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen flex-col bg-secondary/50">
      <header className="brand-panel sticky top-0 z-30">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-8 px-6">
          <Link to="/dashboard">
            <Logo light />
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
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-xs font-bold text-white">
                RS
              </span>
              <span className="hidden text-left leading-tight md:block">
                <span className="block text-sm font-semibold text-white">Remon S.</span>
                <span className="block text-xs text-white/60">PFS Administrator</span>
              </span>
              <ChevronDown className="h-4 w-4" />
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
              <button className="mt-3 w-full rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
                Contact Support
              </button>
            </div>
          </aside>
        )}
        <main className="min-w-0 flex-1 px-6 py-8">{children}</main>
      </div>

      <footer className="brand-panel">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-8 gap-y-3 px-6 py-6 text-sm text-white/70">
          <Logo light />
          <span>About WSA Pay</span>
          <span>Help Center</span>
          <span>Contact Support</span>
          <span>Terms &amp; Conditions</span>
          <span>Privacy Policy</span>
          <span className="ml-auto">© 2026 WSA. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}