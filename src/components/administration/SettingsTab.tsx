/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { Loader2, Save, Lock, Eye, EyeOff, Globe, Camera, X } from "lucide-react";
import { profileService, UpdateProfileData, UpdatePasswordData } from "@/services/profile.service";
import { countryService, Country } from "@/services/country.service";
import { toast } from "sonner";

interface SettingsTabProps {
  userData: any;
  refreshUser: () => Promise<void>;
}

export function SettingsTab({ userData, refreshUser }: SettingsTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileForm, setProfileForm] = useState<UpdateProfileData>({
    name: userData?.name || "",
    display_name: userData?.displayName || "",
    email_company: userData?.email_company || "",
    phone: userData?.phone || "",
    address_one: userData?.address_one || "",
    address_two: userData?.address_two || "",
    city: userData?.city || "",
    state: userData?.state || "",
    postal_code: userData?.postalCode || "",
    country_id: userData?.country?.id || "",
    first_name_administrator: userData?.first_name_administrator || "",
    middle_name_administrator: userData?.middle_name_administrator || "",
    last_name_administrator: userData?.last_name_administrator || "",
    mobile_administrator: userData?.mobile_administrator || "",
    email: userData?.email || "",
    logo: userData?.logo || null,
  });

  const [passwordForm, setPasswordForm] = useState<UpdatePasswordData>({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(userData?.logo || null);

  // ✅ تحديث logoPreview لما userData يتغير
  useEffect(() => {
    if (userData?.logo) {
      setLogoPreview(userData.logo);
    } else {
      setLogoPreview(null);
    }
  }, [userData]);

  // ✅ تحديث profileForm لما userData يتغير
  useEffect(() => {
    setProfileForm({
      name: userData?.name || "",
      display_name: userData?.displayName || "",
      email_company: userData?.email_company || "",
      phone: userData?.phone || "",
      address_one: userData?.address_one || "",
      address_two: userData?.address_two || "",
      city: userData?.city || "",
      state: userData?.state || "",
      postal_code: userData?.postalCode || "",
      country_id: userData?.country?.id || "",
      first_name_administrator: userData?.first_name_administrator || "",
      middle_name_administrator: userData?.middle_name_administrator || "",
      last_name_administrator: userData?.last_name_administrator || "",
      mobile_administrator: userData?.mobile_administrator || "",
      email: userData?.email || "",
      logo: userData?.logo || null,
    });
  }, [userData]);

  // ✅ جلب الدول عند تحميل الصفحة
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoadingCountries(true);
        const data = await countryService.getAllCountries();
        setCountries(data);
      } catch (error) {
        console.error("Error loading countries:", error);
        toast.error("Failed to load countries.");
      } finally {
        setIsLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedLogo(file);
      setProfileForm((prev) => ({ ...prev, logo: file }));
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
    setProfileForm((prev) => ({ ...prev, logo: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await profileService.updateProfile(profileForm);
      toast.success("Profile updated successfully! 🎉");
      await refreshUser();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.password !== passwordForm.password_confirmation) {
      toast.error("Passwords do not match.");
      return;
    }
    setIsSavingPassword(true);
    try {
      await profileService.updatePassword(passwordForm);
      toast.success("Password changed successfully! 🔒");
      setPasswordForm({ current_password: "", password: "", password_confirmation: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      {/* Profile Update */}
      <div className="surface-card p-6">
        <h2 className="font-semibold mb-4">Update Profile Information</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Name</label>
              <input
                name="name"
                value={profileForm.name || ""}
                onChange={handleProfileChange}
                className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Display Name</label>
              <input
                name="display_name"
                value={profileForm.display_name || ""}
                onChange={handleProfileChange}
                className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Company Email</label>
              <input
                name="email_company"
                value={profileForm.email_company || ""}
                onChange={handleProfileChange}
                className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Phone</label>
              <input
                name="phone"
                value={profileForm.phone || ""}
                onChange={handleProfileChange}
                className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Address One</label>
              <input
                name="address_one"
                value={profileForm.address_one || ""}
                onChange={handleProfileChange}
                className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Address Two</label>
              <input
                name="address_two"
                value={profileForm.address_two || ""}
                onChange={handleProfileChange}
                className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">City</label>
              <input
                name="city"
                value={profileForm.city || ""}
                onChange={handleProfileChange}
                className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">State</label>
              <input
                name="state"
                value={profileForm.state || ""}
                onChange={handleProfileChange}
                className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Postal Code</label>
              <input
                name="postal_code"
                value={profileForm.postal_code || ""}
                onChange={handleProfileChange}
                className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Fax</label>
              <input
                name="fax"
                value={profileForm.fax || ""}
                onChange={handleProfileChange}
                className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
              />
            </div>
          </div>

          {/* Country */}
          <div className="grid grid-cols-1 gap-4 border-t pt-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Country</label>
              <div className="relative mt-1">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  name="country_id"
                  value={profileForm.country_id || ""}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm appearance-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoadingCountries}
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {isLoadingCountries && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>

              {profileForm.country_id && (
                <div className="mt-1 flex items-center gap-2">
                  <img
                    src={
                      countries.find((c) => String(c.id) === String(profileForm.country_id))?.flag
                    }
                    alt="Flag"
                    className="h-5 w-8 object-cover rounded-sm border border-border"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <span className="text-xs text-muted-foreground">
                    {countries.find((c) => String(c.id) === String(profileForm.country_id))?.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Administrator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">First Name</label>
              <input
                name="first_name_administrator"
                value={profileForm.first_name_administrator || ""}
                onChange={handleProfileChange}
                className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Middle Name</label>
              <input
                name="middle_name_administrator"
                value={profileForm.middle_name_administrator || ""}
                onChange={handleProfileChange}
                className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Last Name</label>
              <input
                name="last_name_administrator"
                value={profileForm.last_name_administrator || ""}
                onChange={handleProfileChange}
                className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Mobile</label>
              <input
                name="mobile_administrator"
                value={profileForm.mobile_administrator || ""}
                onChange={handleProfileChange}
                className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Email</label>
              <input
                name="email"
                value={profileForm.email || ""}
                onChange={handleProfileChange}
                className="mt-1 w-full rounded-lg border border-border p-2 text-sm"
              />
            </div>
          </div>

          {/* Upload Logo Section */}
          <div className="border-t pt-4">
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">
              Company Logo
            </label>
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <div className="relative h-20 w-20 rounded-lg border border-border overflow-hidden group">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      setLogoPreview(null);
                    }}
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

          <button
            type="submit"
            disabled={isSavingProfile}
            className="gradient-primary flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-primary-foreground disabled:opacity-70"
          >
            {isSavingProfile ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSavingProfile ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="surface-card p-6">
        <h2 className="font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Current Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                name="current_password"
                type="password"
                value={passwordForm.current_password}
                onChange={handlePasswordChange}
                className="w-full rounded-lg border border-border pl-9 pr-3 p-2 text-sm"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">New Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={passwordForm.password}
                onChange={handlePasswordChange}
                className="w-full rounded-lg border border-border pl-9 pr-9 p-2 text-sm"
                required
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
            <label className="text-xs font-semibold text-muted-foreground">
              Confirm New Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                name="password_confirmation"
                type={showConfirmPassword ? "text" : "password"}
                value={passwordForm.password_confirmation}
                onChange={handlePasswordChange}
                className="w-full rounded-lg border border-border pl-9 pr-9 p-2 text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSavingPassword}
            className="gradient-primary flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-primary-foreground disabled:opacity-70"
          >
            {isSavingPassword ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            {isSavingPassword ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
