/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Lock } from "lucide-react";
import heroBg from "@/assets/login-hero.jpg";
import { Logo } from "@/components/wsa/Logo";
import { WorldMapLines } from "@/components/wsa/WorldMapLines";

export const Route = createFileRoute("/public/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — WSA Pay" },
      { name: "description", content: "WSA Pay Privacy Policy." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
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
              Privacy Policy.
            </h1>
            <p className="mt-5 max-w-md text-white/70">
              Your privacy is important to us. Learn how we handle your data.
            </p>
          </div>
        </section>

        {/* ✅ القسم الأيمن - المحتوى */}
        <section className="flex flex-col bg-background px-6 py-8 lg:px-14">
          <div className="mx-auto mt-6 w-full max-w-md surface-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-2xl font-bold">Privacy Policy</h2>
                <p className="text-sm text-muted-foreground">Last updated: August 2026</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-sm">1. Information We Collect</h3>
                <p className="text-sm text-muted-foreground">
                  We collect information you provide directly, such as your name, email, and company
                  details.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">2. How We Use Your Data</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is used solely to provide and improve our services.
                </p>
              </div>
              <div className="rounded-xl bg-primary/5 p-4 flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  For full details, please review the complete document.
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
