import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthService } from "@/services/auth";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { LoginForm } from "./login-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sign in",
  description: "Sign in to your Phantom Bio Peptides account.",
  path: "/login",
  noIndex: true,
});

interface Props {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const session = await AuthService.getSession();
  const { next } = await searchParams;
  if (session) redirect(next && next.startsWith("/") ? next : "/account");

  return (
    <div className="container-page py-14">
      <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Sign in" }]} />
      <div className="mx-auto mt-8 max-w-md">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-primary">
            Account
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Welcome back.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to view orders, track shipments, and manage addresses.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-card p-6 md:p-8">
          <LoginForm next={next} />
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
