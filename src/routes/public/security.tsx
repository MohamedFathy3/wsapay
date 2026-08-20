/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Lock, Key, Eye, Server } from "lucide-react";
import heroBg from "@/assets/login-hero.jpg";
import { Logo } from "@/components/wsa/Logo";
import { WorldMapLines } from "@/components/wsa/WorldMapLines";

export const Route = createFileRoute("/public/security")({
  head: () => ({
    meta: [
      { title: "Security — WSA Pay" },
      { name: "description", content: "How WSA Pay protects your data and transactions." },
    ],
  }),
  component: SecurityPage,
});

function SecurityPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="grid flex-1 lg:grid-cols-2">
        <section
          className="brand-panel relative overflow-hidden px-8 py-12 lg:px-14 lg:py-16"
          style={{
            backgroundImage: `linear-gradient(120deg, oklch(0.34 0.13 302 / 0.9), oklch(0.44 0.17 312 / 0.82)), url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <WorldMapLines className="pointer-events-none absolute inset-x-0 top-[18%] h-3/5 w-full opacity-90" />
          <div className="relative">
            <Logo light />
            <h1 className="mt-12 max-w-md text-4xl font-extrabold leading-tight text-white lg:text-5xl">
              Security First.
            </h1>
            <p className="mt-5 max-w-md text-white/70">
              We prioritize the security of your data and transactions above all else.
            </p>
          </div>
        </section>

        <section className="flex flex-col bg-background px-6 py-8 lg:px-14">
          <div className="mx-auto mt-6 w-full max-w-md surface-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-2xl font-bold">Security Measures</h2>
                <p className="text-sm text-muted-foreground">How we keep your account safe.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-3 p-4 rounded-lg bg-secondary/50">
                <Lock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">End-to-End Encryption</h3>
                  <p className="text-xs text-muted-foreground">
                    All data transmitted between your device and our servers is encrypted using TLS
                    1.3.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-lg bg-secondary/50">
                <Key className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Two-Factor Authentication (2FA)</h3>
                  <p className="text-xs text-muted-foreground">
                    Add an extra layer of security to your account with 2FA.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-lg bg-secondary/50">
                <Eye className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">24/7 Monitoring</h3>
                  <p className="text-xs text-muted-foreground">
                    We continuously monitor our systems for suspicious activity.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-lg bg-secondary/50">
                <Server className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Secure Infrastructure</h3>
                  <p className="text-xs text-muted-foreground">
                    Our servers are hosted in secure, ISO 27001 certified data centers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
