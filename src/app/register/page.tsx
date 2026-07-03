import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthService } from "@/services/auth";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { RegisterForm } from "./register-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Create an account",
  description: "Create your Phantom Bio Peptides account.",
  path: "/register",
  noIndex: true,
});

export default async function RegisterPage() {
  const session = await AuthService.getSession();
  if (session) redirect("/account");

  return (
    <div className="container-page py-14">
      <Breadcrumb
        crumbs={[{ label: "Home", href: "/" }, { label: "Create account" }]}
      />
      <div className="mx-auto mt-8 max-w-md">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-primary">
            Account
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Create your account.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Faster checkout, order history, and address book — takes 30 seconds.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-card p-6 md:p-8">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
