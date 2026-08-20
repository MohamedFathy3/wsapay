/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Scale, FileCheck, Globe, Award, ShieldCheck } from "lucide-react";
import heroBg from "@/assets/login-hero.jpg";
import { Logo } from "@/components/wsa/Logo";
import { WorldMapLines } from "@/components/wsa/WorldMapLines";

export const Route = createFileRoute("/public/compliance")({
  head: () => ({
    meta: [
      { title: "Compliance — WSA Pay" },
      { name: "description", content: "WSA Pay's commitment to regulatory compliance." },
    ],
  }),
  component: CompliancePage,
});

function CompliancePage() {
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
              Compliance &amp; Standards.
            </h1>
            <p className="mt-5 max-w-md text-white/70">
              We adhere to the highest regulatory and compliance standards in the industry.
            </p>
          </div>
        </section>

        <section className="flex flex-col bg-background px-6 py-8 lg:px-14">
          <div className="mx-auto mt-6 w-full max-w-md surface-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <Scale className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-2xl font-bold">Compliance</h2>
                <p className="text-sm text-muted-foreground">Our commitment to regulations.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-3 p-4 rounded-lg bg-secondary/50">
                <FileCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">KYC / AML</h3>
                  <p className="text-xs text-muted-foreground">
                    We comply with Know Your Customer (KYC) and Anti-Money Laundering (AML)
                    regulations.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-lg bg-secondary/50">
                <Globe className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Global Standards</h3>
                  <p className="text-xs text-muted-foreground">
                    WSA Pay adheres to international data protection and financial standards.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-lg bg-secondary/50">
                <Award className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Certified Security</h3>
                  <p className="text-xs text-muted-foreground">
                    Our systems are regularly audited and certified for security and compliance.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 rounded-lg bg-secondary/50">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">Data Privacy</h3>
                  <p className="text-xs text-muted-foreground">
                    We strictly follow GDPR and other data privacy laws.
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
