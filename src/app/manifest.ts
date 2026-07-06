import type { MetadataRoute } from "next";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Phantom Bio Peptides";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Phantom Bio",
    description:
      "Premium research peptides with third-party testing and reliable fulfillment.",
    start_url: "/",
    display: "standalone",
    background_color: "#060606",
    theme_color: "#4900AD",
    icons: [
      { src: "/icon3", sizes: "192x192", type: "image/png" },
      { src: "/icon4", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
