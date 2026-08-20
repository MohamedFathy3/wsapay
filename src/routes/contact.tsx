/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/wsa/AppShell";
import { contactService, ContactFormData } from "@/services/contact.service";
import { Mail, User, MessageSquare, Send, Loader2, CheckCircle2, Phone, Clock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Support — WSA Pay" },
      { name: "description", content: "Get in touch with the WSA Pay support team." },
    ],
  }),
  component: ContactPage,
});

// ✅ Sidebar دائم للصفحة
const SIDEBAR = {
  title: "SUPPORT",
  items: [
    { label: "Contact Us", to: "/contact" },
    { label: "Help Center", to: "/contact" },
    { label: "FAQ", to: "/contact" },
  ],
};

function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ الحل السحري: استخدام ContactFormData مباشرة في الـ state
  // ده معناه أي حقل بتضيفه في الـ interface هيتضاف هنا أوتوماتيك!
  const [formData, setFormData] = useState<ContactFormData>({} as ContactFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validation بسيط (تأكد إن الحقول الموجودة مش فاضية)
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      await contactService.sendMessage(formData);
      toast.success("Your message has been sent successfully! 🎉");
      // ✅ تصفير الفورم باستخدام {} as ContactFormData
      setFormData({} as ContactFormData);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell sidebar={SIDEBAR}>
      <div className="max-w-4xl mx-auto">
        {/* ✅ Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Contact Support</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Have a question or need help? Send us a message and we'll get back to you.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
          {/* ✅ Contact Form */}
          <div className="surface-card p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="text-sm font-medium block mb-2">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name || ""}
                      onChange={handleChange}
                      placeholder="e.g. Ahmed s"
                      className="h-11 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium block mb-2">
                    Email Address <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email || ""}
                      onChange={handleChange}
                      placeholder="e.g. ahmedasassd24@gmail.com"
                      className="h-11 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="text-sm font-medium block mb-2">
                  Subject <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject || ""}
                    onChange={handleChange}
                    placeholder="e.g. Account Inquiry"
                    className="h-11 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="text-sm font-medium block mb-2">
                  Message <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message || ""}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-y"
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

          {/* ✅ Right Column: Contact Info */}
          <div className="flex flex-col gap-6">
            <div className="surface-card p-6">
              <h2 className="font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 soft-tile p-4">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">Email</p>
                    <p className="text-xs text-muted-foreground">support@wsapay.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 soft-tile p-4">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">Phone</p>
                    <p className="text-xs text-muted-foreground">+1 (800) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 soft-tile p-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">Working Hours</p>
                    <p className="text-xs text-muted-foreground">24/7 Support Available</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="surface-card p-6 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-success" />
                <div>
                  <p className="font-semibold">Quick Response</p>
                  <p className="text-sm text-muted-foreground">
                    We aim to respond to all inquiries within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
