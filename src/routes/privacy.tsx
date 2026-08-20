/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/wsa/AppShell";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — WSA Pay" },
      { name: "description", content: "Read how WSA Pay protects your privacy and data." },
    ],
  }),
  component: PrivacyPage,
});

const SIDEBAR = {
  title: "LEGAL",
  items: [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms & Conditions", to: "/terms" },
  ],
};

function PrivacyPage() {
  return (
    <AppShell sidebar={SIDEBAR}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <p className="mt-1 text-sm text-muted-foreground">Last updated: August 2026</p>
          </div>
        </div>

        <div className="surface-card p-6 space-y-6">
          <div>
            <h2 className="font-semibold text-lg mb-2">Information We Collect</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We collect information you provide directly, such as your name, email, company
              details, and bank account information. We also collect data about your transactions
              and usage.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-2">How We Use Your Data</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your data is used to provide, improve, and secure our services. We do not sell your
              personal information to third parties.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-2">Data Security</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We implement industry-standard encryption and security measures to protect your data
              against unauthorized access.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-primary/5 p-4">
            <Lock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              For full details, please review our complete Privacy Policy document.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
