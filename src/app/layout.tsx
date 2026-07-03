import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { CartService } from "@/services/cart";
import { CategoriesService } from "@/services/categories";
import { AuthService } from "@/services/auth";
import { Providers } from "@/providers";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AgeGate } from "@/components/common/age-gate";
import { buildMetadata, organizationJsonLd } from "@/lib/seo";
import "./globals.css";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const display = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = buildMetadata({});

export const viewport: Viewport = {
  themeColor: "#0a0a12",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [initialCart, categories, session] = await Promise.all([
    CartService.get().catch(() => null),
    CategoriesService.list().catch(() => []),
    AuthService.getSession().catch(() => null),
  ]);
  const isSignedIn = Boolean(session);

  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${display.variable} antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground flex flex-col">
        <Script
          id="ld-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
        <Providers initialCart={initialCart}>
          <AgeGate />
          <AnnouncementBar />
          <Navbar categories={categories} isSignedIn={isSignedIn} />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer categories={categories} />
        </Providers>
      </body>
    </html>
  );
}
