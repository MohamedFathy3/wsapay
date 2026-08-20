// src/services/token.service.ts
import Cookies from "js-cookie";

class TokenService {
  private readonly TOKEN_KEY = "wsa_token";

  setToken(token: string): void {
    Cookies.set(this.TOKEN_KEY, token, {
      expires: 7, // 7 أيام
      secure: import.meta.env.PROD, // ✅ HTTPS فقط في production
      sameSite: "strict", // ✅ منع CSRF
      path: "/",
      // domain: '.wsa-elite.com' // ✅ لو عندك subdomains
    });
    console.log("✅ Token saved securely in cookies");
  }

  getToken(): string | null {
    return Cookies.get(this.TOKEN_KEY) || null;
  }

  removeToken(): void {
    Cookies.remove(this.TOKEN_KEY, { path: "/" });
    console.log("🗑️ Token removed from cookies");
  }

  clearAll(): void {
    this.removeToken();
    // تنظيف localStorage من أي بيانات حساسة
    localStorage.removeItem("user_data"); // ده مهم عشان يمسح بيانات المستخدم القديمة
    sessionStorage.clear();
  }
}

export const tokenService = new TokenService();
