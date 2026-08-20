/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Download,
  Loader2,
  RefreshCw,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Eye,
  Activity,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { AppShell } from "@/components/wsa/AppShell";
import { reportsService, TransferReportResponse } from "@/services/reports.service";
import {
  format,
  parseISO,
  subDays,
  subMonths,
  subYears,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
// ✅ استيراد مكون الشارت الخارجي
import { LineChart } from "@/components/wsa/LineChart";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Statements — WSA Pay" },
      { name: "description", content: "View your detailed transaction reports and statements." },
    ],
  }),
  component: ReportsPage,
});

const SIDEBAR = {
  title: "REPORTS",
  items: [
    { label: "Transaction Reports", to: "/reports" },
    { label: "Statements", to: "/reports" },
    { label: "Tax Reports", to: "/reports" },
  ],
};

const TRANSACTION_TYPES = ["All", "add", "withdraw", "transfer", "deposit"];
const STATUS_TYPES = ["All", "pending", "approved", "rejected"];

// ✅ دالة لترجمة نوع المعاملة
const getTransactionLabel = (type: string) => {
  const map: Record<string, string> = {
    add: "Admin Add",
    withdraw: "Withdrawal",
    transfer: "Transfer",
    deposit: "Deposit",
  };
  return map[type] || type;
};

// ✅ دالة لتحديد أيقونة ولون نوع المعاملة
const getTransactionMeta = (type: string) => {
  if (type === "deposit" || type === "add") {
    return { icon: ArrowDown, color: "text-emerald-600", bg: "bg-emerald-100", sign: "+" };
  }
  return { icon: ArrowUp, color: "text-rose-600", bg: "bg-rose-100", sign: "-" };
};

// ✅ دالة لعرض حالة المعاملة
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    rejected: "bg-rose-100 text-rose-700 border-rose-200",
  };
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status] || "bg-slate-100 text-slate-700 border-slate-200"}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ✅ دالة لجلب رمز العملة
const CURRENCY_SYMBOL: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};

function ReportsPage() {
  const [report, setReport] = useState<TransferReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ الـ Filters المتقدمة
  const [filters, setFilters] = useState({
    period: "this_month",
    dateFrom: "",
    dateTo: "",
    type: "All",
    status: "All",
    search: "",
  });

  // ✅ الـ Sorting
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // ✅ جلب البيانات عند تغيير الصفحة
  useEffect(() => {
    fetchReport();
  }, [currentPage]);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const data = await reportsService.getTransferReport(currentPage, 50);
      setReport(data);
    } catch (error) {
      console.error("Failed to fetch report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ تصفية بيانات الجدول (المعاملات)
  const filteredData = useMemo(() => {
    if (!report) return [];
    let data = report.data;

    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      data = data.filter(
        (t) =>
          t.description?.toLowerCase().includes(searchLower) ||
          t.type.toLowerCase().includes(searchLower),
      );
    }

    if (filters.type !== "All") {
      data = data.filter((t) => t.type === filters.type);
    }

    if (filters.status !== "All") {
      data = data.filter((t) => t.status === filters.status);
    }

    return data.sort((a, b) => {
      let valA: any = a[sortBy as keyof typeof a];
      let valB: any = b[sortBy as keyof typeof b];

      if (sortBy === "amount") {
        valA = parseFloat(valA);
        valB = parseFloat(valB);
      } else if (sortBy === "created_at") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [report, filters, sortBy, sortOrder]);

  // ✅ إحصائيات الفلترة
  const filteredStats = useMemo(() => {
    const totalAmount = filteredData.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const deposits = filteredData.filter((t) => t.type === "deposit" || t.type === "add");
    const withdrawals = filteredData.filter((t) => t.type === "withdraw" || t.type === "transfer");
    return {
      totalAmount,
      totalTransactions: filteredData.length,
      totalDeposits: deposits.reduce((sum, t) => sum + parseFloat(t.amount), 0),
      totalWithdrawals: withdrawals.reduce((sum, t) => sum + parseFloat(t.amount), 0),
    };
  }, [filteredData]);

  // ✅ تصفير الفلاتر
  const resetFilters = () => {
    setFilters({
      period: "this_month",
      dateFrom: "",
      dateTo: "",
      type: "All",
      status: "All",
      search: "",
    });
  };

  // =================================================================
  // ✅ (جديد) تصفية بيانات الشارت بناءً على الـ period المختار
  // =================================================================
  const chartFilteredData = useMemo(() => {
    if (!report || !report.summary?.daily) return [];

    const daily = report.summary.daily;
    const today = new Date();
    let fromDate: Date;
    let toDate: Date = today;

    // تحديد النطاق الزمني بناءً على الفلتر
    switch (filters.period) {
      case "today":
        fromDate = startOfDay(today);
        break;
      case "yesterday":
        fromDate = startOfDay(subDays(today, 1));
        toDate = endOfDay(subDays(today, 1));
        break;
      case "this_week":
        fromDate = subDays(today, 7);
        break;
      case "this_month":
        fromDate = subMonths(today, 1);
        break;
      case "this_year":
        fromDate = subYears(today, 1);
        break;
      case "custom":
        fromDate = filters.dateFrom ? new Date(filters.dateFrom) : subMonths(today, 1);
        toDate = filters.dateTo ? new Date(filters.dateTo) : today;
        break;
      default:
        fromDate = subMonths(today, 1);
    }

    // فلترة بيانات الأيام
    const filteredDaily = daily.filter((d) => {
      const dayDate = new Date(d.date);
      return isWithinInterval(dayDate, { start: fromDate, end: toDate });
    });

    return {
      amount: filteredDaily.map((d) => ({ date: d.date, value: d.total_amount })),
      count: filteredDaily.map((d) => ({ date: d.date, value: d.transactions })),
    };
  }, [report, filters.period, filters.dateFrom, filters.dateTo]);

  // =================================================================

  return (
    <AppShell sidebar={SIDEBAR}>
      <div className="max-w-[1400px] mx-auto">
        {/* ✅ Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Transaction Reports</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Advanced filtering, sorting, and detailed analysis of all transactions.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold hover:bg-secondary/80">
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <button
              onClick={() => {
                setCurrentPage(1);
                fetchReport();
              }}
              className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </div>

        {/* ✅ Advanced Filters Bar */}
        <div className="mt-6 surface-card p-5">
          <div className="flex flex-wrap items-end gap-4">
            {/* Date Period */}
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs font-semibold text-muted-foreground">Period</label>
              <select
                value={filters.period}
                onChange={(e) => setFilters({ ...filters, period: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="this_week">Last 7 Days</option>
                <option value="this_month">This Month</option>
                <option value="this_year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* Custom Date Range */}
            {filters.period === "custom" && (
              <>
                <div className="flex-1 min-w-[150px]">
                  <label className="text-xs font-semibold text-muted-foreground">From</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="text-xs font-semibold text-muted-foreground">To</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </>
            )}

            {/* Type Filter */}
            <div className="flex-1 min-w-[120px]">
              <label className="text-xs font-semibold text-muted-foreground">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20"
              >
                {TRANSACTION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t === "All" ? "All Types" : getTransactionLabel(t)}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex-1 min-w-[120px]">
              <label className="text-xs font-semibold text-muted-foreground">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20"
              >
                {STATUS_TYPES.map((s) => (
                  <option key={s} value={s}>
                    {s === "All" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="flex-1 min-w-[180px]">
              <label className="text-xs font-semibold text-muted-foreground">Search</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search description..."
                  className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary/20"
                />
                {filters.search && (
                  <button
                    onClick={() => setFilters({ ...filters, search: "" })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="h-10 px-4 rounded-lg border border-destructive/30 text-sm font-semibold text-destructive hover:bg-destructive/10"
            >
              Clear Filters
            </button>
          </div>

          {/* Active Filters Indicators */}
          <div className="mt-3 flex flex-wrap gap-2">
            {filters.type !== "All" && (
              <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                Type: {getTransactionLabel(filters.type)}
                <button
                  onClick={() => setFilters({ ...filters, type: "All" })}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.status !== "All" && (
              <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                Status: {filters.status}
                <button
                  onClick={() => setFilters({ ...filters, status: "All" })}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>

        {/* ✅ Summary Stats for Filtered Data */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="surface-card p-5">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold">${filteredStats.totalAmount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">
              {filteredStats.totalTransactions} Transactions
            </p>
          </div>
          <div className="surface-card p-5 border-l-4 border-emerald-500">
            <p className="text-sm text-muted-foreground">Total In (Deposits)</p>
            <p className="text-2xl font-bold text-emerald-600">
              ${filteredStats.totalDeposits.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Credits to wallet</p>
          </div>
          <div className="surface-card p-5 border-l-4 border-rose-500">
            <p className="text-sm text-muted-foreground">Total Out (Withdrawals)</p>
            <p className="text-2xl font-bold text-rose-600">
              ${filteredStats.totalWithdrawals.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Debits from wallet</p>
          </div>
          <div className="surface-card p-5 border-l-4 border-blue-500">
            <p className="text-sm text-muted-foreground">Net Balance Change</p>
            <p className="text-2xl font-bold text-blue-600">
              ${(filteredStats.totalDeposits - filteredStats.totalWithdrawals).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Income - Expense</p>
          </div>
        </div>

        {/* ✅ Line Charts Section (Updated to use filtered data) */}
        <div className="mt-6 surface-card p-6">
          <div className="flex items-center justify-between mb-4 border-b pb-3">
            <h2 className="flex items-center gap-2 font-semibold">
              <Activity className="h-5 w-5 text-primary" />
              Daily Activity Insights
            </h2>
            <span className="text-xs text-muted-foreground">
              Data for: {filters.period.replace("_", " ")}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 📈 خط المبالغ المالية - بيستخدم بيانات chartFilteredData.amount المفلترة */}
            <LineChart data={chartFilteredData.amount} title="Daily Amounts (USD)" valueLabel="$" />

            {/* 📈 خط عدد المعاملات - بيستخدم بيانات chartFilteredData.count المفلترة */}
            <LineChart
              data={chartFilteredData.count}
              title="Daily Transaction Counts"
              valueLabel="Txns"
            />
          </div>
        </div>

        {/* ✅ Transactions Table (Advanced) */}
        <div className="mt-6 surface-card p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Transactions ({filteredData.length})</h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground">
                  <tr className="border-b border-border/40 text-left">
                    {[
                      { key: "created_at", label: "Date" },
                      { key: "type", label: "Type" },
                      { key: "description", label: "Description" },
                      { key: "amount", label: "Amount" },
                      { key: "status", label: "Status" },
                    ].map((col) => (
                      <th
                        key={col.key}
                        onClick={() => {
                          if (sortBy === col.key) {
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          } else {
                            setSortBy(col.key);
                            setSortOrder("desc");
                          }
                        }}
                        className="pb-3 font-medium cursor-pointer hover:text-foreground"
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          {sortBy === col.key &&
                            (sortOrder === "asc" ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            ))}
                        </div>
                      </th>
                    ))}
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((t) => {
                    const { icon: Icon, color, bg, sign } = getTransactionMeta(t.type);
                    const symbol = CURRENCY_SYMBOL[t.currency] || t.currency;

                    return (
                      <tr
                        key={t.id}
                        className="border-b border-border/40 last:border-0 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="py-3 text-muted-foreground whitespace-nowrap">
                          {format(parseISO(t.created_at), "MMM d, yyyy • h:mm a")}
                        </td>
                        <td className="py-3">
                          <span className="flex items-center gap-2 whitespace-nowrap">
                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${bg}`}
                            >
                              <Icon className={`h-3.5 w-3.5 ${color}`} />
                            </span>
                            {getTransactionLabel(t.type)}
                          </span>
                        </td>
                        <td
                          className="py-3 font-medium max-w-[200px] truncate"
                          title={t.description || t.type}
                        >
                          {t.description || t.type}
                          {t.from_user_name && (
                            <div className="text-xs text-muted-foreground">
                              From: {t.from_user_name}
                            </div>
                          )}
                          {t.to_user_name && (
                            <div className="text-xs text-muted-foreground">
                              To: {t.to_user_name}
                            </div>
                          )}
                        </td>
                        <td className={`py-3 font-bold whitespace-nowrap ${color}`}>
                          {sign} {symbol}{" "}
                          {parseFloat(t.amount).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-3">
                          <StatusBadge status={t.status} />
                        </td>
                        <td className="py-3 text-right">
                          <button className="text-muted-foreground hover:text-primary">
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No transactions match your filters.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
