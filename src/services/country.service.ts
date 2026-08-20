// src/services/country.service.ts
import api from "@/lib/api";

export interface Country {
  id: number;
  name: string;
  key: string;
  code: string;
  active: boolean;
  flag: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deleted: boolean;
}

export interface CountriesResponse {
  data: Country[];
  result: string;
  message: string;
  status: number;
}

class CountryService {
  /**
   * 📥 جلب كل الدول
   */
  async getAllCountries(): Promise<Country[]> {
    try {
      console.log("📥 Fetching countries...");
      const response = await api.get<CountriesResponse>("/fetch-countries");
      console.log("✅ Countries loaded:", response.data.data.length);
      return response.data.data || [];
    } catch (error) {
      console.error("❌ Error fetching countries:", error);
      return [];
    }
  }

  /**
   * 🔍 البحث عن دولة بالاسم
   */
  async searchCountries(searchTerm: string): Promise<Country[]> {
    try {
      const allCountries = await this.getAllCountries();
      return allCountries.filter(
        (country) =>
          country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          country.code.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    } catch (error) {
      console.error("❌ Error searching countries:", error);
      return [];
    }
  }

  /**
   * 🇺🇳 جلب دولة بالـ ID
   */
  async getCountryById(id: number): Promise<Country | null> {
    try {
      const countries = await this.getAllCountries();
      return countries.find((c) => c.id === id) || null;
    } catch (error) {
      console.error("❌ Error fetching country:", error);
      return null;
    }
  }
}

export const countryService = new CountryService();
