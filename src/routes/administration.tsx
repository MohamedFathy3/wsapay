import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  Eye,
  Info,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/wsa/AppShell";
import { companyUsers } from "@/lib/wsa-data";

export const Route = createFileRoute("/administration")({
  head: () => ({
    meta: [
      { title: "Partner Profile & Administration — WSA Pay" },
      {
        name: "description",
        content:
          "Manage your WSA Pay company profile, users and permissions, USD/EUR/GBP bank accounts and account security.",
      },
      { property: "og:title", content: "Partner Profile — WSA Pay" },
      { property: "og:description", content: "Company profile, users, bank accounts and security settings." },
    ],
  }),
  component: Administration,
});

const SIDEBAR = {
  title: "ADMINISTRATION",
  items: [
    { label: "Partner Profile", to: "/administration" },
    { label: "Users & Permissions", to: "/administration" },
    { label: "Bank Accounts", to: "/administration" },
    { label: "Security", to: "/administration" },
    { label: "Notification Preferences", to: "/administration" },
    { label: "API & Integrations", to: "/administration" },
    { label: "Audit Log", to: "/administration" },
    { label: "Settings", to: "/administration" },
  ],
};

const TABS = ["Company Profile", "Users & Permissions", "Bank Accounts", "Security"] as const;

const BANK_ACCOUNTS = [
  {
    flag: "🇺🇸",
    title: "USD Account",
    status: "Active",
    rows: [
      ["Account Type", "Checking"],
      ["Beneficiary Bank", "Citibank N.A."],
      ["Account Number", "2031194188815"],
      ["SWIFT Code", "CITIUS33XXXX"],
      ["Account Holder", "Pyramids Freight Services (PFS)"],
      ["Balance", "USD 1,376.11"],
    ],
  },
  {
    flag: "🇪🇺",
    title: "EUR Account",
    status: "Active",
    rows: [
      ["Account Type", "IBAN"],
      ["Beneficiary Bank", "QNB AlAhli"],
      ["Account Number", "EG360037070809782031476880350"],
      ["SWIFT Code", "QNBAEGCXXXX"],
      ["Account Holder", "Pyramids Freight Services (PFS)"],
      ["Balance", "EUR 143.63"],
    ],
  },
  {
    flag: "🇬🇧",
    title: "GBP Account",
    status: "Pending Setup",
    rows: [],
  },
];

function Administration() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Company Profile");

  return (
    <AppShell sidebar={SIDEBAR}>
      <div className="flex flex-wrap items-start gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            Partner Profile <Info className="h-4 w-4 text-muted-foreground" />
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage your company profile, users and bank accounts.
          </p>
        </div>
        <div className="ml-auto flex gap-3">
          <button className="flex items-center gap-2 rounded-lg bg-secondary bg-card px-4 py-2.5 text-sm font-semibold">
            <Eye className="h-4 w-4" /> View Public Profile
          </button>
          <button className="gradient-primary flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground">
            {tab === "Users & Permissions" ? (
              <>
                <UserPlus className="h-4 w-4" /> Invite User
              </>
            ) : tab === "Bank Accounts" ? (
              <>
                <Plus className="h-4 w-4" /> Add Bank Account
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4" /> Edit Profile
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-6 flex gap-6 border-b border-border/40">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 pb-3 text-sm font-semibold ${
              tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Company Profile" && (
        <>
          <div className="mt-6 surface-card p-6">
            <h2 className="font-semibold">Company Information</h2>
            <div className="mt-4 grid gap-x-8 gap-y-4 text-sm md:grid-cols-3">
              {[
                ["Company Name", "Pyramids Freight Services (PFS)"],
                ["Address", "Alexandria, Egypt"],
                ["Website", "www.pfsegypt.com"],
                ["Display Name", "Pyramids Freight Services (PFS)"],
                ["Phone", "+20 348 334 330"],
                ["Tax / VAT Number", "N/A"],
                ["WSA Member ID", "WSA123456"],
                ["Email", "info@pfsegypt.com"],
                ["Registration Number", "N/A"],
                ["Company Type", "Freight Forwarder"],
                ["Company Status", "Active"],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-muted-foreground">{k}</p>
                  <p className="font-medium">{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 surface-card p-6">
            <h2 className="font-semibold">Account Overview</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-4">
              {[
                ["Currencies", "2", "Active Accounts"],
                ["Users", "4", "Total Users"],
                ["Pending Actions", "1", "Items to Complete"],
                ["Account Since", "12 Aug 2026", ""],
              ].map(([label, value, hint]) => (
                <div key={label} className="rounded-xl bg-secondary/50 p-4">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-1 text-xl font-bold text-primary">{value}</p>
                  {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === "Users & Permissions" && (
        <div className="mt-6 surface-card p-6">
          <h2 className="font-semibold">Users in Your Company</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage users, roles and permissions for your WSA Pay account.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="flex min-w-64 flex-1 items-center gap-2 rounded-lg bg-secondary/70 px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search users by name or email"
                className="h-10 w-full bg-transparent text-sm outline-none"
              />
            </div>
            <select className="h-10 rounded-lg bg-secondary/70 bg-card px-3 text-sm">
              <option>All Roles</option>
            </select>
          </div>
          <table className="mt-5 w-full text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b border-border/40 text-left">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Email</th>
                <th className="pb-2 font-medium">Role</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {companyUsers.map((u) => (
                <tr key={u.email} className="border-b border-border/40 last:border-0">
                  <td className="py-3">
                    <span className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
                        {u.initials}
                      </span>
                      <span className="font-medium">{u.name}</span>
                      {u.you && (
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold">You</span>
                      )}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">{u.email}</td>
                  <td className="py-3">{u.role}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
                      Active
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">{u.last}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs text-muted-foreground">Showing 1 to 4 of 4 users</p>
        </div>
      )}

      {tab === "Bank Accounts" && (
        <>
          <div className="mt-6 surface-card p-6">
            <h2 className="font-semibold">Your Bank Accounts</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your company bank accounts for deposits and withdrawals.
            </p>
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {BANK_ACCOUNTS.map((a) => (
                <div key={a.title} className="rounded-xl bg-secondary/50 p-5">
                  <p className="flex items-center gap-2 font-semibold">
                    <span className="text-xl">{a.flag}</span> {a.title}
                    <span
                      className={`ml-auto rounded-full px-2.5 py-1 text-xs font-semibold ${
                        a.status === "Active"
                          ? "bg-success-soft text-success"
                          : "bg-warning-soft text-warning"
                      }`}
                    >
                      {a.status}
                    </span>
                  </p>
                  {a.rows.length ? (
                    <>
                      <dl className="mt-4 space-y-2 text-sm">
                        {a.rows.map(([k, v]) => (
                          <div key={k} className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">{k}</dt>
                            <dd className="text-right font-medium">{v}</dd>
                          </div>
                        ))}
                      </dl>
                      <div className="mt-4 flex gap-3">
                        <button className="flex-1 rounded-lg bg-secondary py-2 text-xs font-semibold">
                          View Details
                        </button>
                        <button className="flex-1 rounded-lg bg-primary/10 py-2 text-xs font-semibold text-primary">
                          Edit
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="mt-4">
                      <p className="flex gap-2 rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
                        <Building2 className="h-4 w-4 shrink-0" />
                        GBP bank account is not set up yet. Add your GBP bank account to enable GBP
                        withdrawals.
                      </p>
                      <button className="mt-4 w-full rounded-lg bg-primary/10 py-2 text-xs font-semibold text-primary">
                        + Set Up GBP Account
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 surface-card p-6">
            <p className="font-semibold">Important Notes</p>
            <div className="mt-3 grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
              {[
                "Please allow 72 hours for the processing of withdrawals and deposits in your WSA Pay account.",
                "A minimum account balance of USD 1.00 / EUR 1.00 / GBP 1.00 is required at all times.",
                "Withdrawals will only be sent to the bank account(s) registered in your profile.",
                "Partner to partner transfers within WSA Pay are processed immediately.",
                "Deposits made in any other currency will remain in that currency in your WSA Pay account.",
                "Withdrawals above a certain amount may require additional verification.",
              ].map((n) => (
                <p key={n} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {n}
                </p>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === "Security" && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="surface-card p-6">
            <h2 className="font-semibold">Account Security Overview</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor your account security and manage security settings.
            </p>
            <div className="mt-4 space-y-3">
              {[
                ["Two-Factor Authentication (2FA)", "Protect your account with 2FA", "Enabled"],
                ["Password", "Last changed 20 Jul 2026", ""],
                ["Login Alerts", "Email alerts are enabled", "Enabled"],
                ["Trusted Devices", "3 devices", ""],
                ["Security Questions", "3 questions set", ""],
              ].map(([title, sub, badge]) => (
                <div key={title} className="flex items-center gap-3 rounded-xl bg-secondary/50 p-4">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                  {badge && (
                    <span className="ml-auto rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
                      {badge}
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Recent Login Activity</h2>
              <a href="#activity" className="text-sm font-semibold text-primary">
                View all activity
              </a>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              {[
                ["12 Aug 2026, 11:57 AM", "Alexandria, Egypt"],
                ["11 Aug 2026, 09:21 AM", "Alexandria, Egypt"],
                ["10 Aug 2026, 04:35 PM", "Alexandria, Egypt"],
                ["09 Aug 2026, 02:10 PM", "Cairo, Egypt"],
                ["08 Aug 2026, 10:33 AM", "Alexandria, Egypt"],
              ].map(([when, where]) => (
                <div key={when} className="flex items-center gap-3 border-b border-border/40 pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{when}</p>
                    <p className="text-xs text-muted-foreground">{where}</p>
                  </div>
                  <span className="ml-auto rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
                    Successful
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}