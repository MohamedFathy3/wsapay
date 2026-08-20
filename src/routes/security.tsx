/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/wsa/AppShell";
import { Shield, Lock, Key, Eye } from "lucide-react";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security — WSA Pay" },
      { name: "description", content: "WSA Pay Security measures." },
    ],
  }),
  component: SecurityPage,
});

const SIDEBAR = {
  title: "SECURITY",
  items: [
    { label: "Security Overview", to: "/security" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms & Conditions", to: "/terms" },
  ],
};

function SecurityPage() {
  return (
    <AppShell sidebar={SIDEBAR}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Security</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              How we protect your account and data.
            </p>
          </div>
        </div>

        <div className="surface-card p-6 space-y-6">
          <div className="flex items-start gap-3">
            <Lock className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-lg">Encryption</h2>
              <p className="text-muted-foreground">
                All data transmitted between your device and our servers is encrypted using TLS 1.3.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Eye className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-lg">Monitoring</h2>
              <p className="text-muted-foreground">
                We continuously monitor our systems for suspicious activity to protect your account.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Key className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-lg">2FA Support</h2>
              <p className="text-muted-foreground">
                Two-factor authentication is available to add an extra layer of security to your
                account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
