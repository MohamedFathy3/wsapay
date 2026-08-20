/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/wsa/AppShell";
import { FileText, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — WSA Pay" },
      { name: "description", content: "Read the terms and conditions for using WSA Pay." },
    ],
  }),
  component: TermsPage,
});

const SIDEBAR = {
  title: "LEGAL",
  items: [
    { label: "Terms & Conditions", to: "/terms" },
    { label: "Privacy Policy", to: "/privacy" },
  ],
};

function TermsPage() {
  return (
    <AppShell sidebar={SIDEBAR}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Terms & Conditions</h1>
            <p className="mt-1 text-sm text-muted-foreground">Last updated: August 2026</p>
          </div>
        </div>

        <div className="surface-card p-6 space-y-6">
          <div>
            <h2 className="font-semibold text-lg mb-2">1. Acceptance of Terms</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By accessing and using WSA Pay, you agree to be bound by these Terms and Conditions.
              If you do not agree, please do not use our services.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-2">2. Account Responsibilities</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials
              and for all activities that occur under your account. WSA Pay is not liable for any
              unauthorized access resulting from negligence.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-2">3. Transactions</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All transactions are processed in accordance with our internal policies and applicable
              laws. WSA Pay reserves the right to hold or cancel any transaction deemed suspicious.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-primary/5 p-4">
            <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              For full details, please review our complete Terms & Conditions document.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
