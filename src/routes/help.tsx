/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/wsa/AppShell";
import { HelpCircle, FileText, Mail, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Center — WSA Pay" },
      { name: "description", content: "Find answers to frequently asked questions and support." },
    ],
  }),
  component: HelpPage,
});

const SIDEBAR = {
  title: "HELP CENTER",
  items: [
    { label: "FAQ", to: "/help" },
    { label: "Getting Started", to: "/help" },
    { label: "Payments Guide", to: "/help" },
  ],
};

function HelpPage() {
  return (
    <AppShell sidebar={SIDEBAR}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Help Center</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Find answers to common questions and get the support you need.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="surface-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Getting Started</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                How to create your WSA Pay account
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                Setting up your company profile
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                Adding your first bank account
              </li>
            </ul>
          </div>

          <div className="surface-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Payments & Transfers</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                How to send a payment
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                Understanding transfer statuses
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                Withdrawing funds to your bank
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 surface-card p-6 text-center">
          <p className="text-muted-foreground mb-4">Can't find what you're looking for?</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/20"
          >
            <Mail className="h-4 w-4" />
            Contact Support
          </a>
        </div>
      </div>
    </AppShell>
  );
}
