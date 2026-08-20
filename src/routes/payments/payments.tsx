// src/routes/payments/index.tsx
import { CurrencyIcon } from "@/components/wsa/CurrencyIcon";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
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
  Loader2,
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/wsa/AppShell";
import { StatusPill } from "../dashboard";
import { useAuth } from "@/hooks/useAuth";
import { importantNotes } from "@/lib/wsa-data";
import { settingService, BankAccount } from "@/services/setting.service";

export const Route = createFileRoute("/payments/payments")({
  head: () => ({
    meta: [
      { title: "Payment Processing — WSA Pay" },
      {
        name: "description",
        content:
          "Send partner payments, transfer between WSA members, withdraw funds and deposit into your USD, EUR or GBP account.",
      },
      { property: "og:title", content: "Payment Processing — WSA Pay" },
      {
        property: "og:description",
        content: "Send payments, withdraw funds and manage account funding.",
      },
    ],
  }),
  beforeLoad: async () => {
    const { tokenService } = await import("@/services/token.service");
    const token = tokenService.getToken();
    // لو مفيش توكن، طير المستخدم للصفحة الرئيسية
    if (!token) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: Payments,
});

// ✅ الروابط الجديدة للصفحات
const SIDEBAR = {
  title: "PAYMENTS",
  items: [
    { label: "Payment Processing", to: "/payments" },
    { label: "Send Payment", hint: "Pay a partner", to: "/payments/send" },
    { label: "Transfer to Partner", hint: "Partner-to-partner transfer", to: "/payments/send" },
    { label: "Withdraw Funds", hint: "Send to your bank account", to: "/payments/withdraw" },
    { label: "Deposit / Add Funds", hint: "Fund your WSA Pay account", to: "/payments/deposit" },
    { label: "Payment Approvals", hint: "Review and approve payments", to: "/transactions" },
    { label: "Scheduled Payments", hint: "Manage recurring payments", to: "/transactions" },
    // { label: "Payment Templates", hint: "Manage payment templates", to: "/payments/templates" },
  ],
};

const ACTIONS = [
  {
    icon: Send,
    title: "Send Payment",
    body: "Pay a partner within WSA Pay",
    cta: "Send Payment",
    to: "/payments/send",
    solid: true,
  },
  {
    icon: Users,
    title: "Transfer to Partner",
    body: "Partner-to-partner transfer",
    cta: "Transfer",
    to: "/payments/send",
    solid: false,
  },
  {
    icon: ArrowUpFromLine,
    title: "Withdraw Funds",
    body: "Transfer to your bank account",
    cta: "Withdraw",
    to: "/payments/withdraw",
    solid: false,
  },
  {
    icon: ArrowDownToLine,
    title: "Deposit Funds",
    body: "Add funds to your WSA Pay account",
    cta: "Deposit Funds",
    to: "/payments/deposit",
    solid: false,
  },
];

const CURRENCY_SYMBOL = { USD: "$", EUR: "€", GBP: "£" } as const;

function Payments() {
  const { user, isLoading } = useAuth();
  const [currency, setCurrency] = useState("USD");
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isLoadingBank, setIsLoadingBank] = useState(true);

  // ✅ استخراج البيانات من user
  const balances = user?.balances || [];
  const lastTransactions = user?.lastTransactions || [];
  const subAccounts = user?.subAccounts || [];
  const partners = user?.Partners || [];
  const pendingTransfer = user?.pendingTransfer || null;

  // ✅ جلب الحسابات البنكية
  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        setIsLoadingBank(true);
        const data = await settingService.getBankAccounts();
        setBankAccounts(data);
      } catch (error) {
        console.error("Error fetching bank accounts:", error);
      } finally {
        setIsLoadingBank(false);
      }
    };
    fetchBankAccounts();
  }, []);

  // ✅ حساب إجمالي الرصيد
  const totalBalance = balances.reduce((sum, b) => sum + parseFloat(b.balance || "0"), 0);
  const formattedTotal = totalBalance.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // ✅ عرض حالة التحميل
  if (isLoading) {
    return (
      <AppShell sidebar={SIDEBAR}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading payment data...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell sidebar={SIDEBAR}>
      <div className="flex flex-wrap items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">Payment Processing</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Send payments, withdraw funds and manage your account funding.
          </p>
        </div>
        {/* <Link
          to="/payments/settings"
          className="ml-auto flex items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary/80"
        >
          <Settings className="h-4 w-4" /> Payment Limits &amp; Settings
        </Link> */}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-6">
          <h2 className="font-semibold">Your WSA Pay Balances</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {balances.length > 0 ? (
              balances.map((b) => {
                const symbol = CURRENCY_SYMBOL[b.currency as keyof typeof CURRENCY_SYMBOL] || "$";
                return (
                  <div key={b.currency} className="soft-tile p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      <CurrencyIcon code={b.currency} /> {b.currency}
                    </p>
                    <p className="mt-2 text-xl font-bold">
                      {symbol}
                      {parseFloat(b.balance).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">Available Balance</p>
                    <Link
                      to="/transactions"
                      className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary"
                    >
                      View Activity <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-8 text-muted-foreground">
                No balances available
              </div>
            )}
          </div>
          <p className="mt-5 text-sm font-semibold">
            Total Balance{" "}
            <span className="font-normal text-muted-foreground">(Approx. USD Equivalent)</span>
          </p>
          <p className="text-2xl font-bold">${formattedTotal}</p>
          <p className="text-xs text-muted-foreground">
            Indicative only. Currency conversion not applied.
          </p>
        </div>

        <div className="surface-card p-6">
          <h2 className="font-semibold">Quick Actions</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-4">
            {ACTIONS.map(({ icon: Icon, title, body, cta, to, solid }) => (
              <Link
                key={title}
                to={to}
                className="soft-tile hover-lift p-4 text-center transition-colors hover:bg-secondary/50"
              >
                <span className="icon-tile mx-auto h-11 w-11">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-semibold">{title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{body}</p>
                <button
                  className={`mt-4 w-full rounded-lg py-2 text-xs font-semibold ${
                    solid
                      ? "gradient-primary text-primary-foreground"
                      : "bg-primary/10 text-primary hover:bg-primary/20"
                  }`}
                >
                  {cta}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="surface-card p-6">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">Payments Requiring Your Attention</h2>
            {pendingTransfer && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-primary-foreground">
                1
              </span>
            )}
            <Link to="/transactions" className="ml-auto text-sm font-semibold text-primary">
              View All
            </Link>
          </div>
          <div className="mt-4 space-y-4">
            {/* ✅ Pending Transfer */}
            {pendingTransfer && (
              <div className="flex items-center gap-3 soft-tile p-4 border border-warning/30 bg-warning/5">
                <FileText className="h-6 w-6 text-warning" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">Payment awaiting confirmation</p>
                  <p className="text-xs text-muted-foreground">
                    {pendingTransfer.description} • {pendingTransfer.currency}{" "}
                    {parseFloat(pendingTransfer.amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">To: {pendingTransfer.toUser}</p>
                </div>
                <Link
                  to="/transactions"
                  className="ml-auto shrink-0 rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/20"
                >
                  Review &amp; Approve
                </Link>
              </div>
            )}

            {/* ✅ No pending */}
            {!pendingTransfer && (
              <div className="flex items-center gap-3 soft-tile p-4 border border-success/30 bg-success/5">
                <CheckCircle2 className="h-6 w-6 text-success" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">All caught up!</p>
                  <p className="text-xs text-muted-foreground">No pending payments.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="surface-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent Payment Activity</h2>
            <Link
              to="/transactions"
              className="flex items-center gap-1 text-sm font-semibold text-primary"
            >
              View All Payments <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {lastTransactions.length > 0 ? (
            <table className="mt-4 w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b border-border/40 text-left">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Description</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {lastTransactions.slice(0, 5).map((t) => {
                  const symbol = CURRENCY_SYMBOL[t.currency as keyof typeof CURRENCY_SYMBOL] || "$";

                  // ✅ التعديل هنا: نحن نحسب العلامة بناءً على نوع الحركة المالية بشكل دقيق
                  let sign = "+";
                  let colorClass = "text-green-600"; // افتراضي أخضر للإيداع

                  // 1. السحب والتحويلات (فلوس بتطلع من المحفظة) بيكونوا سالب
                  if (t.type === "withdraw" || t.type === "transfer") {
                    sign = "-";
                    colorClass = "text-red-600";
                  }
                  // 2. الإيداع والإضافة (فلوس بتدخل المحفظة) بيكونوا موجب
                  else if (t.type === "deposit" || t.type === "add") {
                    sign = "+";
                    colorClass = "text-green-600";
                  }

                  return (
                    <tr key={t.id} className="border-b border-slate-100 last:border-0">
                      <td className="py-3 text-slate-500 text-xs">
                        {new Date(t.createdAt).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </td>
                      <td className="py-3 capitalize text-slate-700 text-xs font-medium">
                        {t.type}
                      </td>
                      <td className="py-3 font-medium text-slate-700 text-xs truncate max-w-[120px]">
                        {t.description || t.type}
                      </td>
                      <td className={`py-3 text-xs font-bold ${colorClass}`}>
                        {sign}
                        {symbol}
                        {parseFloat(t.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3">
                        <StatusPill
                          status={t.status || (t.type === "add" ? "Completed" : "Processing")}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="mt-4 text-center py-8 text-muted-foreground">
              No recent transactions
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-6">
          <h2 className="font-semibold">Fund Your WSA Pay Account</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add funds to your account using the beneficiary bank details below. Select a currency to
            view details.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {balances.map((b) => (
              <button
                key={b.currency}
                onClick={() => setCurrency(b.currency)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                  currency === b.currency
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:bg-secondary"
                }`}
              >
                <CurrencyIcon code={b.currency} className="h-7 w-7" /> {b.currency}
              </button>
            ))}
            <Link
              to="/payments/deposit"
              className="gradient-primary ml-auto flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              View Deposit Instructions <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-5 flex gap-2 rounded-xl bg-info-soft p-4 text-sm">
            <Info className="h-5 w-5 shrink-0 text-primary" />
            Please use your company name as the payment reference when depositing funds. Funds are
            usually available within 1–2 business days after we receive them.
          </p>
        </div>

        <div className="surface-card p-6">
          <h2 className="font-semibold">Your Partners ({partners.length + subAccounts.length})</h2>
          <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
            {/* ✅ Partners from API */}
            {partners.length > 0 && (
              <>
                {partners.map((partner: any) => (
                  <div key={partner.id} className="flex items-center gap-3 soft-tile p-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
                      {partner.displayName?.[0] || partner.name?.[0] || "P"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">
                        {partner.displayName || partner.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{partner.email}</p>
                    </div>
                    {partner.favorite && (
                      <span className="text-xs text-warning" title="Favorite">
                        ⭐
                      </span>
                    )}
                    <Link
                      to="/payments/send"
                      className="shrink-0 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20"
                    >
                      Transfer
                    </Link>
                  </div>
                ))}
              </>
            )}

            {/* ✅ SubAccounts */}
            {subAccounts.length > 0 && (
              <>
                {subAccounts.map((partner: any) => (
                  <div key={partner.id} className="flex items-center gap-3 soft-tile p-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
                      {partner.displayName?.[0] || partner.name?.[0] || "P"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">
                        {partner.displayName || partner.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{partner.email}</p>
                    </div>
                    <Link
                      to="/payments/send"
                      className="shrink-0 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20"
                    >
                      Transfer
                    </Link>
                  </div>
                ))}
              </>
            )}

            {partners.length === 0 && subAccounts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No partners available</div>
            )}
          </div>
          <Link
            to="/partners"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-primary/30 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
          >
            <Plus className="h-4 w-4" /> Add New Partner
          </Link>
        </div>
      </div>

      {/* ✅ Bank Accounts from API */}
      {!isLoadingBank && bankAccounts.length > 0 && (
        <div className="mt-6 surface-card p-6">
          <h2 className="font-semibold">Your Registered Bank Accounts</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bankAccounts.map((account) => (
              <div
                key={account.id}
                className="rounded-lg bg-secondary/50 p-4 border border-border/40"
              >
                <p className="font-semibold text-sm">{account.accountName}</p>
                <p className="text-xs text-muted-foreground mt-1">{account.bankName || "N/A"}</p>
                <p className="text-xs text-muted-foreground">{account.bankCountry}</p>
                {account.accountNumber && (
                  <p className="text-xs font-mono mt-2">Account: {account.accountNumber}</p>
                )}
                {account.swift && <p className="text-xs font-mono">SWIFT: {account.swift}</p>}
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                      account.active
                        ? "bg-success-soft text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {account.active ? "Active" : "Inactive"}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {account.accountType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 surface-card p-6">
        <h2 className="font-semibold">Important Notes</h2>
        <ul className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
          {importantNotes.map((n) => (
            <li key={n} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {n}
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
