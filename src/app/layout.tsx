import type { Metadata, Viewport } from "next";
import { Geist_Mono, Roboto } from "next/font/google";
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
import { PromoModal } from "@/components/marketing/promo-modal";
import { buildMetadata, organizationJsonLd } from "@/lib/seo";
import "./globals.css";

const sans = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = buildMetadata({});

export const viewport: Viewport = {
  themeColor: "#ffffff",
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
      className={`${sans.variable} ${mono.variable} antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground flex flex-col font-sans">
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
          <PromoModal />
          <AnnouncementBar />
          <Navbar isSignedIn={isSignedIn} />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer categories={categories} />
        </Providers>
      </body>
    </html>
  );
}
