import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  Building2,
  Download,
  FileText,
  Info,
  Plus,
  Send,
  ShieldAlert,
  Users,
} from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/wsa/AppShell";
import {
  balances,
  depositAccounts,
  importantNotes,
  recentActivity,
} from "@/lib/wsa-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "WSA Pay Dashboard — Balances & recent activity" },
      {
        name: "description",
        content:
          "Track USD, EUR and GBP balances, recent partner payments, deposits and withdrawals in your WSA Pay account.",
      },
      { property: "og:title", content: "WSA Pay Dashboard" },
      { property: "og:description", content: "Balances, quick actions and recent WSA Pay activity." },
    ],
  }),
  component: Dashboard,
});

const QUICK = [
  { icon: Send, title: "Pay a Partner", body: "Send payment to another WSA member.", cta: "Make Payment" },
  { icon: ArrowDownToLine, title: "Deposit Funds", body: "Add funds to your WSA Pay account.", cta: "Deposit" },
  { icon: ArrowUpFromLine, title: "Withdraw Funds", body: "Transfer available funds to your bank account.", cta: "Withdraw" },
  { icon: Users, title: "Manage Partners", body: "Add or remove companies from your partner list.", cta: "View Partners" },
];

const CHART = [2100, 1800, 2400, 1500, 2600, 2200, 1700, 3000, 5200, 3600, 4100, 4600, 4000, 4300, 5100, 5900, 6800];

function Dashboard() {
  const [currency, setCurrency] = useState<keyof typeof depositAccounts>("USD");
  const max = Math.max(...CHART);

  return (
    <AppShell>
      <div className="flex flex-wrap items-start gap-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Remon 👋</h1>
          <p className="mt-1 text-lg font-semibold text-foreground/80">
            Pyramids Freight Services (PFS)
          </p>
          <p className="text-sm text-muted-foreground">WSA Member ID: WSA123456</p>
          <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">
            <span className="h-2 w-2 rounded-full bg-success" /> WSA Pay Account Active
          </span>
        </div>
        <div className="ml-auto flex flex-wrap gap-3">
          <Link
            to="/payments"
            className="gradient-primary flex h-12 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Make a Payment
          </Link>
          <button className="flex h-12 items-center gap-2 rounded-lg bg-primary/10 px-5 text-sm font-semibold text-primary">
            <ArrowDownToLine className="h-4 w-4" /> Deposit Funds
          </button>
          <button className="flex h-12 items-center gap-2 rounded-lg bg-secondary px-5 text-sm font-semibold">
            More Actions
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="surface-card p-6">
          <h2 className="font-semibold">Your WSA Pay Balances</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {balances.map((b) => (
              <div key={b.code} className="rounded-xl bg-secondary/50 p-5">
                <p className="flex items-center gap-2 font-semibold">
                  <span className="text-2xl">{b.flag}</span> {b.code}
                </p>
                <p className="mt-3 text-2xl font-bold">{b.amount}</p>
                <p className="text-sm text-muted-foreground">{b.label}</p>
                <p className="mt-3 flex items-center gap-1 text-sm font-semibold text-primary">
                  {b.ready ? "View Activity" : "Set Up"} <ArrowRight className="h-4 w-4" />
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card p-6">
          <p className="flex items-center gap-2 font-semibold">
            Total Balance <span className="text-sm font-normal text-muted-foreground">(Approx. USD Equivalent)</span>
          </p>
          <p className="mt-3 text-4xl font-bold">$1,540.52</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Indicative only. Currency conversion not applied.
          </p>
          <button className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary/10 text-sm font-semibold text-primary">
            <ArrowUpFromLine className="h-4 w-4" /> Request Withdrawal
          </button>
          <button className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-secondary text-sm font-semibold">
            <FileText className="h-4 w-4" /> View Statements
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="surface-card p-6">
          <h2 className="font-semibold">Quick Actions</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {QUICK.map(({ icon: Icon, title, body, cta }) => (
              <div key={title}>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary">
                  <Icon className="h-5 w-5 text-primary" />
                </span>
                <p className="mt-3 font-semibold">{title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{body}</p>
                <p className="mt-2 flex items-center gap-1 text-sm font-semibold text-primary">
                  {cta} <ArrowRight className="h-3.5 w-3.5" />
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card p-6">
          <h2 className="font-semibold">
            This Month{" "}
            <span className="text-sm font-normal text-muted-foreground">(01 Aug – 13 Aug 2026)</span>
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {[
              ["Money Received", "$24,850", "text-success"],
              ["Money Sent", "$18,420", "text-destructive"],
              ["Pending", "$3,200", "text-warning"],
              ["Transactions", "27", "text-primary"],
            ].map(([label, value, tone]) => (
              <div key={label} className="rounded-xl bg-secondary/50 p-4">
                <p className={`text-xs font-semibold ${tone}`}>{label}</p>
                <p className="mt-1 text-xl font-bold">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex h-40 items-end gap-1.5">
            {CHART.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-primary/70"
                style={{ height: `${(v / max) * 100}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>15 Jul</span>
            <span>22 Jul</span>
            <span>29 Jul</span>
            <span>05 Aug</span>
            <span>12 Aug</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="surface-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent Activity</h2>
            <Link to="/transactions" className="flex items-center gap-1 text-sm font-semibold text-primary">
              View All Transactions <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <table className="mt-4 w-full text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b border-border/40 text-left">
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Company</th>
                <th className="pb-2 font-medium">Reference</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((r) => (
                <tr key={r.ref} className="border-b border-border/40/40 last:border-0">
                  <td className="py-3 text-muted-foreground">{r.date}</td>
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

        <div className="surface-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">2 Items Need Your Attention</h2>
          </div>
          <div className="mt-4 space-y-4">
            <div className="flex gap-3 rounded-xl bg-secondary/50 p-4">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-semibold">Payment awaiting confirmation</p>
                <p className="text-xs text-muted-foreground">ABC Logistics – $3,200</p>
                <p className="mt-2 text-sm font-semibold text-primary">Review Payment →</p>
              </div>
            </div>
            <div className="flex gap-3 rounded-xl bg-secondary/50 p-4">
              <Building2 className="h-6 w-6 text-warning" />
              <div>
                <p className="text-sm font-semibold">Bank information incomplete</p>
                <p className="text-xs text-muted-foreground">
                  Add your GBP bank account before requesting GBP withdrawals.
                </p>
                <p className="mt-2 text-sm font-semibold text-primary">Complete Bank Details →</p>
              </div>
            </div>
          </div>
        </div>

        <div className="surface-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Your Partners</h2>
            <Link to="/partners" className="text-sm font-semibold text-primary">
              View All Partners
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {[
              ["A", "ABC Logistics", "Dubai, UAE"],
              ["G", "Global Cargo Network", "London, UK"],
              ["X", "XYZ Freight", "Singapore"],
            ].map(([i, name, city]) => (
              <div key={name} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
                  {i}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{name}</span>
                  <span className="block text-xs text-muted-foreground">{city}</span>
                </span>
                <button className="ml-auto rounded-lg bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
                  Pay
                </button>
              </div>
            ))}
          </div>
          <button className="mt-5 flex w-full items-center justify-center gap-2 text-sm font-semibold text-primary">
            <Plus className="h-4 w-4" /> Add Trading Partner
          </button>
        </div>
      </div>

      <div className="mt-6 surface-card p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <h2 className="font-semibold">
              WSA Pay Bank Account Details{" "}
              <span className="text-sm font-normal text-muted-foreground">(For Deposits)</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Use the bank details below to fund your WSA Pay account. Select a currency to view details.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Select Currency:</span>
            {(Object.keys(depositAccounts) as (keyof typeof depositAccounts)[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                  currency === c
                    ? "gradient-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
            <button className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold">
              <Download className="h-4 w-4" /> Download Details
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-6 rounded-xl bg-secondary/60 p-5 lg:grid-cols-2">
          <div>
            <p className="font-semibold">{currency} WSA Pay Deposit Account</p>
            <dl className="mt-3 space-y-2 text-sm">
              {depositAccounts[currency].map(([k, v]) => (
                <div key={k} className="flex gap-4">
                  <dt className="w-56 shrink-0 text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <p className="font-semibold">Important Notes</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {importantNotes.map((n) => (
                <li key={n} className="flex gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-5 flex items-center gap-2 rounded-xl bg-warning-soft p-4 text-sm">
          <ShieldAlert className="h-5 w-5 text-warning" />
          Only transfer funds from bank accounts in your company's name. Third-party payments or cash
          deposits are not accepted.
        </p>
      </div>
    </AppShell>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone =
    status === "Completed"
      ? "bg-success-soft text-success"
      : status === "Processing" || status === "Pending"
        ? "bg-warning-soft text-warning"
        : "bg-secondary text-muted-foreground";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{status}</span>;
}