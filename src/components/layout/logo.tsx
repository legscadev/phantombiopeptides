import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LOGO_SRC =
  "https://i0.wp.com/kickbackai-pkjdo.wpcomstaging.com/wp-content/uploads/2026/06/PHANTOM-BIO-LABS-4.png?w=1500&ssl=1";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center", className)}
      aria-label="Phantom Bio Peptides — home"
    >
      <Image
        src={LOGO_SRC}
        alt="Phantom Bio Peptides"
        width={1500}
        height={600}
        priority
        sizes="(min-width: 1024px) 240px, 180px"
        className="h-12 w-auto lg:h-14"
      />
    </Link>
  );
}
