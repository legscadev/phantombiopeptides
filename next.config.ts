import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    remotePatterns: [
      // WooCommerce media on the origin & Jetpack Photon CDN
      { protocol: "https", hostname: "phantombiopeptides.com" },
      { protocol: "https", hostname: "admin.phantombiopeptides.com" },
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "i1.wp.com" },
      { protocol: "https", hostname: "i2.wp.com" },
      // Mocks / placeholders
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    return [
      // Short legal URLs → /legal/<slug>
      { source: "/terms", destination: "/legal/terms" },
      { source: "/privacy", destination: "/legal/privacy" },
      { source: "/shipping", destination: "/legal/shipping" },
      { source: "/returns", destination: "/legal/returns" },
      { source: "/research-use", destination: "/legal/research-use" },
      { source: "/quality", destination: "/legal/quality" },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
