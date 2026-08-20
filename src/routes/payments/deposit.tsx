/* eslint-disable @typescript-eslint/no-explicit-any */
// src/routes/payments/deposit.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowDownToLine,
  Download,
  CheckCircle2,
  ShieldAlert,
  Copy,
  Check,
  Loader2,
  Building2,
  Landmark,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { AppShell } from "@/components/wsa/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { settingService, BankAccount } from "@/services/setting.service";
import { toast } from "sonner";
import api from "@/lib/api"; // ✅ استيراد الـ axios api بتاعك

export const Route = createFileRoute("/payments/deposit")({
  head: () => ({
    meta: [
      { title: "Deposit Funds — WSA Pay" },
      { name: "description", content: "Add funds to your WSA Pay account." },
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
  component: DepositFunds,
});

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
    { label: "Payment Templates", hint: "Manage payment templates", to: "/payments/templates" },
  ],
};

const importantNotes = [
  "Provide your unique WSA ID when making a transfer so funds can be credited.",
  "Only transfers from accounts in your company name are accepted.",
  "Please ensure the bank details match exactly to avoid delays.",
  "Funds typically take 1-2 business days to reflect after we receive confirmation.",
];

// ✅ تعريف نوع الـ Response اللي هترجعه الـ API
type DepositResponse = {
  message: string;
  transaction_id: number;
  status: string;
  amount: number;
  currency: string;
};

// ✅ استخدام الـ api بتاعك (axios) بدل fetch
const makeDeposit = async (data: { amount: number; currency: string; description?: string }) => {
  // بيستخدم أوتوماتيك الـ interceptor بتاعك عشان يضيف الـ Token
  const response = await api.post<DepositResponse>("/wallet/deposit", data);
  return response.data;
};

function DepositFunds() {
  const { user } = useAuth();
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isLoadingBank, setIsLoadingBank] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  // ✅ State خاص بالفورم
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [depositCurrency, setDepositCurrency] = useState<string>("USD");
  const [depositDescription, setDepositDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ جلب الحسابات البنكية من الـ API
  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        setIsLoadingBank(true);
        const data = await settingService.getBankAccounts();
        setBankAccounts(data);
        const activeAccount = data.find((acc) => acc.active);
        if (activeAccount) {
          setSelectedAccountId(activeAccount.id);
        }
      } catch (error) {
        console.error("Error fetching bank accounts:", error);
        toast.error("Failed to load bank account details.");
      } finally {
        setIsLoadingBank(false);
      }
    };
    fetchBankAccounts();
  }, []);

  const selectedAccount = bankAccounts.find((acc) => acc.id === selectedAccountId);

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopied(null), 2000);
  };

  const availableCurrencies = user?.balances || [];

  // ✅ دالة مساعدة لإرجاع رمز العملة المناسب
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      default:
        return "$";
    }
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount greater than 0.");
      return;
    }

    try {
      setIsSubmitting(true);

      // ✅ استقبال البيانات من الـ API
      const response = await makeDeposit({
        amount: amount,
        currency: depositCurrency,
        description: depositDescription || `Deposit to WSA Pay account`,
      });

      // ✅ عرض الـ Toast بتصميم أبيض صافي (مش أسود)
      toast.custom(
        (t) => (
          <div
            onClick={() => toast.dismiss(t)}
            className="relative p-5 rounded-xl shadow-lg border border-slate-200 w-full max-w-md cursor-pointer"
            style={{
              backgroundColor: "#ffffff", // جبرناه يبقى أبيض
              color: "#0f172a", // لون النص أسود غامق
            }}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-600 text-base">
                  ✅ {response.message || "Deposit Successful!"}
                </span>
                <button
                  onClick={() => toast.dismiss(t)}
                  className="text-slate-400 hover:text-slate-700 text-lg leading-none"
                >
                  ×
                </button>
              </div>

              <div className="text-sm text-slate-700 mt-1 space-y-1 border-t border-slate-100 pt-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500">Status:</span>
                  <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    {response.status}
                  </span>
                </div>
                <p>
                  <span className="font-semibold text-slate-500">Transaction ID:</span>{" "}
                  <span className="font-mono text-slate-900 font-medium">
                    #{response.transaction_id}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-slate-500">Amount:</span>{" "}
                  <span className="font-bold text-slate-900">
                    {getCurrencySymbol(response.currency)}
                    {response.amount.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ),
        {
          duration: 6000,
          position: "top-right",
        },
      );

      // تصفير الفورم بعد النجاح
      setDepositAmount("");
      setDepositDescription("");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong during the deposit.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell sidebar={SIDEBAR}>
      <div className="max-w-5xl mx-auto p-4">
        {/* ✅ Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
            <ArrowDownToLine className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Deposit Funds</h1>
            <p className="text-sm text-muted-foreground">
              Add funds to your WSA Pay account by transferring to our partner bank accounts below.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ✅ Left Column: Bank Details */}
          <div className="space-y-6">
            {/* Select Account */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="font-semibold mb-4 text-sm text-slate-600 uppercase tracking-wide">
                Select WSA Pay Deposit Account
              </h2>

              {isLoadingBank ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading accounts...
                </div>
              ) : (
                <div className="grid gap-3">
                  {bankAccounts
                    .filter((acc) => acc.active)
                    .map((account) => (
                      <button
                        key={account.id}
                        onClick={() => setSelectedAccountId(account.id)}
                        className={`text-left rounded-lg border p-3 transition-all ${
                          selectedAccountId === account.id
                            ? "border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/50"
                            : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="h-4 w-4 text-slate-500" />
                          <span className="font-semibold text-sm">{account.accountName}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {account.accountType} • {account.bankCountry}
                        </p>
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Account Details */}
            {selectedAccount && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b pb-3">
                  <div className="flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-blue-600" />
                    <h2 className="font-semibold text-sm text-slate-700">Deposit Instructions</h2>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-muted-foreground">Beneficiary</span>
                    <span className="font-medium text-right">
                      {selectedAccount.beneficiaryName || selectedAccount.accountName}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="text-muted-foreground">Bank</span>
                    <span className="font-medium text-right">
                      {selectedAccount.beneficiaryBank || selectedAccount.bankName}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mt-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground font-bold uppercase">
                        {selectedAccount.accountType === "IBAN" ? "IBAN" : "Account #"}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-800">
                          {selectedAccount.accountNumber || "N/A"}
                        </span>
                        {selectedAccount.accountNumber && (
                          <button
                            onClick={() =>
                              copyToClipboard(selectedAccount.accountNumber!, "Account")
                            }
                            className="text-muted-foreground hover:text-blue-600"
                          >
                            {copied === "Account" ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    {selectedAccount.swift && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground font-bold uppercase">
                          SWIFT
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-slate-800">
                            {selectedAccount.swift}
                          </span>
                          <button
                            onClick={() => copyToClipboard(selectedAccount.swift!, "SWIFT")}
                            className="text-muted-foreground hover:text-blue-600"
                          >
                            {copied === "SWIFT" ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ✅ Right Column: Deposit Form */}
          <div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm sticky top-6">
              <div className="flex items-center gap-2 mb-4 border-b pb-3">
                <Wallet className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-800">Make a Deposit</h2>
              </div>

              <form onSubmit={handleDepositSubmit} className="space-y-5">
                {/* Currency */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Currency
                  </label>
                  <div className="relative">
                    <select
                      value={depositCurrency}
                      onChange={(e) => setDepositCurrency(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {availableCurrencies.length > 0 ? (
                        availableCurrencies.map((b) => (
                          <option key={b.currency} value={b.currency}>
                            {b.currency}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                        </>
                      )}
                    </select>
                    <span className="absolute right-3 top-3 text-slate-400 text-xs pointer-events-none">
                      ▼
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400 font-bold text-sm">
                      {getCurrencySymbol(depositCurrency)}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg pl-8 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Description (Optional) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Description <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Initial deposit, Invoice #123..."
                    value={depositDescription}
                    onChange={(e) => setDepositDescription(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedAccount}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <ArrowDownToLine className="h-4 w-4" /> Deposit Funds
                    </>
                  )}
                </button>

                {/* Info */}
                <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg mt-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800">
                    By clicking "Deposit Funds", you acknowledge that you have transferred the funds
                    to the bank account details displayed on the left.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ✅ Bottom Sections (Full Width) */}
        <div className="mt-8 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Important Notes</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {importantNotes.map((note) => (
                <li key={note} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  {note}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-orange-50 border border-orange-200 p-4">
            <div className="flex gap-3">
              <ShieldAlert className="h-5 w-5 shrink-0 text-orange-600" />
              <div>
                <p className="text-sm font-semibold text-orange-800">Important Security Note</p>
                <p className="text-sm text-orange-700">
                  Only transfer funds from bank accounts strictly registered under your company's
                  legal name. Third-party payments, cash deposits, or personal account transfers are
                  not accepted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
