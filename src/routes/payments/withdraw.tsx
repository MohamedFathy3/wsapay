// src/routes/payments/withdraw.tsx
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUpFromLine,
  ArrowRight,
  DollarSign,
  Banknote,
  Info,
  CheckCircle2,
  Loader2,
  Building2,
} from "lucide-react";
import { AppShell } from "@/components/wsa/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import api from "@/lib/api"; // ✅ استخدام الـ axios بتاعك

export const Route = createFileRoute("/payments/withdraw")({
  head: () => ({
    meta: [
      { title: "Withdraw Funds — WSA Pay" },
      { name: "description", content: "Withdraw available funds from your WSA Pay account." },
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
  component: WithdrawFunds,
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

// ✅ تعريف نوع الـ Response اللي هترجعه الـ API
type WithdrawResponse = {
  message: string;
  transaction_id: number;
  status: string;
  amount: number;
  currency: string;
};

// ✅ دالة السحب باستخدام الـ api الخاص بك
const makeWithdraw = async (data: { amount: number; currency: string; description?: string }) => {
  const response = await api.post<WithdrawResponse>("/wallet/withdraw", data);
  return response.data;
};

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

function WithdrawFunds() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // ✅ العملات المتاحة
  const availableCurrencies = user?.balances?.filter((b) => parseFloat(b.balance) > 0) || [];
  const selectedBalance = availableCurrencies.find((b) => b.currency === currency);
  const maxAmount = selectedBalance ? parseFloat(selectedBalance.balance) : 0;

  // ✅ التحقق من الصحة
  const isFormValid =
    amount && parseFloat(amount) > 0 && parseFloat(amount) <= maxAmount && description;

  // ✅ تنفيذ السحب
  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      // ✅ استخدام makeWithdraw الجديدة
      const response = await makeWithdraw({
        amount: parseFloat(amount),
        currency: currency,
        description: description,
      });

      // ✅ عرض Toast أبيض وشيك مع البيانات
      toast.custom(
        (t) => (
          <div
            onClick={() => toast.dismiss(t)}
            className="relative p-5 rounded-xl shadow-lg border border-slate-200 w-full max-w-md cursor-pointer"
            style={{
              backgroundColor: "#ffffff", // أبيض صافي
              color: "#0f172a", // نص أسود غامق
            }}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-600 text-base">
                  ✅ {response.message || "Withdrawal Successful!"}
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

      // تصفير الفورم والتوجه للصفحة الرئيسية بعد النجاح
      setAmount("");
      setDescription("");
      setTimeout(() => {
        navigate({ to: "/payments" });
      }, 2000);
    } catch (error: any) {
      // معالجة الأخطاء من الـ axios
      const message = error.response?.data?.message || error.message || "Withdrawal failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell sidebar={SIDEBAR}>
      <div className="max-w-4xl mx-auto">
        {/* ✅ Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
            <ArrowUpFromLine className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Withdraw Funds</h1>
            <p className="text-sm text-muted-foreground">
              Withdraw available funds from your WSA Pay account to your registered bank account.
            </p>
          </div>
        </div>

        {/* ✅ Steps */}
        <div className="flex items-center gap-4 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  step >= s ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
                }`}
              >
                {s}
              </div>
              <span
                className={`text-sm font-medium ${step >= s ? "text-slate-800" : "text-slate-400"}`}
              >
                {s === 1 ? "Enter Details" : "Review & Confirm"}
              </span>
              {s < 2 && <ArrowRight className="h-4 w-4 text-slate-400" />}
            </div>
          ))}
        </div>

        {/* ✅ Step 1: Enter Details */}
        {step === 1 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-semibold mb-6 text-slate-800">Withdrawal Details</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium block mb-2 text-slate-700">
                  Withdrawal Currency <span className="text-red-500">*</span>
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="h-11 w-full rounded-lg bg-slate-50 border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {availableCurrencies.length > 0 ? (
                    availableCurrencies.map((b) => (
                      <option key={b.currency} value={b.currency}>
                        {b.currency} (Available: {parseFloat(b.balance).toFixed(2)})
                      </option>
                    ))
                  ) : (
                    <option value="USD">USD</option>
                  )}
                </select>
                {selectedBalance && (
                  <p className="mt-1 text-xs text-slate-500">
                    Available: {selectedBalance.currency}{" "}
                    {parseFloat(selectedBalance.balance).toFixed(2)}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium block mb-2 text-slate-700">
                  Withdrawal Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  {/* ✅ تم التعديل هنا: علامة العملة بتتغير حسب الاختيار */}
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    {getCurrencySymbol(currency)}
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="h-11 w-full rounded-lg bg-slate-50 border border-slate-200 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                    step="0.01"
                    min="0.01"
                    max={maxAmount}
                  />
                </div>
                {amount && parseFloat(amount) > maxAmount && (
                  <p className="mt-1 text-xs text-red-500">Amount exceeds available balance</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium block mb-2 text-slate-700">
                Description <span className="text-red-500">*</span>
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Withdrawal request"
                className="h-11 w-full rounded-lg bg-slate-50 border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* ✅ Bank Account Info */}
            <div className="mt-6 rounded-xl bg-blue-50/50 border border-blue-100 p-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Bank Account</p>
                  <p className="text-xs text-slate-500">
                    Withdrawals are sent to your registered bank account only.
                  </p>
                </div>
              </div>
            </div>

            {/* ✅ Important Note */}
            <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Important Note</p>
                  <ul className="mt-1 space-y-1 text-sm text-slate-500">
                    <li>• Withdrawals are sent to your registered bank account only.</li>
                    <li>
                      • Withdrawals above a certain amount may require additional verification.
                    </li>
                    <li>• Processing time: 1-2 business days.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ✅ Continue Button */}
            <button
              onClick={() => setStep(2)}
              disabled={!isFormValid}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-lg text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue to Review
            </button>
          </div>
        )}

        {/* ✅ Step 2: Review & Confirm */}
        {step === 2 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-semibold mb-6 text-slate-800">Review & Confirm</h2>

            <div className="space-y-4">
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-500">Currency</span>
                <span className="font-medium text-slate-800">{currency}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-500">Amount</span>
                <span className="font-bold text-lg text-slate-900">
                  {getCurrencySymbol(currency)}
                  {parseFloat(amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-500">Description</span>
                <span className="font-medium text-slate-800">{description}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-slate-500">Bank Account</span>
                <span className="font-medium text-slate-800">Registered Bank Account</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Processing Time</span>
                <span className="font-medium text-slate-800">1-2 business days</span>
              </div>
            </div>

            {/* ✅ Buttons */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 h-12 rounded-lg bg-slate-100 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 h-12 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <ArrowUpFromLine className="inline h-4 w-4 mr-2" /> Confirm Withdrawal
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ✅ Need Help */}
        <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4 text-center">
          <p className="text-sm font-semibold text-slate-800">Need Help?</p>
          <p className="text-xs text-slate-500">Our support team is here to help you.</p>
          <button className="mt-2 rounded-lg bg-blue-600/10 px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-600/20 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </AppShell>
  );
}
