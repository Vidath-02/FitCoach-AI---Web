"use client";

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useIntro } from "./IntroProvider";

const ease = [0.16, 1, 0.3, 1] as const;
const BOOT_SECONDS = 1.8;
const MIN_BOOT_SECONDS = 1;
const statuses = ["Calibrating camera", "Detecting key points", "Estimating measurements", "Scan complete"];
const word = "FITCOACH".split("");

/** Corner brackets + figure: the FitCoach AI mark, drawn like a scanner locking on. */
function ScanMark() {
  const corners = ["M4 22V4h18", "M74 4h18v18", "M92 74v18H74", "M22 92H4V74"];
  return (
    <div className="relative h-28 w-28 sm:h-32 sm:w-32">
      <svg viewBox="0 0 96 96" className="absolute inset-0 h-full w-full" fill="none">
        {corners.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            stroke="var(--color-volt)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease, delay: 0.1 + i * 0.08 }}
          />
        ))}
        <motion.g
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease, delay: 0.55 }}
          style={{ transformOrigin: "48px 48px" }}
          stroke="var(--color-fg)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="48" cy="30" r="6" fill="var(--color-fg)" stroke="none" />
          <path d="M34 44l14 7 14-7M48 51v14l-8 12M48 65l8 12" />
        </motion.g>
      </svg>
      {/* scan line sweeping the mark */}
      <motion.div
        aria-hidden
        className="absolute inset-x-2 h-[2px] rounded-full bg-volt shadow-[0_0_16px_4px_rgba(200,255,61,0.55)]"
        initial={{ top: "12%", opacity: 0 }}
        animate={{ top: ["12%", "88%", "12%"], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.45 }}
      />
    </div>
  );
}

export function IntroOverlay() {
  const { active, done, finish, unmount } = useIntro();
  const lenis = useLenis();
  const [exiting, setExiting] = useState(false);
  const exitingRef = useRef(false);
  const progress = useMotionValue(0);
  const pct = useTransform(progress, (v) => String(Math.round(v)).padStart(3, "0"));
  const bar = useTransform(progress, (v) => v / 100);
  const [status, setStatus] = useState(0);

  const exit = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    progress.set(100);
    setStatus(statuses.length - 1);
    setExiting(true);
    finish(); // the hero starts its entrance as the panels open
  }, [finish, progress]);

  // Boot sequence: count to 100 while the status lines tick over, then open.
  // On slow phones the overlay has already been on screen while the scripts loaded,
  // so that wait counts towards the boot rather than being added on top of it.
  useEffect(() => {
    if (!active) return;
    const waited = Math.max(0, performance.now() / 1000 - 0.6);
    const controls = animate(progress, 100, {
      duration: Math.max(MIN_BOOT_SECONDS, BOOT_SECONDS - waited),
      ease: [0.45, 0, 0.2, 1],
      onUpdate: (v) => setStatus(Math.min(statuses.length - 1, Math.floor((v / 100) * statuses.length))),
      onComplete: () => setTimeout(exit, 150),
    });
    return () => controls.stop();
  }, [active, exit, progress]);

  // Lock scrolling while the intro covers the page; any key or click skips it.
  useEffect(() => {
    if (!active || done) return;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    lenis?.stop();
    const skip = () => exit();
    window.addEventListener("keydown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      html.style.overflow = "";
      lenis?.start();
    };
  }, [active, done, exit, lenis]);

  if (!active) return null;

  return (
    <div
      data-intro-overlay
      role="presentation"
      aria-hidden
      onClick={exit}
      className="fixed inset-0 z-[100] cursor-pointer select-none"
    >
      {/* Two panels that split open along a glowing seam */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-ink"
        animate={exiting ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
        onAnimationComplete={() => exiting && unmount()}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-ink"
        animate={exiting ? { y: "100%" } : { y: 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-volt to-transparent shadow-[0_0_24px_2px_rgba(200,255,61,0.6)]"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={exiting ? { scaleX: [0, 1, 1], opacity: [0, 1, 0] } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.9, times: [0, 0.35, 1], ease }}
      />

      {/* Content layer: fades out before the panels open */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        animate={exiting ? { opacity: 0, scale: 0.98, filter: "blur(6px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.35, ease }}
      >
        <div className="bg-grid mask-radial absolute inset-0 opacity-70" />
        <div className="absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgb(200_255_61/0.08),transparent)]" />

        {/* Full-screen scan beam */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent to-volt/[0.08]"
          initial={{ top: "-10%" }}
          animate={{ top: "100%" }}
          transition={{ duration: BOOT_SECONDS, ease: "easeInOut", delay: 0.15 }}
        >
          <div className="absolute inset-x-0 bottom-0 h-px bg-volt/70 shadow-[0_0_18px_2px_rgba(200,255,61,0.45)]" />
        </motion.div>

        {/* Centre: mark + wordmark */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          <ScanMark />
          <h2 className="mt-8 flex overflow-hidden font-display text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
            {word.map((ch, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, ease, delay: 0.5 + i * 0.045 }}
              >
                {ch}
              </motion.span>
            ))}
            <motion.span
              className="ml-[0.25em] inline-block text-volt"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, ease, delay: 0.5 + word.length * 0.045 }}
            >
              AI
            </motion.span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-4 font-mono text-[11px] uppercase tracking-[0.3em] text-muted"
          >
            A new standard in fitness
          </motion.p>
        </div>

        {/* Bottom HUD: status + counter + progress line */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-8 sm:px-10 sm:pb-10">
          <div className="flex items-end justify-between gap-6 font-mono text-[11px] uppercase tracking-[0.2em]">
            <div className="h-4 overflow-hidden text-muted">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={status}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.35, ease }}
                  className={status === statuses.length - 1 ? "text-volt" : ""}
                >
                  <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-volt align-middle" />
                  {statuses[status]}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="font-display text-3xl font-semibold tabular-nums tracking-tight text-fg sm:text-4xl">
              <motion.span>{pct}</motion.span>
              <span className="text-volt">%</span>
            </p>
          </div>
          <div className="mt-4 h-px w-full bg-line">
            <motion.div
              className="h-px origin-left bg-gradient-to-r from-cyan to-volt shadow-[0_0_12px_rgba(200,255,61,0.6)]"
              style={{ scaleX: bar }}
            />
          </div>
          <p className="mt-3 hidden text-right font-mono text-[10px] uppercase tracking-[0.2em] text-subtle sm:block">
            Click or press any key to skip
          </p>
        </div>
      </motion.div>
    </div>
  );
}
