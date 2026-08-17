import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
} from "lucide-react";
import heroBg from "@/assets/login-hero.jpg";
import { Logo } from "@/components/wsa/Logo";
import { WorldMapLines } from "@/components/wsa/WorldMapLines";

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
        content: "A secure payment and settlement platform built for companies across the WSA network.",
      },
    ],
  }),
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
  const [showPassword, setShowPassword] = useState(false);

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
            <a href="#support" className="font-semibold text-primary">
              WSA Pay Support
            </a>
          </div>

          <div className="mx-auto mt-6 w-full max-w-md surface-card p-8">
            <h2 className="text-3xl font-bold">Welcome back</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to manage your WSA Pay account.
            </p>

            <form
              className="mt-7 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/dashboard" });
              }}
            >
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
                    placeholder="name@company.com"
                    className="h-11 w-full bg-transparent pr-3 text-sm outline-none"
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
                    placeholder="Enter your password"
                    className="h-11 w-full bg-transparent text-sm outline-none"
                  />
                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword((v) => !v)}
                    className="px-3 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-foreground/80">
                  <input type="checkbox" className="h-4 w-4 rounded border-input accent-[var(--primary)]" />
                  Remember me
                </label>
                <a href="#forgot" className="font-medium text-primary">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="gradient-primary flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elevated)]"
              >
                <Lock className="h-4 w-4" /> Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="flex items-center justify-center gap-2 text-sm font-semibold">
                <ShieldCheck className="h-4 w-4 text-primary" /> Secure WSA Pay access
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your account and transaction activity are protected through WSA Pay security controls.
              </p>
            </div>

            <div className="my-6 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
            </div>

            <h3 className="text-lg font-bold">New to WSA Pay?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              If your company is an eligible WSA member and does not yet have a WSA Pay account, start
              your application online.
            </p>
            <a
              href="#apply"
              className="mt-4 flex h-12 items-center justify-center gap-2 rounded-lg border-2 border-primary text-sm font-semibold text-primary"
            >
              <UserPlus className="h-4 w-4" /> Open a WSA Pay Account
            </a>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              Already submitted an application?
            </p>
            <a
              href="#status"
              className="mt-1 flex items-center justify-center gap-2 text-sm font-semibold text-primary"
            >
              Check Application Status <ArrowRight className="h-4 w-4" />
            </a>

            <div className="mt-6 flex items-center gap-3 rounded-xl bg-secondary p-4">
              <HelpCircle className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm">
                Having trouble signing in?
                <br />
                <a href="#support" className="font-semibold text-primary">
                  Contact WSA Pay Support
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className="brand-panel">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-8 gap-y-3 px-6 py-6 text-sm text-white/70">
          <span>© WSA Pay 2026. All rights reserved.</span>
          <span className="ml-auto flex flex-wrap items-center gap-x-8 gap-y-2">
            <span>Privacy Policy</span>
            <span>Terms &amp; Conditions</span>
            <span>Security</span>
            <span>Compliance</span>
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> English
            </span>
          </span>
        </div>
      </footer>
    </div>
  );
}
