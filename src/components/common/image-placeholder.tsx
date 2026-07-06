import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  label?: string;
  className?: string;
}

export function ImagePlaceholder({ label, className }: ImagePlaceholderProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 flex items-center justify-center overflow-hidden",
        className,
      )}
      style={{
        background:
          "radial-gradient(80% 60% at 50% 18%, #4900AD 0%, #060606 78%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 45% at 50% 40%, rgba(168,121,255,0.35) 0%, transparent 65%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative flex flex-col items-center gap-4 px-6 text-center">
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-0 rounded-full blur-2xl"
            style={{
              background:
                "radial-gradient(circle, rgba(168,121,255,0.55) 0%, transparent 70%)",
            }}
          />
          <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] backdrop-blur">
            <FlaskConical className="h-7 w-7 text-white/85" strokeWidth={1.5} />
          </div>
        </div>

        {label && (
          <div className="max-w-[80%]">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/55">
              Phantom Bio
            </p>
            <p className="mt-1.5 font-display text-sm font-bold uppercase tracking-[0.14em] text-white/85">
              {label}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
