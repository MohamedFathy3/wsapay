/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/wsa/AppShell";
import { Info, Shield, Users, Zap } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — WSA Pay" },
      { name: "description", content: "Learn more about WSA Pay, our mission and values." },
    ],
  }),
  component: AboutPage,
});

const SIDEBAR = {
  title: "ABOUT",
  items: [
    { label: "Our Story", to: "/about" },
    { label: "Our Mission", to: "/about" },
    { label: "Leadership", to: "/about" },
  ],
};

function AboutPage() {
  return (
    <AppShell sidebar={SIDEBAR}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Info className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">About WSA Pay</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Learn more about our platform, mission, and the team behind it.
            </p>
          </div>
        </div>

        <div className="surface-card p-6 mb-6">
          <h2 className="font-semibold text-xl mb-4">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            WSA Pay was built to simplify business-to-business payments across the WSA network. We
            provide a secure, fast, and transparent platform for companies to settle invoices,
            transfer funds, and manage their multi-currency accounts.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Our mission is to bridge the gap between traditional banking and the digital future,
            empowering businesses to operate seamlessly across borders.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="surface-card p-6 text-center">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="font-semibold">Secure</h3>
            <p className="text-sm text-muted-foreground">
              Bank-grade security for all your transactions.
            </p>
          </div>
          <div className="surface-card p-6 text-center">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-semibold">Fast</h3>
            <p className="text-sm text-muted-foreground">
              Instant transfers within the WSA Pay network.
            </p>
          </div>
          <div className="surface-card p-6 text-center">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-semibold">Connected</h3>
            <p className="text-sm text-muted-foreground">
              Built for companies across the WSA ecosystem.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
