/* eslint-disable @typescript-eslint/no-explicit-any */
// src/routes/payments/send.tsx
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Send,
  ArrowRight,
  User,
  DollarSign,
  CreditCard,
  Info,
  CheckCircle2,
  Search,
  Loader2,
  Star,
  X,
} from "lucide-react";
import { AppShell } from "@/components/wsa/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { walletService } from "@/services/wallet.service";
import { toast } from "sonner";

// ✅ بنعرّف شكل الـ query params اللي الصفحة ممكن تستقبلها (جاية من زرار Transfer
// في صفحة /payments — partnerId + partnerName) عشان نعبي الشريك تلقائي.
type SendPaymentSearch = {
  partnerId?: number;
  partnerName?: string;
};

export const Route = createFileRoute("/payments/send")({
  head: () => ({
    meta: [
      { title: "Send Payment — WSA Pay" },
      { name: "description", content: "Make a payment to one of your WSA Pay trading partners." },
    ],
  }),
  // ✅ بنحول الـ query params الجاية من الرابط (partnerId/partnerName) لقيم من نوع
  // معروف بدل ما تفضل strings من غير تحقق. لو مش موجودة، بترجع undefined عادي.
  validateSearch: (search: Record<string, unknown>): SendPaymentSearch => ({
    partnerId:
      search.partnerId !== undefined && search.partnerId !== null && search.partnerId !== ""
        ? Number(search.partnerId)
        : undefined,
    partnerName: typeof search.partnerName === "string" ? search.partnerName : undefined,
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
  component: SendPayment,
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

function SendPayment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  // ✅ partnerId / partnerName اللي جايين من رابط "Transfer" في صفحة /payments
  const { partnerId, partnerName } = Route.useSearch();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [partners, setPartners] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [isPartnerPrefilled, setIsPartnerPrefilled] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // ✅ جلب الشركاء والمفضلة
  useEffect(() => {
    fetchPartners();
    fetchFavorites();
  }, []);

  // ✅ لو المستخدم جاي من زرار "Transfer" في صفحة /payments ومعاه partnerId،
  // بنعبي الشريك مباشرة بدل ما نسيبه يدور تاني من الأول.
  useEffect(() => {
    if (!partnerId) return;

    // أول حاجة نحط بيانات مبدئية من الـ URL نفسه عشان يظهر اسمه فورًا من غير ما ننتظر الشبكة
    setSelectedPartner((prev: any) => prev ?? { id: partnerId, name: partnerName, displayName: partnerName });
    setIsPartnerPrefilled(true);

    // بعدين نحاول نجيب بيانات الشريك الكاملة (الإيميل، الصورة...) من نفس اللستة اللي عندنا،
    // أو من نتيجة بحث بالـ id لو الـ API بيدعم كده.
    const matchFromList = [...partners, ...favorites].find((p) => p.id === partnerId);
    if (matchFromList) {
      setSelectedPartner(matchFromList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerId, partnerName]);

  // ✅ لو الليستة اتحدثت بعد كده ولقينا فيها نفس الـ partnerId، نستبدل البيانات المبدئية بالكاملة
  useEffect(() => {
    if (!partnerId) return;
    const matchFromList = [...partners, ...favorites].find((p) => p.id === partnerId);
    if (matchFromList) {
      setSelectedPartner(matchFromList);
    }
  }, [partners, favorites, partnerId]);

  const fetchPartners = async (search: string = "") => {
    try {
      setIsSearching(true);
      const response = await walletService.getAllMembers(1, search);
      setPartners(response.data || []);
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const data = await walletService.getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  // ✅ البحث عن الشركاء
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        fetchPartners(searchTerm);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ✅ العملات المتاحة من رصيد المستخدم
  const availableCurrencies = user?.balances?.filter((b) => parseFloat(b.balance) > 0) || [];
  const selectedBalance = availableCurrencies.find((b) => b.currency === currency);

  // ✅ التحقق من صحة النموذج
  const isFormValid = selectedPartner && amount && parseFloat(amount) > 0 && reference;

  // ✅ إرسال الدفعة
  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      const result = await walletService.transfer({
        to_user_id: selectedPartner.id,
        amount: parseFloat(amount),
        currency: currency,
        description: reference,
      });

      if (result.status === 200) {
        toast.success("Payment sent successfully! 🎉");
        navigate({ to: "/payments" });
      } else {
        toast.error(result.message || "Payment failed");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ اختيار شريك يدويًا من اللستة أو الـ favorites
  const selectPartner = (partner: any) => {
    setSelectedPartner(partner);
    setIsPartnerPrefilled(false);
    setSearchTerm("");
  };

  // ✅ إلغاء اختيار الشريك (سواء المعبى تلقائي أو المختار يدويًا) والرجوع للبحث
  const clearSelectedPartner = () => {
    setSelectedPartner(null);
    setIsPartnerPrefilled(false);
    // بنمسح الـ partnerId من الرابط عشان لو عمل رفريش ما يترجعش يتعبي تاني
    navigate({ to: "/payments/send", search: {}, replace: true });
  };

  return (
    <AppShell sidebar={SIDEBAR}>
      <div className="max-w-4xl mx-auto">
        {/* ✅ Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-primary text-primary-foreground">
            <Send className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Send Payment</h1>
            <p className="text-sm text-muted-foreground">
              Make a payment to one of your WSA Pay trading partners.
            </p>
          </div>
        </div>

        {/* ✅ Steps */}
        <div className="flex items-center gap-4 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  step >= s
                    ? "gradient-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {s}
              </div>
              <span
                className={`text-sm font-medium ${step >= s ? "text-foreground" : "text-muted-foreground"}`}
              >
                {s === 1 ? "Enter Details" : "Review & Confirm"}
              </span>
              {s < 2 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
            </div>
          ))}
        </div>

        {/* ✅ Step 1: Enter Details */}
        {step === 1 && (
          <div className="surface-card p-6">
            <h2 className="font-semibold mb-6">Payment Details</h2>

            {/* ✅ Select Partner */}
            <div className="mb-6">
              <label className="text-sm font-medium block mb-2">
                Pay To (Partner) <span className="text-destructive">*</span>
              </label>

              {/* ✅ لو فيه شريك متعبي (سواء جاي من الرابط أو مختار يدويًا)، بنوريه كـ "كارت" بدل
                  ما نوري صندوق البحث — وبنسيب للمستخدم خيار "Change" لو عايز يبدّله */}
              {selectedPartner ? (
                <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-3 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {selectedPartner.displayName?.[0] || selectedPartner.name?.[0] || "U"}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-medium truncate">
                      {selectedPartner.displayName || selectedPartner.name}
                    </span>
                    {selectedPartner.email ? (
                      <span className="block text-xs text-muted-foreground truncate">
                        {selectedPartner.email}
                      </span>
                    ) : isPartnerPrefilled ? (
                      <span className="block text-xs text-muted-foreground">
                        Selected from Payments page
                      </span>
                    ) : null}
                  </span>
                  <button
                    onClick={clearSelectedPartner}
                    className="shrink-0 flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-secondary"
                  >
                    <X className="h-3.5 w-3.5" /> Change
                  </button>
                </div>
              ) : (
                <>
                  {/* ✅ Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search partners by name or email..."
                      className="h-11 w-full rounded-lg bg-secondary/70 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {/* ✅ Favorites */}
                  {!searchTerm && favorites.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">
                        ⭐ Favorites
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {favorites.map((fav) => (
                          <button
                            key={fav.id}
                            onClick={() => selectPartner(fav)}
                            className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm hover:bg-secondary transition-colors"
                          >
                            <Star className="h-3 w-3 text-warning fill-warning" />
                            {fav.displayName || fav.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ✅ Partners List */}
                  <div className="mt-3 max-h-48 overflow-y-auto space-y-1">
                    {isSearching ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : partners.length > 0 ? (
                      partners.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => selectPartner(p)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-secondary transition-colors"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {p.displayName?.[0] || p.name?.[0] || "U"}
                          </span>
                          <span className="flex-1 text-left">
                            <span className="block font-medium">{p.displayName || p.name}</span>
                            <span className="block text-xs text-muted-foreground">{p.email}</span>
                          </span>
                          {favorites.some((f) => f.id === p.id) && (
                            <Star className="h-3 w-3 text-warning fill-warning" />
                          )}
                        </button>
                      ))
                    ) : searchTerm ? (
                      <p className="text-center py-4 text-sm text-muted-foreground">
                        No partners found
                      </p>
                    ) : null}
                  </div>
                </>
              )}
            </div>

            {/* ✅ Currency & Amount */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium block mb-2">
                  Payment Currency <span className="text-destructive">*</span>
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="h-11 w-full rounded-lg bg-secondary/70 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
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
                  <p className="mt-1 text-xs text-muted-foreground">
                    Available: {selectedBalance.currency}{" "}
                    {parseFloat(selectedBalance.balance).toFixed(2)}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Payment Amount <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="h-11 w-full rounded-lg bg-secondary/70 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    step="0.01"
                    min="0.01"
                  />
                </div>
              </div>
            </div>

            {/* ✅ Reference */}
            <div className="mt-4">
              <label className="text-sm font-medium block mb-2">
                Payment Reference <span className="text-destructive">*</span>
              </label>
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. Invoice No. INV-20391"
                className="h-11 w-full rounded-lg bg-secondary/70 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* ✅ Important Note */}
            <div className="mt-6 rounded-xl bg-info-soft p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold">Important Note</p>
                  <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                    <li>• Payments to partners within WSA Pay are processed immediately.</li>
                    <li>
                      • Ensure your payment reference is correct, it will be shown to your partner.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ✅ Continue Button */}
            <button
              onClick={() => setStep(2)}
              disabled={!selectedPartner || !amount || parseFloat(amount) <= 0 || !reference}
              className="mt-6 w-full gradient-primary h-12 rounded-lg text-sm font-semibold text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Review
            </button>
          </div>
        )}

        {/* ✅ Step 2: Review & Confirm */}
        {step === 2 && (
          <div className="surface-card p-6">
            <h2 className="font-semibold mb-6">Review & Confirm</h2>

            <div className="space-y-4">
              <div className="flex justify-between border-b border-border/40 pb-3">
                <span className="text-muted-foreground">Pay To</span>
                <span className="font-medium">
                  {selectedPartner?.displayName || selectedPartner?.name}
                </span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-3">
                <span className="text-muted-foreground">Currency</span>
                <span className="font-medium">{currency}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-3">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold text-lg">
                  {currency} {parseFloat(amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-3">
                <span className="text-muted-foreground">Reference</span>
                <span className="font-medium">{reference}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-3">
                <span className="text-muted-foreground">Fee</span>
                <span className="font-medium text-success">Free</span>
              </div>
            </div>

            {/* ✅ Summary */}
            <div className="mt-6 rounded-xl bg-secondary/50 p-4">
              <p className="font-semibold">Transfer Summary</p>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">You Pay</span>
                  <span className="font-medium">
                    {currency} {parseFloat(amount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recipient Gets</span>
                  <span className="font-medium">
                    {currency} {parseFloat(amount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transfer Fee</span>
                  <span className="font-medium text-success">Free</span>
                </div>
                <div className="flex justify-between border-t border-border/40 pt-2 font-semibold">
                  <span>Total Deducted</span>
                  <span>
                    {currency} {parseFloat(amount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* ✅ Buttons */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 h-12 rounded-lg bg-secondary text-sm font-semibold hover:bg-secondary/80"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 gradient-primary h-12 rounded-lg text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Send className="inline h-4 w-4 mr-2" /> Confirm Payment
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ✅ Need Help */}
        <div className="mt-6 rounded-xl bg-secondary p-4 text-center">
          <p className="text-sm font-semibold">Need Help?</p>
          <p className="text-xs text-muted-foreground">Our support team is here to help you.</p>
          <button className="mt-2 rounded-lg bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
            Contact Support
          </button>
        </div>
      </div>
    </AppShell>
  );
}
