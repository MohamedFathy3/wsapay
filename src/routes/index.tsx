/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useNavigate, redirect, Link } from "@tanstack/react-router"; // ✅ أضفنا Link هنا
import { useState, useEffect } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Headphones,
  Lock,
  Mail,
  Repeat,
  ShieldCheck,
  UserPlus,
  HelpCircle,
  Loader2,
} from "lucide-react";
import heroBg from "@/assets/login-hero.jpg";
import { Logo } from "@/components/wsa/Logo";
import { WorldMapLines } from "@/components/wsa/WorldMapLines";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { tokenService } from "@/services/token.service";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WSA Pay — Sign in to your business payments account" },
      {
        name: "description",
        content:
          "Sign in to WSA Pay to send and receive company-to-company payments, settle invoices and manage USD, EUR and GBP balances.",
      },
      { property: "og:title", content: "WSA Pay — Business payments, connected by WSA" },
      {
        property: "og:description",
        content:
          "A secure payment and settlement platform built for companies across the WSA network.",
      },
    ],
  }),
  // ✅ بنفحص التوكن بس من غير ما نستدعي useAuth
  beforeLoad: async () => {
    const token = tokenService.getToken();
    if (token) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: LoginPage,
});

const FEATURES = [
  {
    icon: Repeat,
    title: "Send & Receive",
    body: "Manage company-to-company payments with participating WSA partners.",
  },
  {
    icon: FileText,
    title: "Settle Invoices",
    body: "Connect payments with invoice and shipment references for clearer reconciliation.",
  },
  {
    icon: BarChart3,
    title: "Stay in Control",
    body: "Track balances, transactions and company payment activity from one account.",
  },
];

function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // ✅ لو اتغيرت حالة المصادقة، حول للـ Dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  // ✅ عرض الأخطاء من الـ Auth
  useEffect(() => {
    if (error) {
      setLocalError(error);
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Please enter both email and password");
      toast.error("Please enter both email and password");
      return;
    }

    try {
      console.log("🔐 Attempting login for:", email);
      await login(email, password);
      toast.success("Welcome back! 🎉");
    } catch (err: any) {
      console.error("❌ Login error:", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="grid flex-1 lg:grid-cols-2">
        <section
          className="brand-panel relative overflow-hidden px-8 py-12 lg:px-14 lg:py-16"
          style={{
            backgroundImage: `linear-gradient(120deg, oklch(0.34 0.13 302 / 0.9), oklch(0.44 0.17 312 / 0.82)), url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <WorldMapLines className="pointer-events-none absolute inset-x-0 top-[18%] h-3/5 w-full opacity-90" />
          <div className="relative">
            <Logo light />
            <h1 className="mt-12 max-w-md text-4xl font-extrabold leading-tight text-white lg:text-5xl">
              Business payments,
              <br />
              connected by <span className="text-brand-magenta">WSA.</span>
            </h1>
            <p className="mt-5 max-w-md text-white/70">
              A secure payment and settlement platform built for companies across the WSA network.
            </p>

            <ul className="mt-10 max-w-md divide-y divide-white/10">
              {FEATURES.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4 py-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Icon className="h-5 w-5 text-white" />
                  </span>
                  <span>
                    <span className="block font-bold text-white">{title}</span>
                    <span className="mt-1 block text-sm text-white/65">{body}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10 max-w-md rounded-2xl border border-white/12 bg-white/8 p-5 backdrop-blur">
              <div className="flex items-center gap-5">
                <CheckCircle2 className="h-14 w-14 text-success" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-semibold text-brand-magenta">Payment completed</p>
                  <p className="text-lg font-bold text-white">ABC Logistics</p>
                  <p className="text-sm text-white/65">Invoice INV-88241</p>
                  <p className="mt-1 flex items-center gap-3 text-lg font-bold text-white">
                    USD 12,500.00
                    <span className="rounded-full bg-success/25 px-3 py-1 text-xs font-semibold text-white">
                      Completed
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col bg-background px-6 py-8 lg:px-14">
          <div className="flex items-center justify-end gap-4 text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Headphones className="h-4 w-4" /> Need Help?
            </span>
            <span className="text-border">|</span>
            <Link to="/public/support" className="font-semibold text-primary">
              WSA Pay Support
            </Link>
          </div>

          <div className="mx-auto mt-6 w-full max-w-md surface-card p-8">
            <h2 className="text-3xl font-bold">Welcome back</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to manage your WSA Pay account.
            </p>

            {localError && (
              <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {localError}
              </div>
            )}

            <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <div className="mt-2 flex items-center rounded-lg bg-secondary/70 focus-within:ring-2 focus-within:ring-ring/40">
                  <span className="px-3 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    placeholder="name@company.com"
                    className="h-11 w-full bg-transparent pr-3 text-sm outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="mt-2 flex items-center rounded-lg bg-secondary/70 focus-within:ring-2 focus-within:ring-ring/40">
                  <span className="px-3 text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="Enter your password"
                    className="h-11 w-full bg-transparent text-sm outline-none disabled:opacity-50"
                  />
                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={isLoading}
                    className="px-3 text-muted-foreground disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-foreground/80">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                    className="h-4 w-4 rounded border-input accent-[var(--primary)] disabled:opacity-50"
                  />
                  Remember me
                </label>
                {/* <Link to="/forgot" className="font-medium text-primary">
                  Forgot password?
                </Link> */}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="gradient-primary flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* ✅ زر Create Account */}
            <div className="mt-6 border-t border-border/40 pt-6">
              <p className="text-center text-sm text-muted-foreground mb-3">
                Don't have an account?
              </p>
              <Link
                to="/register"
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-primary bg-transparent px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                <UserPlus className="h-4 w-4" />
                Create an Account
              </Link>
            </div>

            <div className="mt-6 text-center">
              <p className="flex items-center justify-center gap-2 text-sm font-semibold">
                <ShieldCheck className="h-4 w-4 text-primary" /> Secure WSA Pay access
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your account and transaction activity are protected through WSA Pay security
                controls.
              </p>
            </div>

            <div className="my-6 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or{" "}
              <span className="h-px flex-1 bg-border" />
            </div>

            <h3 className="text-lg font-bold">New to WSA Pay?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              If your company is an eligible WSA member and does not yet have a WSA Pay account,
              start your application online.
            </p>
            <Link
              to="/register"
              className="mt-4 flex h-12 items-center justify-center gap-2 rounded-lg border-2 border-primary text-sm font-semibold text-primary"
            >
              <UserPlus className="h-4 w-4" /> Open a WSA Pay Account
            </Link>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              Already submitted an application?
            </p>
            {/* <Link
              to="/public/status"
              className="mt-1 flex items-center justify-center gap-2 text-sm font-semibold text-primary"
            >
              Check Application Status <ArrowRight className="h-4 w-4" />
            </Link> */}

            <div className="mt-6 flex items-center gap-3 rounded-xl bg-secondary p-4">
              <HelpCircle className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm">
                Having trouble signing in?
                <br />
                <Link to="/public/support" className="font-semibold text-primary">
                  Contact WSA Pay Support
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ✅ Footer كامل مع Links */}
      <footer className="brand-panel">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-8 gap-y-3 px-6 py-6 text-sm text-white/70">
          <span>© WSA Pay 2026. All rights reserved.</span>
          <span className="ml-auto flex flex-wrap items-center gap-x-8 gap-y-2">
            <Link to="/public/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/public/terms" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/public/security" className="hover:text-white transition-colors">
              Security
            </Link>
            <Link to="/public/compliance" className="hover:text-white transition-colors">
              Compliance
            </Link>
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> English
            </span>
          </span>
        </div>
      </footer>
    </div>
  );
}
