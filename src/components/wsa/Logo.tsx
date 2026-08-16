export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden="true">
        <path
          d="M5 8 L13 32 L20 16 L27 32 L35 8"
          fill="none"
          stroke={light ? "white" : "var(--primary)"}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="31" cy="10" r="4" fill="var(--brand-magenta)" />
      </svg>
      <span className="leading-none">
        <span
          className={`block text-xl font-extrabold tracking-tight ${light ? "text-white" : "text-foreground"}`}
        >
          WSA <span className="text-brand-magenta">PAY</span>
        </span>
        <span
          className={`block text-[8px] font-semibold tracking-[0.14em] ${light ? "text-white/70" : "text-muted-foreground"}`}
        >
          GLOBAL PAYMENTS. TRUSTED NETWORK.
        </span>
      </span>
    </span>
  );
}