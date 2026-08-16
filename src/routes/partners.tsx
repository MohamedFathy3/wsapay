import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Info, Plus, Search } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/wsa/AppShell";
import { partnersDirectory, selectedPayees } from "@/lib/wsa-data";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Trading Partners — WSA Pay" },
      {
        name: "description",
        content:
          "Manage your WSA Pay trading partners and payees. Add partners from the WSA network to send payments.",
      },
      { property: "og:title", content: "Trading Partners — WSA Pay" },
      { property: "og:description", content: "Add or remove trading partners and payees in WSA Pay." },
    ],
  }),
  component: Partners,
});

const SIDEBAR = {
  title: "PARTNERS",
  items: [
    { label: "Trading Partners", hint: "Manage your trading partners", to: "/partners" },
    { label: "My Payees", hint: "View your selected payees", to: "/partners" },
    { label: "Add Trading Partner", hint: "Add a new partner to your payees", to: "/partners" },
    { label: "Partner Details", hint: "View partner information", to: "/partners" },
  ],
};

function Partners() {
  const [search, setSearch] = useState("");
  const list = partnersDirectory.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AppShell sidebar={SIDEBAR}>
      <div className="flex flex-wrap items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">Trading Partners</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your trading partners and payees. Add partners from the WSA network to your payee list
            to make payments.
          </p>
        </div>
        <div className="ml-auto flex gap-3">
          <button className="flex items-center gap-2 rounded-lg bg-secondary bg-card px-4 py-2.5 text-sm font-semibold">
            <Info className="h-4 w-4" /> Partner Guidelines
          </button>
          <button className="gradient-primary flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground">
            <Plus className="h-4 w-4" /> Add Trading Partner
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <p className="flex gap-2 rounded-xl bg-info-soft p-4 text-sm">
          <Info className="h-5 w-5 shrink-0 text-primary" />
          This section allows you to customize the list of WSA Pay participants with whom you do business.
          Once added to your list, the partner selected will remain on your list until you remove them. You
          will only be able to transfer funds to partners that you have placed on your Trading Partner list.
        </p>
        <div className="surface-card p-4 text-sm">
          <p className="font-semibold">Current Account Balance</p>
          <p className="mt-2 flex justify-between">
            <span>USD 1,376.11</span>
            <span className="font-semibold text-primary">Details</span>
          </p>
          <p className="mt-1 flex justify-between">
            <span>EUR 143.63</span>
            <span className="font-semibold text-primary">Details</span>
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="surface-card p-6">
          <h2 className="font-semibold">All Participating Partners List</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            For adding your payee(s) please click on below company name and click "Add Payee".
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-secondary/70 px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Partners by company name, city or country..."
              className="h-10 w-full bg-transparent text-sm outline-none"
            />
          </div>
          <table className="mt-4 w-full text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b border-border/40 text-left">
                <th className="pb-2 font-medium">Company Name</th>
                <th className="pb-2 font-medium">City</th>
                <th className="pb-2 font-medium">Country</th>
                <th className="pb-2 font-medium">WSA ID</th>
                <th className="pb-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-b border-border/40/40 last:border-0">
                  <td className="py-3 pr-3 font-medium">{p.name}</td>
                  <td className="py-3 text-muted-foreground">{p.city}</td>
                  <td className="py-3 text-muted-foreground">{p.country}</td>
                  <td className="py-3 text-muted-foreground">{p.id}</td>
                  <td className="py-3">
                    <button className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                      Add Payee
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs text-muted-foreground">
            Showing 1 to {list.length} of 12,458 partners
          </p>
        </div>

        <div className="surface-card p-6">
          <h2 className="font-semibold">Selected Payees</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            For removing your payee(s) please click on below company name and click "Remove Payee".
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-secondary/70 px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search Payees by company name..."
              className="h-10 w-full bg-transparent text-sm outline-none"
            />
          </div>
          <table className="mt-4 w-full text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b border-border/40 text-left">
                <th className="pb-2 font-medium">Company Name</th>
                <th className="pb-2 font-medium">City</th>
                <th className="pb-2 font-medium">Country</th>
                <th className="pb-2 font-medium">WSA ID</th>
                <th className="pb-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedPayees.map((p) => (
                <tr key={p.id} className="border-b border-border/40/40 last:border-0">
                  <td className="py-3 pr-3 font-medium">{p.name}</td>
                  <td className="py-3 text-muted-foreground">{p.city}</td>
                  <td className="py-3 text-muted-foreground">{p.country}</td>
                  <td className="py-3 text-muted-foreground">{p.id}</td>
                  <td className="py-3">
                    <button className="rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive">
                      Remove Payee
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs text-muted-foreground">Showing 1 to 7 of 45 payees</p>
        </div>
      </div>

      <div className="mt-6 surface-card grid gap-3 p-6 text-sm md:grid-cols-2">
        <p className="md:col-span-2 font-semibold">Important Notes</p>
        {[
          "Partner to partner transfers within WSA Pay are processed immediately.",
          "Withdrawals above a certain amount may require additional verification.",
          "Withdrawals from your WSA Pay account will only be sent to the bank account that is set up in your Partner Profile.",
          "Need help? Please contact our support team.",
        ].map((n) => (
          <p key={n} className="flex gap-2 text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {n}
          </p>
        ))}
      </div>
    </AppShell>
  );
}