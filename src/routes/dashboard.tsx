import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  Download,
  DollarSign,
  Euro,
  FileText,
  PoundSterling,
  Plus,
  Send,
  ShieldAlert,
  Users,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/wsa/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { depositAccounts } from "@/lib/wsa-data";
import { settingService, BankAccount } from "@/services/setting.service";
import api from "@/lib/api"; // ✅ استيراد الـ api بتاعك

export const Route = createFileRoute("/dashboard")({
  // ✅ حماية الصفحة: لو مفيش توكن، حول للصفحة الرئيسية (Login)
  beforeLoad: async () => {
    const { tokenService } = await import("@/services/token.service");
    const token = tokenService.getToken();
    if (!token) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: Dashboard,
});

const QUICK = [
  {
    icon: Send,
    title: "Pay a Partner",
    body: "Send payment to another WSA member.",
    cta: "Make Payment",
    to: "/payments/send",
  },
  {
    icon: ArrowDownToLine,
    title: "Deposit Funds",
    body: "Add funds to your WSA Pay account.",
    cta: "Deposit",
    to: "/payments/deposit",
  },
  {
    icon: ArrowUpFromLine,
    title: "Withdraw Funds",
    body: "Transfer available funds to your bank account.",
    cta: "Withdraw",
    to: "/payments/withdraw",
  },
  {
    icon: Users,
    title: "Manage Partners",
    body: "Add or remove companies from your partner list.",
    cta: "View Partners",
    to: "/partners",
  },
];

const CURRENCY_ICON = { USD: DollarSign, EUR: Euro, GBP: PoundSterling } as const;
const CURRENCY_SYMBOL = { USD: "$", EUR: "€", GBP: "£" } as const;
const CURRENCY_COLORS = {
  USD: "text-blue-600",
  EUR: "text-purple-600",
  GBP: "text-green-600",
} as const;

// ============================================================
// ✅ الشكل الحقيقي لـ response بتاع /user/transfer-report
// (متطابق مع الـ JSON اللي بعتّه، مش الشكل القديم اللي كان فيه
// summary.totalTransfers / monthly[])
// ============================================================
interface ReportTransactionType {
  amount: number;
  transactions: number;
}

interface ReportTransaction {
  id: number;
  user_id: number;
  user_name: string | null;
  from_user_id: number | null;
  from_user_name: string | null;
  to_user_id: number | null;
  to_user_name: string | null;
  amount: string;
  currency: "USD" | "EUR" | "GBP" | string;
  type: "add" | "withdraw" | "transfer" | "deposit" | string;
  description: string | null;
  status: "approved" | "pending" | "rejected" | string;
  read: number;
  created_at: string;
  updated_at: string;
}

interface ReportDailyEntry {
  date: string;
  day: string;
  day_name: string;
  total_amount: number;
  transactions: number;
  types: {
    add: ReportTransactionType;
    withdraw: ReportTransactionType;
    transfer: ReportTransactionType;
    deposit: ReportTransactionType;
  };
}

interface TransferReportResponse {
  data: ReportTransaction[];
  summary: {
    month: string;
    from: string;
    to: string;
    total_amount: number;
    transactions: number;
    types: {
      add: ReportTransactionType;
      withdraw: ReportTransactionType;
      transfer: ReportTransactionType;
      deposit: ReportTransactionType;
    };
    daily: ReportDailyEntry[];
  };
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  result: string;
  message: string;
  status: number;
}

function Dashboard() {
  const { user, isLoading } = useAuth();
  const [currency, setCurrency] = useState<keyof typeof depositAccounts>("USD");
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isLoadingBank, setIsLoadingBank] = useState(false);

  // ✅ State للـ Report (الشكل الجديد: summary + data[] + daily[])
  const [reportSummary, setReportSummary] = useState<TransferReportResponse["summary"] | null>(
    null,
  );
  const [reportRows, setReportRows] = useState<ReportTransaction[]>([]);
  const [reportTotal, setReportTotal] = useState<number>(0);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  // ✅ استخراج البيانات من user
  const userData = user;
  const balances = userData?.balances || [];
  const lastTransactions = userData?.lastTransactions || [];
  const pendingTransfer = userData?.pendingTransfer || null;
  const partners = userData?.Partners || [];
  const userName = userData?.name || "User";
  const companyName = userData?.displayName || userData?.email_company || "Company";
  const memberId = userData?.id ? `WSA${String(userData.id).padStart(6, "0")}` : "WSA000000";
  const status = userData?.status || "active";

  // ✅ التحقق من اكتمال الملف الشخصي
  const isProfileComplete =
    userData?.address_one &&
    userData?.city &&
    userData?.state &&
    userData?.postalCode &&
    userData?.first_name_administrator;

  // ✅ جلب الحسابات البنكية وجلب الـ Report
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingBank(true);
        setIsLoadingReport(true);

        // جلب الحسابات
        const accounts = await settingService.getBankAccounts();
        setBankAccounts(accounts);

        // ✅ جلب الـ Report من الـ API — الشكل الحقيقي هو:
        // { data: [...], summary: {...}, meta: {...}, result, message, status }
        const response = await api.get<TransferReportResponse>("/user/transfer-report");
        if (response.data?.result === "success") {
          setReportSummary(response.data.summary ?? null);
          setReportRows(response.data.data ?? []);
          setReportTotal(response.data.meta?.total ?? response.data.summary?.transactions ?? 0);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoadingBank(false);
        setIsLoadingReport(false);
      }
    };
    fetchData();
  }, []);

  // ✅ حساب إجمالي الرصيد
  const totalBalance = balances.reduce((sum, b) => sum + parseFloat(b.balance || "0"), 0);
  const formattedTotal = totalBalance.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // ============================================================
  // ✅ إحصائيات المعاملات — الشهر الحالي (من reportSummary)
  // ============================================================
  const totalTransactions = reportSummary ? reportTotal : lastTransactions.length;

  // ⚠️ الـ API الحالي مش راجع تقسيم approved / pending / rejected
  // جوه summary زي ما بيرجّع types (add/withdraw/transfer/deposit).
  // فبنحسبهم من الـ data[] اللي راجعة، وده تقريبي لأنها صفحة واحدة بس
  // (10 عناصر من أصل reportTotal). لو حبيت رقم دقيق 100% لازم الباك إند
  // يضيف approved/pending/rejected جوه summary زي types بالظبط.
  const sourceForStatusCounts = reportSummary ? reportRows : lastTransactions;
  const pendingTransactions = sourceForStatusCounts.filter((t) => t.status === "pending").length;
  const approvedTransactions = sourceForStatusCounts.filter((t) => t.status === "approved").length;

  // ✅ إجمالي المستلم / المرسل الشهر ده — من summary.types (دقيق ومش تقريبي)
  const totalReceived = reportSummary
    ? (reportSummary.types.deposit?.amount || 0) + (reportSummary.types.add?.amount || 0)
    : lastTransactions
        .filter((t) => t.type === "add" || t.type === "deposit")
        .reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0);

  const totalSent = reportSummary
    ? (reportSummary.types.withdraw?.amount || 0) + (reportSummary.types.transfer?.amount || 0)
    : lastTransactions
        .filter((t) => t.type === "withdraw" || t.type === "transfer")
        .reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0);

  // ✅ الحسابات اللي رصيدها صفر
  const zeroBalances = balances.filter((b) => parseFloat(b.balance) === 0);
  const hasZeroBalance = zeroBalances.length > 0;

  // ============================================================
  // ✅ بيانات الشارت — بقت مبنية على summary.daily (مش monthly اللي مش موجود أصلًا)
  // بنعرض آخر 14 يوم بس عشان الشارت ميبقاش مزنوق
  // ============================================================
  const chartData = (reportSummary?.daily || []).slice(-14);
  const chartValues = chartData.map((d) => d.transactions);
  const chartMax = Math.max(...chartValues, 1);

  // ✅ عرض حالة التحميل
  if (isLoading || isLoadingReport) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  // ✅ حساب عدد التنبيهات
  const alertCount =
    (pendingTransfer ? 1 : 0) + (!isProfileComplete ? 1 : 0) + (hasZeroBalance ? 1 : 0);

  return (
    <AppShell>
      <div className="flex flex-wrap items-start gap-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {userName}</h1>
          <p className="mt-1 text-lg font-semibold text-foreground/80">{companyName}</p>
          <p className="text-sm text-muted-foreground">WSA Member ID: {memberId}</p>
          <span
            className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
              status === "approved" || status === "active"
                ? "bg-success-soft text-success"
                : "bg-warning-soft text-warning"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                status === "approved" || status === "active" ? "bg-success" : "bg-warning"
              }`}
            />
            WSA Pay Account {status === "approved" || status === "active" ? "Active" : "Pending"}
          </span>
        </div>
        <div className="ml-auto flex flex-wrap gap-3">
          <Link
            to="/payments/send"
            className="gradient-primary flex h-12 items-center gap-2 rounded-lg px-5 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Make a Payment
          </Link>
          <Link
            to="/payments/deposit"
            className="flex h-12 items-center gap-2 rounded-lg bg-primary/10 px-5 text-sm font-semibold text-primary"
          >
            <ArrowDownToLine className="h-4 w-4" /> Deposit Funds
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="surface-card p-6">
          <h2 className="font-semibold">Your WSA Pay Balances</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {balances.length > 0 ? (
              balances.map((b) => {
                const Icon = CURRENCY_ICON[b.currency as keyof typeof CURRENCY_ICON] || DollarSign;
                const symbol = CURRENCY_SYMBOL[b.currency as keyof typeof CURRENCY_SYMBOL] || "$";
                const color =
                  CURRENCY_COLORS[b.currency as keyof typeof CURRENCY_COLORS] || "text-foreground";
                const isZero = parseFloat(b.balance) === 0;
                return (
                  <div
                    key={b.currency}
                    className={`soft-tile hover-lift p-5 ${isZero ? "border-2 border-warning/40 bg-warning/5" : ""}`}
                  >
                    <p className="flex items-center gap-2.5 font-semibold">
                      <span className="icon-tile h-9 w-9">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      {b.currency}
                      {isZero && (
                        <span className="text-[10px] font-normal text-warning bg-warning/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Empty
                        </span>
                      )}
                    </p>
                    <p className={`mt-3 text-2xl font-bold tracking-tight ${color}`}>
                      {symbol}
                      {parseFloat(b.balance).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    {isZero && (
                      <Link
                        to="/payments/deposit"
                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80"
                      >
                        <ArrowDownToLine className="h-4 w-4" /> Deposit Now
                      </Link>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-8 text-muted-foreground">
                No balances available
              </div>
            )}
          </div>
        </div>

        <div className="surface-card p-6">
          <p className="flex items-center gap-2 font-semibold">
            Total Balance{" "}
            <span className="text-sm font-normal text-muted-foreground">
              (Approx. USD Equivalent)
            </span>
          </p>
          <p className="mt-3 text-4xl font-bold">${formattedTotal}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Indicative only. Currency conversion not applied.
          </p>
          <Link
            to="/payments/withdraw"
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary/10 text-sm font-semibold text-primary hover:bg-primary/20"
          >
            <ArrowUpFromLine className="h-4 w-4" /> Request Withdrawal
          </Link>
          <Link
            to="/transactions"
            className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-secondary text-sm font-semibold hover:bg-secondary/80"
          >
            <FileText className="h-4 w-4" /> View Statements
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="surface-card p-6">
          <h2 className="font-semibold">Quick Actions</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {QUICK.map(({ icon: Icon, title, body, cta, to }) => (
              <Link
                key={title}
                to={to}
                className="soft-tile hover-lift p-4 block transition-colors hover:bg-secondary/50"
              >
                <span className="icon-tile h-11 w-11">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 font-semibold">{title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{body}</p>
                <p className="mt-2 flex items-center gap-1 text-sm font-semibold text-primary">
                  {cta} <ArrowRight className="h-3.5 w-3.5" />
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="surface-card p-6">
          <h2 className="font-semibold">
            This Month{" "}
            <span className="text-sm font-normal text-muted-foreground">
              (
              {reportSummary?.month ??
                new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              )
            </span>
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {[
              ["Money Received", `$${totalReceived.toFixed(2)}`, "text-success"],
              ["Money Sent", `$${totalSent.toFixed(2)}`, "text-destructive"],
              ["Pending", String(pendingTransactions), "text-warning"],
              ["Transactions", String(totalTransactions), "text-primary"],
            ].map(([label, value, tone]) => (
              <div key={label} className="soft-tile p-4">
                <p className={`text-xs font-semibold ${tone}`}>{label}</p>
                <p className="mt-1 text-xl font-bold">{value}</p>
              </div>
            ))}
          </div>

          {/* ✅ الشارت بقى شغال على summary.daily (مش monthly اللي مش موجود في الـ API) */}
          <div className="mt-6 flex h-40 items-end gap-1.5">
            {chartData.length > 0 ? (
              chartData.map((d, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-[image:var(--gradient-primary)] opacity-85"
                  style={{ height: `${(d.transactions / chartMax) * 100}%` }}
                  title={`${d.day_name} ${d.day}: ${d.transactions} transfers ($${d.total_amount})`}
                />
              ))
            ) : (
              <div className="w-full text-center text-muted-foreground text-xs pt-8">
                No transfer data available for chart
              </div>
            )}
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            {chartData.length > 0 ? (
              chartData.map((d, i) => <span key={i}>{d.day}</span>)
            ) : (
              <>
                <span>No Data</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="surface-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent Activity</h2>
            <Link
              to="/transactions"
              className="flex items-center gap-1 text-sm font-semibold text-primary"
            >
              View All Transactions <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {lastTransactions.length > 0 ? (
            <table className="mt-4 w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b border-border/40 text-left">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Description</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {lastTransactions.slice(0, 5).map((t) => {
                  const symbol = CURRENCY_SYMBOL[t.currency as keyof typeof CURRENCY_SYMBOL] || "$";

                  // ✅ المنطق الذكي للعلامة (+ أو -)
                  let sign = "+";
                  let colorClass = "text-success"; // افتراضي أخضر للإيداع

                  // السحب والتحويلات (فلوس بتطلع من المحفظة) بيكونوا سالب
                  if (t.type === "withdraw" || t.type === "transfer") {
                    sign = "-";
                    colorClass = "text-destructive"; // أحمر
                  }
                  // الإيداع والإضافة (فلوس بتدخل المحفظة) بيكونوا موجب
                  else if (t.type === "deposit" || t.type === "add") {
                    sign = "+";
                    colorClass = "text-success"; // أخضر
                  }

                  return (
                    <tr key={t.id} className="border-b border-border/40 last:border-0">
                      <td className="py-3 text-muted-foreground text-xs">
                        {new Date(t.createdAt).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </td>
                      <td className="py-3 font-medium text-xs truncate max-w-[120px]">
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

        <div className="surface-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">
              Items Need Your Attention
              {alertCount > 0 && (
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-primary-foreground">
                  {alertCount}
                </span>
              )}
            </h2>
          </div>
          <div className="mt-4 space-y-4">
            {/* ✅ Pending Transfer */}
            {pendingTransfer && (
              <div className="flex gap-3 soft-tile p-4 border-2 border-warning/30 bg-warning/5">
                <span className="icon-tile h-10 w-10 shrink-0 text-warning">
                  <Clock className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Payment awaiting confirmation</p>
                  <p className="text-xs text-muted-foreground">
                    {pendingTransfer.description || "Pending transfer"} • {pendingTransfer.currency}{" "}
                    {parseFloat(pendingTransfer.amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    To: {pendingTransfer.toUser || `User #${pendingTransfer.toUserId}`}
                  </p>
                  <Link
                    to="/transactions"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80"
                  >
                    Review Payment →
                  </Link>
                </div>
              </div>
            )}

            {/* ✅ Zero Balance Alert */}
            {hasZeroBalance && (
              <div className="flex gap-3 soft-tile p-4 border-2 border-warning/30 bg-warning/5">
                <span className="icon-tile h-10 w-10 shrink-0 text-warning">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Zero balance accounts</p>
                  <p className="text-xs text-muted-foreground">
                    {zeroBalances.map((b) => b.currency).join(", ")} accounts have zero balance
                  </p>
                  <Link
                    to="/payments/deposit"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80"
                  >
                    Deposit Funds →
                  </Link>
                </div>
              </div>
            )}

            {/* ✅ Profile Incomplete */}
            {!isProfileComplete && (
              <div className="flex gap-3 soft-tile p-4 border-2 border-warning/30 bg-warning/5">
                <span className="icon-tile h-10 w-10 shrink-0 text-warning">
                  <AlertCircle className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Complete your profile</p>
                  <p className="text-xs text-muted-foreground">
                    Add your company details to improve your WSA Pay experience.
                  </p>
                  <Link
                    to="/profile"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80"
                  >
                    Complete Profile →
                  </Link>
                </div>
              </div>
            )}

            {/* ✅ No pending items */}
            {!pendingTransfer && !hasZeroBalance && isProfileComplete && (
              <div className="flex gap-3 soft-tile p-4 border-2 border-success/30 bg-success/5">
                <span className="icon-tile h-10 w-10 shrink-0 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">All caught up!</p>
                  <p className="text-xs text-muted-foreground">
                    No pending items require your attention.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="surface-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Your Partners</h2>
            <Link to="/partners" className="text-sm font-semibold text-primary">
              View All
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {partners.length > 0 ? (
              partners.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center gap-3 soft-tile p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
                    {p.displayName?.[0] || p.name?.[0] || "P"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      {p.displayName || p.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">{p.email}</span>
                  </span>
                  {p.favorite && (
                    <span className="text-xs text-warning shrink-0" title="Favorite">
                      ⭐
                    </span>
                  )}
                  <Link
                    to="/payments/send"
                    className="ml-auto shrink-0 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20"
                  >
                    Pay
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">No partners available</div>
            )}
          </div>
          <Link
            to="/partners"
            className="mt-5 flex w-full items-center justify-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
          >
            <Plus className="h-4 w-4" /> Add Trading Partner
          </Link>
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
              Use the bank details below to fund your WSA Pay account.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold hover:bg-secondary/80">
              <Download className="h-4 w-4" /> Download Details
            </button>
          </div>
        </div>

        {isLoadingBank ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : bankAccounts.length > 0 ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bankAccounts.map((account) => (
              <div
                key={account.id}
                className="rounded-xl bg-secondary/60 p-4 border border-border/40"
              >
                <p className="font-semibold text-sm">{account.accountName}</p>
                <p className="text-xs text-muted-foreground mt-1">{account.bankName || "N/A"}</p>
                <p className="text-xs text-muted-foreground">{account.bankCountry}</p>
                {account.accountNumber && (
                  <p className="text-xs font-mono mt-2">Account: {account.accountNumber}</p>
                )}
                {account.swift && <p className="text-xs font-mono">SWIFT: {account.swift}</p>}
                {account.iban && <p className="text-xs font-mono">IBAN: {account.iban}</p>}
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
        ) : (
          <div className="mt-5 text-center py-8 text-muted-foreground">
            No bank accounts available
          </div>
        )}

        <p className="mt-5 flex items-center gap-2 rounded-xl bg-warning-soft p-4 text-sm">
          <ShieldAlert className="h-5 w-5 text-warning" />
          Only transfer funds from bank accounts in your company's name. Third-party payments or
          cash deposits are not accepted.
        </p>
      </div>
    </AppShell>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone =
    status === "approved" || status === "Completed" || status === "completed"
      ? "bg-success-soft text-success"
      : status === "pending" || status === "Processing" || status === "processing"
        ? "bg-warning-soft text-warning"
        : status === "rejected" || status === "Rejected" || status === "cancelled"
          ? "bg-destructive/10 text-destructive"
          : "bg-secondary text-muted-foreground";
  const label =
    status === "approved"
      ? "Completed"
      : status === "pending"
        ? "Pending"
        : status === "rejected"
          ? "Rejected"
          : status;
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{label}</span>;
}
