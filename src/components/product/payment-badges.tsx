import { Lock } from "lucide-react";

/**
 * Payment methods trust strip — accepted card networks + wallets.
 * Renders lightweight SVG marks so we don't ship brand logos as images.
 */
export function PaymentBadges() {
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-background-muted p-4">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
        <Lock className="h-3 w-3" />
        Secure payment methods
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Chip label="VISA" tone="blue" />
        <Chip label="Mastercard" tone="orange" />
        <Chip label="AMEX" tone="cyan" />
        <Chip label="Discover" tone="black" />
        <Chip label="Apple Pay" tone="black" />
        <Chip label="Google Pay" tone="black" />
      </div>
    </div>
  );
}

function Chip({ label, tone }: { label: string; tone: "blue" | "orange" | "cyan" | "black" }) {
  const bg =
    tone === "blue"
      ? "bg-[#1a1f71] text-white"
      : tone === "orange"
        ? "bg-white text-[#eb001b] border border-[#f79e1b]"
        : tone === "cyan"
          ? "bg-[#006fcf] text-white"
          : "bg-foreground text-background";
  return (
    <span
      className={`inline-flex h-7 items-center rounded-md px-2.5 text-[10px] font-bold tracking-wider ${bg}`}
    >
      {label}
    </span>
  );
}
