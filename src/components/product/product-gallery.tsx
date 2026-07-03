"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WCImage } from "@/types";

export function ProductGallery({
  images,
  name,
}: {
  images: WCImage[];
  name: string;
}) {
  const [index, setIndex] = React.useState(0);
  const [zoom, setZoom] = React.useState({ x: 50, y: 50, on: false });

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-2xl border border-dashed border-border bg-background" />
    );
  }
  const main = images[index];

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      on: true,
    });
  }

  return (
    <div className="space-y-3">
      <div
        onMouseMove={onMove}
        onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
        className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-background-elevated"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={main.src}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <Image
              src={main.src}
              alt={main.alt || name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={cn(
                "object-cover transition-transform duration-500",
                zoom.on && "scale-[1.6]",
              )}
              style={
                zoom.on
                  ? {
                      transformOrigin: `${zoom.x}% ${zoom.y}%`,
                    }
                  : undefined
              }
            />
          </motion.div>
        </AnimatePresence>
        <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-[11px] backdrop-blur transition-opacity opacity-0 group-hover:opacity-100">
          <ZoomIn className="h-3 w-3" />
          Hover to zoom
        </div>
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border transition-all",
                i === index
                  ? "border-primary"
                  : "border-border hover:border-border-strong",
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img.src}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
