import { ShieldCheck, Truck, Lock, PackageCheck, FlaskConical } from "lucide-react";

const ITEMS = [
  { icon: ShieldCheck, label: "99%+ purity" },
  { icon: Truck, label: "Fast U.S. shipping" },
  { icon: Lock, label: "Secure checkout" },
  { icon: PackageCheck, label: "FREE U.S. shipping over $125" },
  { icon: FlaskConical, label: "Third-party tested" },
];

// Server component — pure CSS marquee, no JS needed.
export function AnnouncementBar() {
  return (
    <div className="surface-dark relative overflow-hidden">
      <div className="relative flex items-center py-2.5">
        <div className="flex min-w-full shrink-0 animate-marquee gap-24 whitespace-nowrap pr-24 text-xs text-white/85">
          {[...ITEMS, ...ITEMS].map((it, i) => (
            <Row key={i} icon={it.icon} label={it.label} />
          ))}
        </div>
        <div
          aria-hidden
          className="flex min-w-full shrink-0 animate-marquee gap-24 whitespace-nowrap pr-24 text-xs text-white/85"
        >
          {[...ITEMS, ...ITEMS].map((it, i) => (
            <Row key={i} icon={it.icon} label={it.label} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
}: {
  icon: typeof ShieldCheck;
  label: string;
}) {
  return (
    <span className="inline-flex shrink-0 items-center gap-3">
      <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={2.4} />
      <span className="font-medium tracking-[0.14em] uppercase">
        {label}
      </span>
    </span>
  );
}
