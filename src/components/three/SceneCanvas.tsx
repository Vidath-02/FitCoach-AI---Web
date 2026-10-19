"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { useIntro } from "@/components/intro/IntroProvider";
import { cn } from "@/lib/utils";

/**
 * Client-only entry point for 3D scenes.
 * - Loads three.js lazily, and only once the intro has finished, the scene is near the
 *   viewport and the browser is idle, so the ~240 KB download never competes with first paint
 * - Uses a lighter scene on phones and low-end hardware, and none at all on data-saver connections
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

type NetworkInformation = { saveData?: boolean; effectiveType?: string };
type DeviceNavigator = Navigator & { connection?: NetworkInformation; deviceMemory?: number };

/** Data saver or a 2G connection: skip the 3D download entirely. */
function wantsLowData() {
  const c = (navigator as DeviceNavigator).connection;
  return Boolean(c?.saveData || c?.effectiveType === "slow-2g" || c?.effectiveType === "2g");
}

/** Phones, tablets and low-end machines get fewer particles and a lower resolution. */
function isLowPower() {
  const nav = navigator as DeviceNavigator;
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    (nav.hardwareConcurrency ?? 8) <= 4 ||
    (nav.deviceMemory ?? 8) <= 4
  );
}

const whenIdle = (cb: () => void) =>
  typeof window.requestIdleCallback === "function"
    ? window.requestIdleCallback(cb, { timeout: 1500 })
    : window.setTimeout(cb, 300);

export function BodyScanCanvas({ className, fallback }: { className?: string; fallback?: ReactNode }) {
  const { done: introDone } = useIntro();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<"pending" | "fallback" | "full" | "lite">("pending");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Decide once, after the intro and only when the scene is about to be seen.
  useEffect(() => {
    if (mode !== "pending" || !introDone || !visible) return;
    const id = whenIdle(() => {
      if (!hasWebGL() || wantsLowData()) setMode("fallback");
      else setMode(isLowPower() ? "lite" : "full");
    });
    return () => {
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, [mode, introDone, visible]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {mode === "fallback" ? (
        fallback
      ) : mode === "pending" ? null : (
        <WebGLBoundary fallback={fallback}>
          <BodyScanScene active={visible} lite={mode === "lite"} />
        </WebGLBoundary>
      )}
    </div>
  );
}
