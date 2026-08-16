import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  Building2,
  CheckCircle2,
  ExternalLink,
  FileText,
  Info,
  Send,
  Settings,
  Users,
} from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/wsa/AppShell";
import { StatusPill } from "./dashboard";
import { balances, importantNotes, recentActivity } from "@/lib/wsa-data";

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Payment Processing — WSA Pay" },
      {
        name: "description",
        content:
          "Send partner payments, transfer between WSA members, withdraw funds and deposit into your USD, EUR or GBP account.",
      },
      { property: "og:title", content: "Payment Processing — WSA Pay" },
      { property: "og:description", content: "Send payments, withdraw funds and manage account funding." },
    ],
  }),
  component: Payments,
});

const SIDEBAR = {
  title: "PAYMENTS",
  items: [
    { label: "Payment Processing", hint: undefined, to: "/payments" },
    { label: "Send Payment", hint: "Pay a partner", to: "/payments" },
    { label: "Transfer to Partner", hint: "Partner-to-partner transfer", to: "/payments" },
    { label: "Withdraw Funds", hint: "Send to your bank account", to: "/payments" },
    { label: "Deposit / Add Funds", hint: "Fund your WSA Pay account", to: "/payments" },
    { label: "Payment Approvals", hint: "Review and approve payments", to: "/payments" },
    { label: "Scheduled Payments", hint: "Manage recurring payments", to: "/payments" },
    { label: "Payment Templates", hint: "Manage payment templates", to: "/payments" },
  ],
};

const ACTIONS = [
  { icon: Send, title: "Send Payment", body: "Pay a partner within WSA Pay", cta: "Send Payment", solid: true },
  { icon: Users, title: "Transfer to Partner", body: "Partner-to-partner transfer", cta: "Transfer", solid: false },
  { icon: ArrowUpFromLine, title: "Withdraw Funds", body: "Transfer to your bank account", cta: "Withdraw", solid: false },
  { icon: ArrowDownToLine, title: "Deposit Funds", body: "Add funds to your WSA Pay account", cta: "Deposit Funds", solid: false },
];

function Payments() {
  const [currency, setCurrency] = useState("USD");

  return (
    <AppShell sidebar={SIDEBAR}>
      <div className="flex flex-wrap items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">Payment Processing</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Send payments, withdraw funds and manage your account funding.
          </p>
        </div>
        <button className="ml-auto flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold">
          <Settings className="h-4 w-4" /> Payment Limits &amp; Settings
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-6">
          <h2 className="font-semibold">Your WSA Pay Balances</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {balances.map((b) => (
              <div key={b.code} className="rounded-xl border border-border p-4">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <span className="text-xl">{b.flag}</span> {b.code}
                </p>
                <p className="mt-2 text-xl font-bold">{b.amount}</p>
                <p className="text-xs text-muted-foreground">Available Balance</p>
                <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary">
                  View Activity <ArrowRight className="h-3 w-3" />
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm font-semibold">
            Total Balance <span className="font-normal text-muted-foreground">(Approx. USD Equivalent)</span>
          </p>
          <p className="text-2xl font-bold">$1,540.52</p>
          <p className="text-xs text-muted-foreground">Indicative only. Currency conversion not applied.</p>
        </div>

        <div className="surface-card p-6">
          <h2 className="font-semibold">Quick Actions</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-4">
            {ACTIONS.map(({ icon: Icon, title, body, cta, solid }) => (
              <div key={title} className="rounded-xl border border-border p-4 text-center">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-secondary">
                  <Icon className="h-5 w-5 text-primary" />
                </span>
                <p className="mt-3 text-sm font-semibold">{title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{body}</p>
                <button
                  className={`mt-4 w-full rounded-lg py-2 text-xs font-semibold ${
                    solid
                      ? "gradient-primary text-primary-foreground"
                      : "border border-primary/40 text-primary"
                  }`}
                >
                  {cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="surface-card p-6">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">Payments Requiring Your Attention</h2>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-primary-foreground">
              2
            </span>
            <a href="#all" className="ml-auto text-sm font-semibold text-primary">
              View All
            </a>
          </div>
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-border p-4">
              <FileText className="h-6 w-6 text-primary" />
              <div className="min-w-0">
                <p className="text-sm font-semibold">Payment awaiting approval</p>
                <p className="text-xs text-muted-foreground">ABC Logistics • $3,200.00 USD</p>
                <p className="text-xs text-muted-foreground">Reference: INV-20391 • Created: 12 Aug 2026</p>
              </div>
              <button className="ml-auto shrink-0 rounded-lg border border-primary/40 px-3 py-2 text-xs font-semibold text-primary">
                Review &amp; Approve
              </button>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border p-4">
              <Building2 className="h-6 w-6 text-warning" />
              <div className="min-w-0">
                <p className="text-sm font-semibold">GBP bank account not set up</p>
                <p className="text-xs text-muted-foreground">
                  Add your GBP bank account to enable GBP withdrawals.
                </p>
              </div>
              <button className="ml-auto shrink-0 rounded-lg border border-primary/40 px-3 py-2 text-xs font-semibold text-primary">
                Complete Setup
              </button>
            </div>
          </div>
        </div>

        <div className="surface-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent Payment Activity</h2>
            <a href="#all" className="flex items-center gap-1 text-sm font-semibold text-primary">
              View All Payments <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <table className="mt-4 w-full text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b border-border text-left">
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">To / From</th>
                <th className="pb-2 font-medium">Reference</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((r) => (
                <tr key={r.ref} className="border-b border-border/60 last:border-0">
                  <td className="py-3 text-muted-foreground">{r.date}</td>
                  <td className="py-3">{r.type} Payment</td>
                  <td className="py-3 font-medium">{r.company}</td>
                  <td className="py-3 text-muted-foreground">{r.ref}</td>
                  <td className="py-3">{r.amount}</td>
                  <td className="py-3">
                    <StatusPill status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-6">
          <h2 className="font-semibold">Fund Your WSA Pay Account</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add funds to your account using the beneficiary bank details below. Select a currency to view details.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {balances.map((b) => (
              <button
                key={b.code}
                onClick={() => setCurrency(b.code)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold ${
                  currency === b.code ? "border-primary text-primary" : "border-border"
                }`}
              >
                <span>{b.flag}</span> {b.code}
              </button>
            ))}
            <button className="gradient-primary ml-auto flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground">
              View Deposit Instructions <ExternalLink className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-5 flex gap-2 rounded-xl bg-info-soft p-4 text-sm">
            <Info className="h-5 w-5 shrink-0 text-primary" />
            Please use your company name as the payment reference when depositing funds. Funds are usually
            available within 1–2 business days after we receive them.
          </p>
        </div>

        <div className="surface-card p-6">
          <h2 className="font-semibold">Important Notes</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {importantNotes.map((n) => (
              <li key={n} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {n}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}