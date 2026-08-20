// src/services/profile.service.ts
import api from "@/lib/api";

export interface UpdateProfileData {
  name?: string;
  display_name?: string;
  email_company?: string;
  phone?: string;
  address_one?: string;
  address_two?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  fax?: string;
  country_id?: number | string;
  first_name_administrator?: string;
  middle_name_administrator?: string;
  last_name_administrator?: string;
  mobile_administrator?: string;
  email?: string;
  logo?: File | string | null;
}

export interface UpdatePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

class ProfileService {
  /**
   * تحديث بيانات البروفايل
   * PUT /api/profile/update
   * ملاحظة: نستخدم FormData عشان نقدر نرفع الصور
   */
  async updateProfile(data: UpdateProfileData): Promise<UpdateProfileData> {
    try {
      // ✅ تحويل البيانات إلى FormData
      const formData = new FormData();

      // إضافة كل الحقول اللي مش فارغة
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (key === "logo" && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // ✅ إرسال الطلب باستخدام FormData
      const response = await api.post("/profile/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  /**
   * تغيير  المرور
   * POST /apكلمةi/profile/update-password
   */
  async updatePassword(data: UpdatePasswordData): Promise<UpdatePasswordData> {
    try {
      const response = await api.post("/profile/update-password", data);
      return response.data;
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();
