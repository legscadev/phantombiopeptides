import Link from "next/link";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { env } from "@/env";

export const metadata = buildMetadata({
  title: "Forgot password",
  description: "Reset your Phantom Bio Peptides password.",
  path: "/forgot-password",
  noIndex: true,
});

export default function ForgotPasswordPage() {
  const wpResetUrl = env.WC_STORE_URL
    ? `${env.WC_STORE_URL.replace(/\/$/, "")}/wp-login.php?action=lostpassword`
    : "#";

  return (
    <div className="container-page py-14">
      <Breadcrumb
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Forgot password" },
        ]}
      />
      <div className="mx-auto mt-8 max-w-md text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-primary">
          Account
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Reset your password.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Password resets are handled by WordPress so the reset email links
          land in your inbox reliably.
        </p>
        <div className="mt-8 flex flex-col gap-2">
          <Button asChild size="lg">
            <a href={wpResetUrl} target="_blank" rel="noopener noreferrer">
              Reset via WordPress
            </a>
          </Button>
          <Link href="/login" className="text-sm text-primary hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
