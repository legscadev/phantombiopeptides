"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
  className?: string;
}

/**
 * Reveal-on-scroll wrapper. Guarantees content becomes visible even when
 * the intersection observer never fires (e.g. reduced-motion users, JS
 * disabled after hydration, or full-page screenshots that skip scrolling).
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  once = true,
  className,
}: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-5% 0px" });
  const reduce = useReducedMotion();
  const [safety, setSafety] = React.useState(false);

  // If we haven't been revealed within 1.2s of mount (e.g. below the fold
  // at initial paint), force-show so the section is never invisible.
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSafety(true);
    const id = setTimeout(() => setSafety(true), 1200);
    return () => clearTimeout(id);
  }, []);

  const visible = inView || reduce || safety;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{
        duration: 0.6,
        delay: inView ? delay : 0,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
