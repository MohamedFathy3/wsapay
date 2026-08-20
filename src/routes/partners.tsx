/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  CheckCircle2,
  Info,
  Search,
  Star,
  Loader2,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Search as SearchIcon,
  Globe,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { AppShell } from "@/components/wsa/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { partnerService, Partner } from "@/services/partner.service";
import { countryService, Country } from "@/services/country.service";
import { toast } from "sonner";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Trading Partners — WSA Pay" },
      {
        name: "description",
        content:
          "Manage your WSA Pay trading partners and payees. Add partners from the WSA network to send payments.",
      },
      { property: "og:title", content: "Trading Partners — WSA Pay" },
      {
        property: "og:description",
        content: "Add or remove trading partners and payees in WSA Pay.",
      },
    ],
  }),
  beforeLoad: async () => {
    const { tokenService } = await import("@/services/token.service");
    const token = tokenService.getToken();
    // لو مفيش توكن، طير المستخدم للصفحة الرئيسية
    if (!token) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: Partners,
});

const SIDEBAR = {
  title: "PARTNERS",
  items: [
    { label: "Trading Partners", hint: "Manage your trading partners", to: "/partners" },
    { label: "My Payees", hint: "View your selected payees", to: "/partners" },
    { label: "Add Trading Partner", hint: "Add a new partner to your payees", to: "/partners" },
    { label: "Partner Details", hint: "View partner information", to: "/partners" },
  ],
};

const SEARCH_FIELDS = [
  { value: "search", label: "All Fields" },
  { value: "name", label: "Name" },
  { value: "displayName", label: "Display Name" },
  { value: "email", label: "Email" },
  { value: "email_company", label: "Company Email" },
  { value: "phone", label: "Phone" },
  { value: "city", label: "City" },
  { value: "state", label: "State" },
  { value: "status", label: "Status" },
];

function Partners() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("search");
  const [searchFavorites, setSearchFavorites] = useState("");
  const [partners, setPartners] = useState<Partner[]>([]);
  const [favorites, setFavorites] = useState<Partner[]>([]); // ✅ تغيير النوع لـ Partner[]
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [isLoadingAction, setIsLoadingAction] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ جلب الدول
  const fetchCountries = useCallback(async () => {
    try {
      const data = await countryService.getAllCountries();
      setCountries(data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  }, []);

  // ✅ جلب الشركاء مع filters
  const fetchPartners = useCallback(
    async (
      pageNum: number = 1,
      searchTerm: string = "",
      field: string = "search",
      countryId: number | null = null,
    ) => {
      try {
        setIsLoading(true);

        const filters: any = {};
        if (searchTerm) {
          if (field === "search") {
            filters.search = searchTerm;
          } else {
            filters[field] = searchTerm;
          }
        }
        if (countryId) {
          filters.country_id = countryId;
        }

        const payload = {
          filters,
          orderBy: "id",
          orderByDirection: "desc",
          perPage: perPage,
          paginate: 1,
          page: pageNum,
        };

        console.log("🔍 Searching with filters:", payload);

        const response = await partnerService.getAllMembers(payload);
        setPartners(response.data);
        setTotalPages(response.meta.last_page);
        setTotalItems(response.meta.total);
        setPage(response.meta.current_page);
      } catch (error) {
        console.error("Error fetching partners:", error);
        toast.error("Failed to load partners");
      } finally {
        setIsLoading(false);
      }
    },
    [perPage],
  );

  // ✅ جلب المفضلة
  const fetchFavorites = useCallback(async () => {
    try {
      setIsLoadingFavorites(true);
      const data = await partnerService.getFavorites();
      setFavorites(data);
      console.log("✅ Favorites loaded:", data.length);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setIsLoadingFavorites(false);
    }
  }, []);

  // ✅ تحميل البيانات
  useEffect(() => {
    fetchCountries();
    fetchPartners(1);
    fetchFavorites();
  }, [fetchCountries, fetchPartners, fetchFavorites]);

  // ✅ البحث مع debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() === "") {
        fetchPartners(1, "", searchField, selectedCountryId);
      } else {
        fetchPartners(1, search, searchField, selectedCountryId);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search, searchField, selectedCountryId, fetchPartners]);

  // ✅ إغلاق dropdown عند الضغط برا
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ إضافة للمفضلة
  const handleAddFavorite = async (userId: number) => {
    setIsLoadingAction(userId);
    try {
      const result = await partnerService.addFavorite(userId);
      if (result.success) {
        toast.success(result.message);
        await fetchFavorites();
        fetchPartners(page, search, searchField, selectedCountryId);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to add to favorites");
    } finally {
      setIsLoadingAction(null);
    }
  };

  // ✅ إزالة من المفضلة
  const handleRemoveFavorite = async (userId: number) => {
    setIsLoadingAction(userId);
    try {
      const result = await partnerService.removeFavorite(userId);
      if (result.success) {
        toast.success(result.message);
        await fetchFavorites();
        fetchPartners(page, search, searchField, selectedCountryId);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to remove from favorites");
    } finally {
      setIsLoadingAction(null);
    }
  };

  // ✅ التحقق إذا كان الشريك في المفضلة
  const isPartnerFavorite = (userId: number) => {
    return favorites.some((fav) => fav.id === userId);
  };

  // ✅ تصفية المفضلة
  const filteredFavorites = favorites.filter((p) => {
    if (!searchFavorites) return true;
    const term = searchFavorites.toLowerCase();
    return (
      p.name?.toLowerCase().includes(term) ||
      p.displayName?.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term) ||
      p.email_company?.toLowerCase().includes(term) ||
      p.phone?.toLowerCase().includes(term) ||
      p.city?.toLowerCase().includes(term) ||
      p.state?.toLowerCase().includes(term) ||
      p.status?.toLowerCase().includes(term)
    );
  });

  // ✅ تغيير الصفحة
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchPartners(newPage, search, searchField, selectedCountryId);
    }
  };

  // ✅ تغيير فلتر الدولة
  const handleCountrySelect = (countryId: number | null) => {
    setSelectedCountryId(countryId);
    setIsCountryDropdownOpen(false);
    fetchPartners(1, search, searchField, countryId);
  };

  // ✅ الحصول على اسم الدولة المختارة
  const getSelectedCountryName = () => {
    if (!selectedCountryId) return "All Countries";
    const country = countries.find((c) => c.id === selectedCountryId);
    return country?.name || "All Countries";
  };

  // ✅ الحصول على علم الدولة المختارة
  const getSelectedCountryFlag = () => {
    if (!selectedCountryId) return null;
    const country = countries.find((c) => c.id === selectedCountryId);
    return country?.flag || null;
  };

  // ✅ مسح الفلتر
  const clearFilters = () => {
    setSearch("");
    setSelectedCountryId(null);
    setSearchField("search");
    fetchPartners(1, "", "search", null);
  };

  // ✅ الدول المفضلة في الأعلى
  const sortedCountries = [...countries].sort((a, b) => {
    if (a.id === selectedCountryId) return -1;
    if (b.id === selectedCountryId) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <AppShell sidebar={SIDEBAR}>
      <div className="flex flex-wrap items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">Trading Partners</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your trading partners and payees. Add partners from the WSA network to your payee
            list to make payments.
          </p>
        </div>
        <div className="ml-auto flex gap-3">
          <button
            onClick={() => {
              fetchPartners(1, search, searchField, selectedCountryId);
              fetchFavorites();
            }}
            className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          {(search || selectedCountryId) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/20"
            >
              <X className="h-4 w-4" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <p className="flex gap-2 rounded-xl bg-info-soft p-4 text-sm">
          <Info className="h-5 w-5 shrink-0 text-primary" />
          This section allows you to customize the list of WSA Pay participants with whom you do
          business. Once added to your list, the partner selected will remain on your list until you
          remove them. You will only be able to transfer funds to partners that you have placed on
          your Trading Partner list.
        </p>
        <div className="surface-card p-4 text-sm">
          <p className="font-semibold">Current Account Balance</p>
          {user?.balances && user.balances.length > 0 ? (
            user.balances.map((b) => (
              <p key={b.currency} className="mt-2 flex justify-between">
                <span>
                  {b.currency}{" "}
                  {parseFloat(b.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
                <span className="font-semibold text-primary">Details</span>
              </p>
            ))
          ) : (
            <p className="mt-2 text-muted-foreground">No balances available</p>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {/* ✅ جميع الشركاء */}
        <div className="surface-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">All Participating Partners List</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                For adding your payee(s) please click on below company name and click "Add Payee".
              </p>
            </div>
            <span className="text-sm text-muted-foreground">Total: {totalItems}</span>
          </div>

          {/* ✅ شريط البحث والفلتر */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search partners..."
                className="h-10 w-full rounded-lg bg-secondary/70 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="h-10 rounded-lg bg-secondary/70 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            >
              {SEARCH_FIELDS.map((field) => (
                <option key={field.value} value={field.value}>
                  {field.label}
                </option>
              ))}
            </select>

            {/* ✅ فلتر الدولة */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className={`flex h-10 items-center gap-2 rounded-lg border px-3 text-sm outline-none transition-all ${
                  selectedCountryId
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary/70 hover:bg-secondary"
                }`}
              >
                {getSelectedCountryFlag() ? (
                  <img
                    src={getSelectedCountryFlag()!}
                    alt="flag"
                    className="h-4 w-6 rounded object-cover"
                  />
                ) : (
                  <Globe className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="max-w-[120px] truncate">{getSelectedCountryName()}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isCountryDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isCountryDropdownOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 max-h-60 w-64 overflow-y-auto rounded-lg bg-card shadow-xl ring-1 ring-black/5">
                  <div className="sticky top-0 bg-card p-2 border-b border-border/40">
                    <input
                      placeholder="Search country..."
                      className="h-8 w-full rounded bg-secondary/50 px-2 text-sm outline-none"
                      onChange={(e) => {
                        const searchTerm = e.target.value.toLowerCase();
                        const items = dropdownRef.current?.querySelectorAll(".country-item");
                        items?.forEach((item) => {
                          const text = item.textContent?.toLowerCase() || "";
                          (item as HTMLElement).style.display = text.includes(searchTerm)
                            ? ""
                            : "none";
                        });
                      }}
                    />
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => handleCountrySelect(null)}
                      className={`country-item flex w-full items-center gap-2 rounded px-3 py-2 text-sm transition-colors ${
                        !selectedCountryId ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                      }`}
                    >
                      <Globe className="h-4 w-4" />
                      <span>All Countries</span>
                    </button>

                    {sortedCountries.map((country) => (
                      <button
                        key={country.id}
                        onClick={() => handleCountrySelect(country.id)}
                        className={`country-item flex w-full items-center gap-2 rounded px-3 py-2 text-sm transition-colors ${
                          selectedCountryId === country.id
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-secondary"
                        }`}
                      >
                        <img
                          src={country.flag}
                          alt={country.name}
                          className="h-4 w-6 rounded object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                        <span className="flex-1 text-left">{country.name}</span>
                        <span className="text-xs text-muted-foreground">{country.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="mt-4 w-full text-sm">
                  <thead className="text-xs text-muted-foreground">
                    <tr className="border-b border-border/40 text-left">
                      <th className="pb-2 font-medium">Company Name</th>
                      <th className="pb-2 font-medium">Country</th>
                      <th className="pb-2 font-medium">City</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.length > 0 ? (
                      partners.map((p) => {
                        const isFav = isPartnerFavorite(p.id);
                        const isLoadingThis = isLoadingAction === p.id;
                        return (
                          <tr key={p.id} className="border-b border-border/40 last:border-0">
                            <td className="py-3 pr-3 font-medium">{p.displayName || p.name}</td>
                            <td className="py-3 text-muted-foreground">
                              <div className="flex items-center gap-2">
                                {p.country?.flag && (
                                  <img
                                    src={p.country.flag}
                                    alt={p.country.name}
                                    className="h-4 w-6 rounded object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                  />
                                )}
                                <span>{p.country?.name || "N/A"}</span>
                              </div>
                            </td>
                            <td className="py-3 text-muted-foreground">
                              {p.city || p.state || "N/A"}
                            </td>
                            <td className="py-3">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                  p.status === "approved"
                                    ? "bg-success-soft text-success"
                                    : "bg-warning-soft text-warning"
                                }`}
                              >
                                {p.status === "approved" ? "Active" : "Pending"}
                              </span>
                            </td>
                            <td className="py-3">
                              <button
                                onClick={() =>
                                  isFav ? handleRemoveFavorite(p.id) : handleAddFavorite(p.id)
                                }
                                disabled={isLoadingThis}
                                className={`flex items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors w-full ${
                                  isFav
                                    ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                                    : "bg-primary/10 text-primary hover:bg-primary/20"
                                } disabled:opacity-50`}
                              >
                                {isLoadingThis ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : isFav ? (
                                  <>
                                    <X className="h-3 w-3" /> Remove
                                  </>
                                ) : (
                                  <>
                                    <Star className="h-3 w-3" /> Add
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          {search || selectedCountryId
                            ? "No partners found matching your filters"
                            : "No partners available"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Showing {partners.length} of {totalItems} partners
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="rounded px-3 py-1 bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="px-2">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="rounded px-3 py-1 bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ✅ المفضلة */}
        <div className="surface-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Selected Payees</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                For removing your payee(s) please click on below company name and click "Remove
                Payee".
              </p>
            </div>
            <span className="text-sm text-muted-foreground">{favorites.length}</span>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchFavorites}
                onChange={(e) => setSearchFavorites(e.target.value)}
                placeholder="Search payees..."
                className="h-10 w-full rounded-lg bg-secondary/70 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {isLoadingFavorites ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="mt-4 w-full text-sm">
                  <thead className="text-xs text-muted-foreground">
                    <tr className="border-b border-border/40 text-left">
                      <th className="pb-2 font-medium">Company Name</th>
                      <th className="pb-2 font-medium">Country</th>
                      <th className="pb-2 font-medium">City</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFavorites.length > 0 ? (
                      filteredFavorites.map((p) => {
                        const isLoadingThis = isLoadingAction === p.id;
                        return (
                          <tr key={p.id} className="border-b border-border/40 last:border-0">
                            <td className="py-3 pr-3 font-medium">{p.displayName || p.name}</td>
                            <td className="py-3 text-muted-foreground">
                              <div className="flex items-center gap-2">
                                {p.country?.flag && (
                                  <img
                                    src={p.country.flag}
                                    alt={p.country.name}
                                    className="h-4 w-6 rounded object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                  />
                                )}
                                <span>{p.country?.name || "N/A"}</span>
                              </div>
                            </td>
                            <td className="py-3 text-muted-foreground">
                              {p.city || p.state || "N/A"}
                            </td>
                            <td className="py-3">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                  p.status === "approved"
                                    ? "bg-success-soft text-success"
                                    : "bg-warning-soft text-warning"
                                }`}
                              >
                                {p.status === "approved" ? "Active" : "Pending"}
                              </span>
                            </td>
                            <td className="py-3">
                              <button
                                onClick={() => handleRemoveFavorite(p.id)}
                                disabled={isLoadingThis}
                                className="flex items-center justify-center gap-1 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 disabled:opacity-50 w-full"
                              >
                                {isLoadingThis ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <>
                                    <X className="h-3 w-3" /> Remove
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          {searchFavorites ? "No matching payees found" : "No payees added yet"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Showing {filteredFavorites.length} of {favorites.length} payees
              </p>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 surface-card grid gap-3 p-6 text-sm md:grid-cols-2">
        <p className="md:col-span-2 font-semibold">Important Notes</p>
        {[
          "Partner to partner transfers within WSA Pay are processed immediately.",
          "Withdrawals above a certain amount may require additional verification.",
          "Withdrawals from your WSA Pay account will only be sent to the bank account that is set up in your Partner Profile.",
          "Need help? Please contact our support team.",
        ].map((n) => (
          <p key={n} className="flex gap-2 text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {n}
          </p>
        ))}
      </div>
    </AppShell>
  );
}
