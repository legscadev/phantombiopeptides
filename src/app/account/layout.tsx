import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  MapPin,
  Heart,
  LogOut,
} from "lucide-react";
import { AuthService } from "@/services/auth";
import { logoutAction } from "@/app/actions/auth";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
];

export default async function AccountLayout({
  children,
}: LayoutProps<"/account">) {
  const session = await AuthService.getSession();
  if (!session) redirect("/login?next=/account");

  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Account" }]} />

      <div className="mt-6 border-b border-border pb-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-primary">
          Account
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          Hi, {session.displayName || session.email.split("@")[0]}.
        </h1>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside>
          <nav className="space-y-1">
            {LINKS.map((l) => (
              <AccountNavLink key={l.href} {...l} />
            ))}
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-background-elevated hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}

function AccountNavLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-background-elevated hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
