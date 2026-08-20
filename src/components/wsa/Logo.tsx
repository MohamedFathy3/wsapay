// src/components/wsa/Logo.tsx
import { Link } from "@tanstack/react-router";

interface LogoProps {
  light?: boolean;
  src?: string | null; // ✅ إضافة مصدر الصورة
}

export function Logo({ light, src }: LogoProps) {
  // لو فيه صورة مرفوعة، نعرضها
  if (src) {
    return (
      <Link to="/dashboard" className="flex items-center gap-2">
        <img
          src={src}
          alt="Company Logo"
          className="h-10 w-auto object-contain rounded"
          onError={(e) => {
            // لو الصورة ماتحملتش، نخفيها ونعرض النص
            e.currentTarget.style.display = "none";
          }}
        />
        {/* Fallback في حالة فشل تحميل الصورة */}
        <span className="text-xl font-bold text-white hidden">WSA Pay</span>
      </Link>
    );
  }

  // الشعار الافتراضي (لو مفيش صورة)
  return (
    <Link to="/dashboard" className="flex items-center gap-2">
      {light ? (
        <svg viewBox="0 0 100 40" className="h-10 w-auto fill-white">
          <text x="0" y="30" fontSize="24" fontWeight="bold" fontFamily="system-ui">
            WSA Pay
          </text>
        </svg>
      ) : (
        <svg viewBox="0 0 100 40" className="h-10 w-auto fill-black">
          <text x="0" y="30" fontSize="24" fontWeight="bold" fontFamily="system-ui">
            WSA Pay
          </text>
        </svg>
      )}
    </Link>
  );
}
