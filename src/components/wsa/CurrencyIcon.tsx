import { DollarSign, Euro, PoundSterling } from "lucide-react";

const MAP = { USD: DollarSign, EUR: Euro, GBP: PoundSterling } as const;

export function CurrencyIcon({ code, className = "" }: { code: string; className?: string }) {
  const Icon = MAP[code as keyof typeof MAP] ?? DollarSign;
  return (
    <span className={`icon-tile h-8 w-8 ${className}`}>
      <Icon className="h-4 w-4" />
    </span>
  );
}
