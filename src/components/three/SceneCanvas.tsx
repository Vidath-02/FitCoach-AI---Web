"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Client-only entry point for 3D scenes.
 * - Loads three.js lazily (keeps it out of the initial JS bundle)
 * - Pauses rendering when scrolled off-screen
 * - Falls back gracefully if WebGL is unavailable
 *
 * To add another 3D element, create a scene in this folder and load it the same way.
 */
const BodyScanScene = dynamic(() => import("./BodyScanScene"), { ssr: false, loading: () => null });

class WebGLBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function BodyScanCanvas({ className, fallback }: { className?: string; fallback?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(hasWebGL());
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {supported === false ? (
        fallback
      ) : supported ? (
        <WebGLBoundary fallback={fallback}>
          <BodyScanScene active={visible} />
        </WebGLBoundary>
      ) : null}
    </div>
  );
}
