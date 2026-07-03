"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, User2 } from "lucide-react";
import { Logo } from "./logo";
import { SearchCommand } from "./search-command";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import type { WCCategory } from "@/types";

interface NavbarProps {
  categories?: WCCategory[];
}

const STATIC_NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/coa", label: "COA" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export function Navbar({ categories = [] }: NavbarProps) {
  const pathname = usePathname();
  const { itemCount, openDrawer } = useCart();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Show up to two live category links inline, alongside the static routes.
  const nav = [
    ...STATIC_NAV.slice(0, 1),
    ...categories.slice(0, 1).map((c) => ({
      href: `/category/${c.slug}`,
      label: c.name,
    })),
    ...STATIC_NAV.slice(1),
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-page">
        <div className="flex h-16 items-center gap-4 lg:h-20 lg:gap-8">
          <Logo />

          <nav className="hidden flex-1 items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <span className="absolute inset-0 rounded-full bg-background-elevated" />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden flex-1 justify-end lg:flex">
            <SearchCommand />
          </div>

          <div className="ml-auto flex items-center gap-2 lg:ml-2">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex"
              aria-label="Account"
              asChild
            >
              <Link href="/account">
                <User2 className="h-4 w-4" />
              </Link>
            </Button>

            <button
              type="button"
              onClick={openDrawer}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-strong bg-background-elevated/60 backdrop-blur transition-all hover:border-primary/40 hover:bg-background-elevated"
              aria-label={`Open cart (${itemCount} items)`}
            >
              <ShoppingBag className="h-4 w-4" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground ring-2 ring-background">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <div className="p-6">
                  <SearchCommand />
                </div>
                <nav className="flex flex-col px-2 pb-8">
                  {nav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl px-4 py-3 text-base font-medium text-foreground/80 transition hover:bg-background-elevated hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
