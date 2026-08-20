/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { CurrencyIcon } from "@/components/wsa/CurrencyIcon";
import { Building2, CheckCircle2, Loader2, Trash2, X, Pencil, Plus } from "lucide-react";
import { settingService, BankAccountPayload } from "@/services/settingsaccount.service";
import { toast } from "sonner";

interface BankAccountsTabProps {
  bankAccounts: any[];
  refreshUser: () => Promise<void>;
}

export function BankAccountsTab({ bankAccounts, refreshUser }: BankAccountsTabProps) {
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<BankAccountPayload>({});

  const openModal = (account: any = null) => {
    setEditingAccount(account);
    if (account) {
      setFormData({
        account_name: account.account_name || "",
        account_type: account.account_type || "",
        account_number: account.account_number || "",
        bank_name: account.bank_name || "",
        bank_country: account.bank_country || "",
        beneficiary_bank: account.beneficiary_bank || "",
        beneficiary_bank_address: account.beneficiary_bank_address || "",
        swift: account.swift || "",
        routing_number: account.routing_number || "",
        beneficiary_name: account.beneficiary_name || "",
        beneficiary_address: account.beneficiary_address || "",
        beneficiary_account_number: account.beneficiary_account_number || "",
      });
    } else {
      setFormData({});
    }
    setIsModalOpen(true);
  };

  const handleSaveAccount = async () => {
    try {
      setIsSaving(true);
      if (editingAccount) {
        await settingService.updateBankAccount(editingAccount.id, formData);
        toast.success("Account updated successfully!");
      } else {
        await settingService.createBankAccount(formData);
        toast.success("Account created successfully!");
      }
      setIsModalOpen(false);
      await refreshUser();
    } catch (error: any) {
      toast.error(error.message || "Failed to save account");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async (id: number) => {
    if (!confirm("Are you sure you want to delete this bank account?")) return;
    try {
      await settingService.deleteBankAccounts([id]);
      toast.success("Account deleted successfully!");
      await refreshUser();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account");
    }
  };

  return (
    <>
      <div className="mt-6 surface-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-semibold">Your Bank Accounts</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your company bank accounts for deposits and withdrawals.
            </p>
          </div>

          {/* ✅ زر الإضافة موجود هنا جوه التاب */}
          <button
            onClick={() => openModal(null)}
            className="gradient-primary flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Add Bank Account
          </button>
        </div>

        {bankAccounts.length === 0 ? (
          <div className="mt-5 text-center py-12 text-muted-foreground">
            No bank accounts found.
            <button
              onClick={() => openModal(null)}
              className="mt-2 ml-2 text-primary font-semibold hover:underline"
            >
              Add a new bank account.
            </button>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {bankAccounts.map((account: any) => {
              const currencyCode = account.account_name?.includes("USD")
                ? "USD"
                : account.account_name?.includes("EUR")
                  ? "EUR"
                  : "GBP";

              return (
                <div key={account.id} className="soft-tile p-5">
                  <p className="flex items-center gap-2 font-semibold">
                    <CurrencyIcon code={currencyCode} /> {account.account_name || currencyCode}
                  </p>

                  {account.account_number || account.beneficiary_bank ? (
                    <>
                      <dl className="mt-4 space-y-2 text-sm">
                        {account.account_number && (
                          <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Account #</dt>
                            <dd className="text-right font-medium">{account.account_number}</dd>
                          </div>
                        )}
                        {account.beneficiary_bank && (
                          <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Bank</dt>
                            <dd className="text-right font-medium">{account.beneficiary_bank}</dd>
                          </div>
                        )}
                        {account.swift && (
                          <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">SWIFT</dt>
                            <dd className="text-right font-medium">{account.swift}</dd>
                          </div>
                        )}
                      </dl>
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={() => openModal(account)}
                          className="flex-1 rounded-lg bg-secondary py-2 text-xs font-semibold hover:bg-secondary/80"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAccount(account.id)}
                          className="flex-1 rounded-lg bg-destructive/10 py-2 text-xs font-semibold text-destructive hover:bg-destructive/20"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="mt-4">
                      <p className="flex gap-2 rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
                        <Building2 className="h-4 w-4 shrink-0" />
                        {currencyCode} bank account details are not set up yet.
                      </p>
                      <button
                        onClick={() => openModal(account)}
                        className="mt-4 w-full rounded-lg bg-primary/10 py-2 text-xs font-semibold text-primary hover:bg-primary/20"
                      >
                        + Set Up {currencyCode} Account
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Important Notes */}
      <div className="mt-6 surface-card p-6">
        <p className="font-semibold">Important Notes</p>
        <div className="mt-3 grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
          {[
            "Please allow 72 hours for the processing of withdrawals and deposits.",
            "A minimum account balance of USD 1.00 / EUR 1.00 / GBP 1.00 is required.",
            "Withdrawals will only be sent to the registered bank account(s).",
            "Partner to partner transfers within WSA Pay are processed immediately.",
            "Deposits made in any other currency will remain in that currency.",
            "Withdrawals above a certain amount may require additional verification.",
          ].map((n) => (
            <p key={n} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {n}
            </p>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-lg font-semibold">
                {editingAccount
                  ? `Edit ${editingAccount.account_name || "Account"}`
                  : "Add New Bank Account"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">
                    Account Name
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
                    value={formData.account_name || ""}
                    onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">
                    Account Type
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
                    value={formData.account_type || ""}
                    onChange={(e) => setFormData({ ...formData, account_type: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">
                    Account Number
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
                    value={formData.account_number || ""}
                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Bank Name</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
                    value={formData.bank_name || ""}
                    onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">
                    Bank Country
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
                    value={formData.bank_country || ""}
                    onChange={(e) => setFormData({ ...formData, bank_country: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">
                    Beneficiary Bank
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
                    value={formData.beneficiary_bank || ""}
                    onChange={(e) => setFormData({ ...formData, beneficiary_bank: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">
                    Beneficiary Bank Address
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
                    value={formData.beneficiary_bank_address || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, beneficiary_bank_address: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">SWIFT / BIC</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
                    value={formData.swift || ""}
                    onChange={(e) => setFormData({ ...formData, swift: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">
                    Routing Number
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
                    value={formData.routing_number || ""}
                    onChange={(e) => setFormData({ ...formData, routing_number: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">
                    Beneficiary Name
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
                    value={formData.beneficiary_name || ""}
                    onChange={(e) => setFormData({ ...formData, beneficiary_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">
                    Beneficiary Address
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
                    value={formData.beneficiary_address || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, beneficiary_address: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">
                    Beneficiary Account Number
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
                    value={formData.beneficiary_account_number || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, beneficiary_account_number: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAccount}
                disabled={isSaving}
                className="gradient-primary rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-70"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
