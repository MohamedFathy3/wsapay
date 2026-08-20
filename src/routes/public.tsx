/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { Globe } from "lucide-react";
import { Logo } from "@/components/wsa/Logo";

export const Route = createFileRoute("/public")({
  head: () => ({
    meta: [
      { title: "WSA Pay" },
      { name: "description", content: "WSA Pay - Business payments platform." },
    ],
  }),
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* محتوى الصفحة */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer موحد للصفحات العامة */}
      <footer className="border-t border-border/40 bg-card px-6 py-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© 2026 WSA Pay. All rights reserved.</span>
          <div className="flex flex-wrap gap-4">
            <Link to="/public/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link to="/public/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link to="/public/security" className="hover:text-foreground">
              Security
            </Link>
            <Link to="/public/compliance" className="hover:text-foreground">
              Compliance
            </Link>
            <Link to="/public/support" className="hover:text-foreground">
              Support
            </Link>
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" /> EN
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
