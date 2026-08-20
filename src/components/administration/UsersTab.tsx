/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search } from "lucide-react";

interface UsersTabProps {
  subAccounts: any[];
}

export function UsersTab({ subAccounts }: UsersTabProps) {
  return (
    <div className="mt-6 surface-card p-6">
      <h2 className="font-semibold">Users in Your Company</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage users, roles and permissions for your WSA Pay account.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <div className="flex min-w-64 flex-1 items-center gap-2 rounded-lg bg-secondary/70 px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search users by name or email"
            className="h-10 w-full bg-transparent text-sm outline-none"
          />
        </div>
        <select className="h-10 rounded-lg bg-secondary/70 bg-card px-3 text-sm">
          <option>All Roles</option>
        </select>
      </div>
      <table className="mt-5 w-full text-sm">
        <thead className="text-xs text-muted-foreground">
          <tr className="border-b border-border/40 text-left">
            <th className="pb-2 font-medium">Name</th>
            <th className="pb-2 font-medium">Email</th>
            <th className="pb-2 font-medium">Role</th>
            <th className="pb-2 font-medium">Status</th>
            <th className="pb-2 font-medium">Last Login</th>
          </tr>
        </thead>
        <tbody>
          {subAccounts.length > 0 ? (
            subAccounts.map((u: any) => (
              <tr key={u.id} className="border-b border-border/40 last:border-0">
                <td className="py-3">
                  <span className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
                      {(u.displayName?.[0] || u.name?.[0] || "U").toUpperCase()}
                    </span>
                    <span className="font-medium">{u.displayName || u.name}</span>
                  </span>
                </td>
                <td className="py-3 text-muted-foreground">{u.email}</td>
                <td className="py-3">Member</td>
                <td className="py-3">
                  <span className="rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
                    Active
                  </span>
                </td>
                <td className="py-3 text-muted-foreground">N/A</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-6 text-center text-muted-foreground">
                No sub-accounts found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
