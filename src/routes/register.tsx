/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Mail,
  User,
  Loader2,
  Camera,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import heroBg from "@/assets/login-hero.jpg";
import { Logo } from "@/components/wsa/Logo";
import { WorldMapLines } from "@/components/wsa/WorldMapLines";
import api from "@/lib/api";
import { toast } from "sonner";
import { tokenService } from "@/services/token.service";
import { countryService, Country } from "@/services/country.service";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — WSA Pay" },
      { name: "description", content: "Apply for a new WSA Pay account." },
    ],
  }),
  // ✅ لو المستخدم مسجل دخول، نحوله للداشبورد
  beforeLoad: async () => {
    const token = tokenService.getToken();
    if (token) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: RegisterPage,
});

const FORM_FIELDS = [
  { key: "name", label: "Company Name", type: "text", required: true },
  { key: "display_name", label: "Display Name", type: "text", required: false },
  { key: "email_company", label: "Company Email", type: "email", required: true },
  { key: "phone", label: "Phone Number", type: "text", required: false },
  { key: "address_one", label: "Address Line 1", type: "text", required: false },
  { key: "address_two", label: "Address Line 2", type: "text", required: false },
  { key: "city", label: "City", type: "text", required: false },
  { key: "state", label: "State / Province", type: "text", required: false },
  { key: "postal_code", label: "Postal Code", type: "text", required: false },
  { key: "fax", label: "Fax Number", type: "text", required: false },
  { key: "currency", label: "Currency", type: "text", required: false },
];

const ADMIN_FIELDS = [
  { key: "first_name_administrator", label: "First Name", type: "text", required: false },
  { key: "middle_name_administrator", label: "Middle Name", type: "text", required: false },
  { key: "last_name_administrator", label: "Last Name", type: "text", required: false },
  { key: "mobile_administrator", label: "Mobile Number", type: "text", required: false },
  { key: "phone_administrator", label: "Phone Number", type: "text", required: false },
  { key: "email", label: "Email Address", type: "email", required: true },
];

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>({});
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ جلب الدول للـ Select
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await countryService.getAllCountries();
        setCountries(data);
      } catch (error) {
        console.error("Error loading countries:", error);
        toast.error("Failed to load countries.");
      }
    };
    fetchCountries();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setSelectedLogo(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validation أساسية
    if (!formData.name || !formData.email_company || !formData.email) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      // ✅ تحويل البيانات إلى FormData (لحماية الـ SQL Injection ورفع الصور)
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          submitData.append(key, String(value));
        }
      });
      submitData.append("password", password);
      if (selectedLogo) {
        submitData.append("logo", selectedLogo);
      }

      // ✅ إرسال الطلب للـ API
      const response = await api.post("/application-form", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Application submitted successfully! 🎉");
      // تحويل المستخدم لصفحة الدخول بعد التسجيل
      setTimeout(() => navigate({ to: "/" }), 2000);
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="grid flex-1 lg:grid-cols-2">
        {/* ✅ القسم الأيسر - نفس تصميم Login */}
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
              Join WSA Pay
              <br />
              <span className="text-brand-magenta">Start your journey.</span>
            </h1>
            <p className="mt-5 max-w-md text-white/70">
              Apply for a WSA Pay account and start managing your business payments.
            </p>
          </div>
        </section>

        {/* ✅ القسم الأيمن - نموذج التسجيل */}
        <section className="flex flex-col bg-background px-6 py-8 lg:px-14 overflow-y-auto">
          <div className="mx-auto w-full max-w-2xl surface-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Apply Now</h2>
              <Link to="/" className="text-sm font-semibold text-primary hover:underline">
                Already have an account? Sign In
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Fill in the details below to apply for a WSA Pay account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* ✅ Company Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm border-b pb-2">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FORM_FIELDS.map((field) => (
                    <div key={field.key}>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1">
                        {field.label}{" "}
                        {field.required && <span className="text-destructive">*</span>}
                      </label>
                      <input
                        type={field.type}
                        name={field.key}
                        value={formData[field.key] || ""}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20"
                        required={field.required}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* ✅ Country & Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Country
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <select
                      name="country_id"
                      value={formData.country_id || ""}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm appearance-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select a country</option>
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Currency
                  </label>
                  <input
                    type="text"
                    name="currency"
                    value={formData.currency || ""}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* ✅ Administrator Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm border-b pb-2">Administrator Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ADMIN_FIELDS.map((field) => (
                    <div key={field.key}>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1">
                        {field.label}{" "}
                        {field.required && <span className="text-destructive">*</span>}
                      </label>
                      <input
                        type={field.type}
                        name={field.key}
                        value={formData[field.key] || ""}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20"
                        required={field.required}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* ✅ Password & Confirmation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Password <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background pl-9 pr-9 py-2 text-sm focus:ring-2 focus:ring-primary/20"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Confirm Password <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background pl-9 pr-9 py-2 text-sm focus:ring-2 focus:ring-primary/20"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              {/* ✅ Logo Upload */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  Company Logo
                </label>
                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <div className="relative h-20 w-20 rounded-lg border border-border overflow-hidden group">
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="h-full w-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/30">
                      <Camera className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20"
                    >
                      {logoPreview ? "Change Logo" : "Upload Logo"}
                    </button>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Max size: 2MB. PNG, JPG, SVG allowed.
                    </p>
                  </div>
                </div>
              </div>

              {/* ✅ Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="gradient-primary flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-primary-foreground disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" /> Submit Application
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
