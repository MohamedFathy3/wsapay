import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  Download,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  User,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx"; // ✅ SheetJS — لازم تتثبت: npm install xlsx --save
import { AppShell } from "@/components/wsa/AppShell";
import { StatusPill } from "./dashboard";
import {
  transactionService,
  Transaction,
  TransactionFilters,
} from "@/services/transaction.service";
import { toast } from "sonner";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions — WSA Pay" },
      {
        name: "description",
        content:
          "Review all WSA Pay transactions: sent payments, received payments, deposits and withdrawals.",
      },
      { property: "og:title", content: "Transactions — WSA Pay" },
      {
        property: "og:description",
        content: "Full transaction history across USD, EUR and GBP accounts.",
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
  component: Transactions,
});

// ✅ خيارات الفلاتر
const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "add", label: "Deposit" },
  { value: "withdraw", label: "Withdrawal" },
  { value: "transfer", label: "Transfer" },
];

const CURRENCY_OPTIONS = [
  { value: "", label: "All Currencies" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

// ✅ خيارات البحث عن المستخدمين
const USER_SEARCH_OPTIONS = [
  { value: "user_name", label: "User Name" },
  { value: "from_user_name", label: "From User" },
  { value: "to_user_name", label: "To User" },
];

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false); // ✅ لودينج زرار الإكسبورت
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("user_name");
  const [type, setType] = useState("");
  const [currency, setCurrency] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(10);

  // ✅ جلب المعاملات
  const fetchTransactions = useCallback(
    async (
      pageNum: number = 1,
      searchTerm: string = "",
      field: string = "user_name",
      typeFilter: string = "",
      currencyFilter: string = "",
      statusFilter: string = "",
    ) => {
      try {
        setIsLoading(true);

        const filters: any = {};
        if (searchTerm) {
          // ✅ البحث حسب الحقل المحدد
          filters[field] = searchTerm;
        }
        if (typeFilter) filters.type = typeFilter;
        if (currencyFilter) filters.currency = currencyFilter;
        if (statusFilter) filters.status = statusFilter;

        const payload: TransactionFilters = {
          filters,
          orderBy: "id",
          orderByDirection: "desc",
          perPage: perPage,
          paginate: 1,
          page: pageNum,
        };

        console.log("🔍 Fetching transactions with filters:", payload);

        const response = await transactionService.getTransactions(payload);
        setTransactions(response.data);
        setTotalPages(response.meta.last_page);
        setTotalItems(response.meta.total);
        setPage(response.meta.current_page);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Failed to load transactions");
      } finally {
        setIsLoading(false);
      }
    },
    [perPage],
  );

  // ✅ تحميل البيانات
  useEffect(() => {
    fetchTransactions(1);
  }, [fetchTransactions]);

  // ✅ البحث مع debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions(1, search, searchField, type, currency, status);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, searchField, type, currency, status, fetchTransactions]);

  // ✅ تغيير الصفحة
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchTransactions(newPage, search, searchField, type, currency, status);
    }
  };

  // ✅ مسح الفلاتر
  const clearFilters = () => {
    setSearch("");
    setSearchField("user_name");
    setType("");
    setCurrency("");
    setStatus("");
    fetchTransactions(1, "", "user_name", "", "", "");
  };

  // ✅ عدد الفلاتر النشطة
  const activeFiltersCount = [search, type, currency, status].filter(Boolean).length;

  // ✅ تنسيق التاريخ
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ✅ الحصول على نوع المعاملة
  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      add: "Deposit",
      withdraw: "Withdrawal",
      transfer: "Transfer",
    };
    return types[type] || type;
  };

  // ✅ أيقونة نوع المعاملة
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      add: "text-success",
      withdraw: "text-destructive",
      transfer: "text-primary",
    };
    return colors[type] || "text-foreground";
  };

  // ✅ نص "From / To" — بنستخدمها في الجدول وفي التصدير عشان تفضل موحدة
  const getFromToText = (transaction: Transaction) => {
    if (transaction.type === "add") {
      return `From: ${transaction.from_user_name || "System"}`;
    }
    if (transaction.type === "withdraw") {
      return `To: ${transaction.to_user_name || "Bank"}`;
    }
    if (transaction.type === "transfer") {
      const isSender = transaction.from_user_id === transaction.user_id;
      return isSender
        ? `To: ${transaction.to_user_name || `User #${transaction.to_user_id}`}`
        : `From: ${transaction.from_user_name || `User #${transaction.from_user_id}`}`;
    }
    return "—";
  };

  // ✅ عرض من/إلى (للجدول)
  const renderFromTo = (transaction: Transaction) => {
    if (transaction.type === "add") {
      return (
        <div className="flex items-center gap-1 text-success">
          <ArrowRight className="h-3 w-3" />
          <span>From: {transaction.from_user_name || "System"}</span>
        </div>
      );
    }
    if (transaction.type === "withdraw") {
      return (
        <div className="flex items-center gap-1 text-destructive">
          <ArrowLeft className="h-3 w-3" />
          <span>To: {transaction.to_user_name || "Bank"}</span>
        </div>
      );
    }
    if (transaction.type === "transfer") {
      const isSender = transaction.from_user_id === transaction.user_id;
      return (
        <div className="flex items-center gap-1 text-primary">
          {isSender ? (
            <>
              <ArrowRight className="h-3 w-3" />
              <span>To: {transaction.to_user_name || `User #${transaction.to_user_id}`}</span>
            </>
          ) : (
            <>
              <ArrowLeft className="h-3 w-3" />
              <span>From: {transaction.from_user_name || `User #${transaction.from_user_id}`}</span>
            </>
          )}
        </div>
      );
    }
    return <span className="text-muted-foreground">—</span>;
  };

  // ✅ أيقونة النوع
  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      add: "💰",
      withdraw: "🏦",
      transfer: "🔄",
    };
    return icons[type] || "📄";
  };

  // ============================================================
  // ✅ تصدير إكسل — بيصدّر كل المعاملات المطابقة للفلاتر الحالية
  // (مش بس الصفحة الظاهرة على الشاشة)
  // ============================================================
  const handleExport = async () => {
    try {
      setIsExporting(true);

      const filters: any = {};
      if (search) filters[searchField] = search;
      if (type) filters.type = type;
      if (currency) filters.currency = currency;
      if (status) filters.status = status;

      // بنجيب كل الصفوف المطابقة للفلاتر في نداء واحد (مش صفحة صفحة)
      const exportPayload: TransactionFilters = {
        filters,
        orderBy: "id",
        orderByDirection: "desc",
        perPage: totalItems > 0 ? totalItems : 1000,
        paginate: 1,
        page: 1,
      };

      const response = await transactionService.getTransactions(exportPayload);
      const rows = response.data;

      if (!rows || rows.length === 0) {
        toast.error("No transactions to export");
        return;
      }

      // ✅ بناء صفوف الإكسل بنفس أعمدة الجدول
      const exportRows = rows.map((t) => ({
        Date: formatDate(t.created_at),
        User: t.user_name || "",
        Type: getTypeLabel(t.type),
        "From / To": getFromToText(t),
        Description: t.description || t.type,
        Currency: t.currency,
        Amount:
          t.type === "add"
            ? parseFloat(t.amount)
            : t.type === "withdraw"
              ? -parseFloat(t.amount)
              : parseFloat(t.amount),
        Status: t.status,
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportRows);
      // ✅ عرض الأعمدة عشان الملف يبقى مقروء من غير ما تتحكم إنت في العرض يدوي
      worksheet["!cols"] = [
        { wch: 14 }, // Date
        { wch: 20 }, // User
        { wch: 12 }, // Type
        { wch: 30 }, // From / To
        { wch: 30 }, // Description
        { wch: 10 }, // Currency
        { wch: 14 }, // Amount
        { wch: 12 }, // Status
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

      const dateStamp = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(workbook, `wsa-pay-transactions-${dateStamp}.xlsx`);

      toast.success(`Exported ${rows.length} transaction${rows.length > 1 ? "s" : ""}`);
    } catch (error) {
      console.error("Error exporting transactions:", error);
      toast.error("Failed to export transactions");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-wrap items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All payments, deposits and withdrawals across your WSA Pay accounts.
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="ml-auto flex items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" /> Export Statement
            </>
          )}
        </button>
      </div>

      <div className="mt-6 surface-card p-6">
        {/* ✅ شريط البحث والفلاتر */}
        <div className="flex flex-wrap items-center gap-3">
          {/* ✅ البحث مع اختيار الحقل */}
          <div className="flex min-w-64 flex-1 items-center gap-2 rounded-lg bg-secondary/70 px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="h-10 w-full bg-transparent text-sm outline-none"
            />
          </div>

          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="h-10 rounded-lg bg-secondary/70 px-3 text-sm outline-none"
          >
            {USER_SEARCH_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="h-10 rounded-lg bg-secondary/70 px-3 text-sm outline-none"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="h-10 rounded-lg bg-secondary/70 px-3 text-sm outline-none"
          >
            {CURRENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 rounded-lg bg-secondary/70 px-3 text-sm outline-none"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {(search || type || currency || status) && (
            <button
              onClick={clearFilters}
              className="flex h-10 items-center gap-1 rounded-lg bg-destructive/10 px-3 text-sm font-semibold text-destructive hover:bg-destructive/20"
            >
              <X className="h-4 w-4" /> Clear
            </button>
          )}
        </div>

        {/* ✅ عداد النتائج */}
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {transactions.length} of {totalItems} transactions
            {activeFiltersCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1">
                <Filter className="h-3 w-3" />
                {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} active
              </span>
            )}
          </span>
          <span>
            Page {page} of {totalPages}
          </span>
        </div>

        {/* ✅ جدول المعاملات */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="mt-4 w-full text-sm">
                <thead className="text-xs text-muted-foreground">
                  <tr className="border-b border-border/40 text-left">
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">User</th>
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 font-medium">From / To</th>
                    <th className="pb-2 font-medium">Description</th>
                    <th className="pb-2 font-medium text-right">Amount</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((t) => (
                      <tr
                        key={t.id}
                        className="border-b border-border/40 last:border-0 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="py-3 text-muted-foreground whitespace-nowrap">
                          {formatDate(t.created_at)}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {t.user_name?.[0] || "U"}
                            </span>
                            <span className="font-medium">{t.user_name}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center gap-1 font-semibold ${getTypeColor(t.type)}`}
                          >
                            <span>{getTypeIcon(t.type)}</span>
                            {getTypeLabel(t.type)}
                          </span>
                        </td>
                        <td className="py-3">{renderFromTo(t)}</td>
                        <td className="py-3 max-w-xs">
                          <span className="truncate block" title={t.description}>
                            {t.description || t.type}
                          </span>
                        </td>
                        <td
                          className={`py-3 text-right font-bold ${
                            t.type === "add"
                              ? "text-success"
                              : t.type === "withdraw"
                                ? "text-destructive"
                                : "text-primary"
                          }`}
                        >
                          {t.type === "add" ? "+" : t.type === "withdraw" ? "-" : ""}
                          {t.currency}{" "}
                          {parseFloat(t.amount).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-3">
                          <StatusPill status={t.status} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        {search || type || currency || status
                          ? "No transactions found matching your filters"
                          : "No transactions available"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ✅ Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="rounded-lg px-4 py-2 bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  <ChevronLeft className="h-4 w-4 inline" /> Previous
                </button>
                <span className="px-4 py-2 text-sm">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="rounded-lg px-4 py-2 bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Next <ChevronRight className="h-4 w-4 inline" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
