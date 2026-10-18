"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Buttery inertial scrolling (Lenis) for the whole page.
 * Falls back to native scrolling for users who prefer reduced motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      {reduced ? (
        children
      ) : (
        <ReactLenis root options={{ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true }}>
          {children}
        </ReactLenis>
      )}
    </MotionConfig>
  );
}
