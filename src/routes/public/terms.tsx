/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, CheckCircle, Shield } from "lucide-react";
import heroBg from "@/assets/login-hero.jpg";
import { Logo } from "@/components/wsa/Logo";
import { WorldMapLines } from "@/components/wsa/WorldMapLines";

export const Route = createFileRoute("/public/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — WSA Pay" },
      { name: "description", content: "WSA Pay Terms & Conditions." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="grid flex-1 lg:grid-cols-2">
        {/* ✅ القسم الأيسر - نفس تصميم الـ Login */}
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
              Terms &amp; Conditions.
            </h1>
            <p className="mt-5 max-w-md text-white/70">
              Please read these terms carefully before using WSA Pay.
            </p>
          </div>
        </section>

        {/* ✅ القسم الأيمن - المحتوى */}
        <section className="flex flex-col bg-background px-6 py-8 lg:px-14">
          <div className="mx-auto mt-6 w-full max-w-md surface-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-2xl font-bold">Terms & Conditions</h2>
                <p className="text-sm text-muted-foreground">Last updated: August 2026</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-sm">1. Acceptance of Terms</h3>
                <p className="text-sm text-muted-foreground">
                  By accessing and using WSA Pay, you agree to be bound by these Terms and
                  Conditions. If you do not agree, please do not use our services.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">2. Account Responsibilities</h3>
                <p className="text-sm text-muted-foreground">
                  You are responsible for maintaining the confidentiality of your account
                  credentials and for all activities that occur under your account.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">3. Transactions</h3>
                <p className="text-sm text-muted-foreground">
                  All transactions are processed in accordance with our internal policies and
                  applicable laws.
                </p>
              </div>
              <div className="rounded-xl bg-primary/5 p-4 flex items-start gap-3 mt-2">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  For full details, please review our complete Terms & Conditions document.
                </p>
              </div>
            </div>
          </div>

          {/* ✅ زر الرجوع لصفحة الـ Login */}
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm font-semibold text-primary hover:underline">
              &larr; Back to Login
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
