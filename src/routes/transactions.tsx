import { createFileRoute } from "@tanstack/react-router";
import { Download, Search } from "lucide-react";
import { AppShell } from "@/components/wsa/AppShell";
import { StatusPill } from "./dashboard";
import { recentActivity } from "@/lib/wsa-data";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions — WSA Pay" },
      {
        name: "description",
        content: "Review all WSA Pay transactions: sent payments, received payments, deposits and withdrawals.",
      },
      { property: "og:title", content: "Transactions — WSA Pay" },
      { property: "og:description", content: "Full transaction history across USD, EUR and GBP accounts." },
    ],
  }),
  component: Transactions,
});

const ROWS = [...recentActivity, ...recentActivity.map((r) => ({ ...r, ref: r.ref + "-B" }))];

function Transactions() {
  return (
    <AppShell>
      <div className="flex flex-wrap items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All payments, deposits and withdrawals across your WSA Pay accounts.
          </p>
        </div>
        <button className="ml-auto flex items-center gap-2 rounded-lg bg-secondary bg-card px-4 py-2.5 text-sm font-semibold">
          <Download className="h-4 w-4" /> Export Statement
        </button>
      </div>

      <div className="mt-6 surface-card p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-64 flex-1 items-center gap-2 rounded-lg bg-secondary/70 px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search by company, reference or amount..."
              className="h-10 w-full bg-transparent text-sm outline-none"
            />
          </div>
          {["All Currencies", "All Types", "All Statuses"].map((f) => (
            <select key={f} className="h-10 rounded-lg bg-secondary/70 bg-card px-3 text-sm">
              <option>{f}</option>
            </select>
          ))}
        </div>

        <table className="mt-5 w-full text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr className="border-b border-border/40 text-left">
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 font-medium">Company</th>
              <th className="pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium">Reference</th>
              <th className="pb-2 font-medium">Amount</th>
              <th className="pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.ref} className="border-b border-border/40 last:border-0">
                <td className="py-3 text-muted-foreground">{r.date}</td>
                <td className="py-3 font-medium">{r.company}</td>
                <td className="py-3">{r.type}</td>
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
    </AppShell>
  );
}