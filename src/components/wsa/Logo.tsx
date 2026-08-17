import logoAsset from "@/assets/wsa-logo.jpg.asset.json";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <img
        src={logoAsset.url}
        alt="WSA Pay logo"
        className="h-10 w-10 rounded-full bg-white object-contain p-0.5"
      />
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