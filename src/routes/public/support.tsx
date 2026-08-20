/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Mail,
  Phone,
  Clock,
  MessageCircle,
  ArrowRight,
  Headphones,
  Send,
  Loader2,
} from "lucide-react";
import heroBg from "@/assets/login-hero.jpg";
import { Logo } from "@/components/wsa/Logo";
import { WorldMapLines } from "@/components/wsa/WorldMapLines";
import { toast } from "sonner"; // ✅ استيراد toast

export const Route = createFileRoute("/public/support")({
  head: () => ({
    meta: [
      { title: "Support Center — WSA Pay" },
      { name: "description", content: "Get help and support from the WSA Pay team." },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // ✅ هنا هنحط كود إرسال الـ API لما يكون جاهز
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
      toast.success("Message sent successfully! 🎉"); // ✅ استخدام toast
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="grid flex-1 lg:grid-cols-2">
        {/* ✅ القسم الأيسر - التصميم الجمالي */}
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
              We are here to help.
            </h1>
            <p className="mt-5 max-w-md text-white/70">
              Whether it's a question, a technical issue, or something else, we are ready to assist.
            </p>

            {/* ✅ عرض طرق التواصل بجانب بعض */}
            <div className="mt-8 space-y-4 text-white/80">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand-magenta" />
                <span>support@wsapay.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-brand-magenta" />
                <span>+1 (800) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-brand-magenta" />
                <span>24/7 Support Available</span>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ القسم الأيمن - نموذج التواصل */}
        <section className="flex flex-col bg-background px-6 py-8 lg:px-14">
          <div className="mx-auto mt-6 w-full max-w-md surface-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <Headphones className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-2xl font-bold">Contact Support</h2>
                <p className="text-sm text-muted-foreground">
                  We'll get back to you as soon as possible.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium block mb-2">
                  Your Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-medium block mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label htmlFor="subject" className="text-sm font-medium block mb-2">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label htmlFor="message" className="text-sm font-medium block mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your issue..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="gradient-primary flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-primary-foreground disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
