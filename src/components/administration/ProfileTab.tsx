/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "@/types/auth.types";

interface ProfileTabProps {
  userData: User | null;
}

export function ProfileTab({ userData }: ProfileTabProps) {
  const currenciesCount = userData?.balances?.length || 0;
  const usersCount = userData?.subAccounts?.length || 0;
  const pendingActionsCount = userData?.pendingTransfer ? 1 : 0;

  return (
    <>
      <div className="mt-6 surface-card p-6">
        <h2 className="font-semibold">User Information</h2>
        <div className="mt-4 grid gap-x-8 gap-y-4 text-sm md:grid-cols-3">
          {[
            ["Name", userData?.displayName || userData?.name || "Your Name"],
            ["Display Name", userData?.displayName || "N/A"],
            [
              "Address",
              [userData?.address_one, userData?.address_two].filter(Boolean).join(", ") || "N/A",
            ],
            ["City", userData?.city || "N/A"],
            ["State / Province", userData?.state || "N/A"],
            ["Postal Code", userData?.postalCode || "N/A"],
            ["Country", userData?.country?.name || "N/A"],
            ["Phone", userData?.phone || "N/A"],
            ["Email", userData?.email_company || userData?.email || ""],
            [
              "WSA Member ID",
              userData?.id ? `WSA${String(userData.id).padStart(6, "0")}` : "WSA000000",
            ],
            ["Company Status", userData?.status || "Active"],
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
            ["Currencies", currenciesCount, "Active Accounts"],
            ["Users", usersCount, "Total Users"],
            ["Pending Actions", pendingActionsCount, "Items to Complete"],
            [
              "Account Since",
              userData?.createdAt
                ? new Date(userData.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "N/A",
              "",
            ],
          ].map(([label, value, hint]) => (
            <div key={label} className="soft-tile p-4">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-1 text-xl font-bold text-primary">{value}</p>
              {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
