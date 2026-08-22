/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/wsa/AppShell";
import { useApp } from "@/contexts/AppContext";

import { ProfileTab } from "@/components/administration/ProfileTab";
import { UsersTab } from "@/components/administration/UsersTab";
import { BankAccountsTab } from "@/components/administration/BankAccountsTab";
import { SettingsTab } from "@/components/administration/SettingsTab";

export const Route = createFileRoute("/administration")({
  head: () => ({
    meta: [
      { title: "Partner Profile & Administration — WSA Pay" },
      {
        name: "description",
        content:
          "Manage your WSA Pay company profile, users and permissions, USD/EUR/GBP bank accounts and account security.",
      },
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

const TABS = [
  "Company Profile",
  "Users & Permissions",
  "Bank Accounts",
  "Security",
  "Settings",
] as const;

function Administration() {
  const { user, refreshUser } = useApp();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Company Profile");

  const [bankAccounts, setBankAccounts] = useState<any[]>(user?.bankAccounts || []);
  const [subAccounts, setSubAccounts] = useState<any[]>(user?.subAccounts || []);
  // ✅ خلي userData في state عشان يتحدث
  const [userData, setUserData] = useState<any>(user);

  // ✅ تحديث الـ state لما user يتغير
  useEffect(() => {
    setUserData(user);
    setBankAccounts(user?.bankAccounts || []);
    setSubAccounts(user?.subAccounts || []);
  }, [user]);

  const refreshBankAccounts = async () => {
    try {
      const refreshedUser = await refreshUser();

      // ✅ حدث userData
      if (refreshedUser) {
        setUserData(refreshedUser);
      }

      if (refreshedUser?.bankAccounts && Array.isArray(refreshedUser.bankAccounts)) {
        setBankAccounts(refreshedUser.bankAccounts);
      }

      return refreshedUser;
    } catch (error) {
      console.error("Error refreshing bank accounts:", error);
      return null;
    }
  };

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

      {tab === "Company Profile" && <ProfileTab userData={userData} />}
      {tab === "Users & Permissions" && <UsersTab subAccounts={subAccounts} />}
      {tab === "Bank Accounts" && (
        <BankAccountsTab bankAccounts={bankAccounts} refreshUser={refreshBankAccounts} />
      )}
      {tab === "Settings" && <SettingsTab userData={userData} refreshUser={refreshUser} />}

      {tab === "Security" && (
        <div className="mt-6 surface-card p-6">
          <p className="text-sm text-muted-foreground">Security settings coming soon...</p>
        </div>
      )}
    </AppShell>
  );
}
