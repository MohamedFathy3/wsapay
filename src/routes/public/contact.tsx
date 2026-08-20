/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, Clock, Send } from "lucide-react";

export const Route = createFileRoute("/public/contact")({
  head: () => ({
    meta: [
      { title: "Contact — WSA Pay" },
      { name: "description", content: "Get in touch with WSA Pay." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Mail className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="text-muted-foreground">We'd love to hear from you.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="surface-card p-8">
          <h2 className="font-semibold mb-4">Send a Message</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full rounded-lg border border-border p-2 text-sm"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full rounded-lg border border-border p-2 text-sm"
            />
            <textarea
              placeholder="Your Message"
              rows={4}
              className="w-full rounded-lg border border-border p-2 text-sm"
            />
            <button className="gradient-primary flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-primary-foreground">
              <Send className="h-4 w-4" /> Send Message
            </button>
          </form>
        </div>
        <div className="surface-card p-8 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-sm text-muted-foreground">support@wsapay.com</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Phone</p>
              <p className="text-sm text-muted-foreground">+1 (800) 123-4567</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Working Hours</p>
              <p className="text-sm text-muted-foreground">24/7 Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
