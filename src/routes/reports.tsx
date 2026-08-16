import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Download, FileText, PieChart } from "lucide-react";
import { AppShell } from "@/components/wsa/AppShell";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — WSA Pay" },
      {
        name: "description",
        content: "Download WSA Pay account statements, partner payment summaries and currency activity reports.",
      },
      { property: "og:title", content: "Reports — WSA Pay" },
      { property: "og:description", content: "Statements and payment reports for your WSA Pay account." },
    ],
  }),
  component: Reports,
});

const REPORTS = [
  { icon: FileText, title: "Account Statement", body: "Full statement of deposits, payments and withdrawals per currency." },
  { icon: BarChart3, title: "Partner Payment Summary", body: "Totals sent and received per trading partner." },
  { icon: PieChart, title: "Currency Activity", body: "Breakdown of USD, EUR and GBP account movements." },
];

function Reports() {
  return (
    <AppShell>
      <h1 className="text-3xl font-bold">Reports</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Generate and download reports for your WSA Pay account activity.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {REPORTS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="surface-card p-6 hover-lift">
            <span className="icon-tile h-12 w-12">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-semibold">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 py-2.5 text-sm font-semibold text-primary">
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}