"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Check, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * A short, looping "video" of the body check, built from SVG + motion so it stays sharp and light.
 * Plays only while on screen, can be paused, and does not auto-advance for reduced-motion users.
 * All numbers are example values.
 */

const STEP_MS = 3600;
const ease = [0.16, 1, 0.3, 1] as const;

const steps = [
  { title: "Take two photos", body: "Front and side, in your phone's browser. A camera guide checks every photo before anything is estimated." },
  { title: "Cut out the silhouette", body: "A segmentation model separates you from the room. Photos are processed on the server and deleted after the check." },
  { title: "Estimate 14 measurements", body: "A two-view model reads both silhouettes together with your height, weight and sex." },
  { title: "Show a likely range", body: "Every value gets a calibrated range that is right about 90% of the time, carried through to body fat." },
];

// Simple A-pose figures (arms away from the body, as the camera guide asks).
const FRONT =
  "M52 46 L68 46 L70 54 L92 58 Q100 60 101 70 L104 140 Q104 146 98 146 L94 146 L90 82 L84 84 L82 118 Q86 132 86 148 L84 248 L66 248 L61 160 L59 160 L54 248 L36 248 L34 148 Q34 132 38 118 L36 84 L30 82 L26 146 L22 146 Q16 146 16 140 L19 70 Q20 60 28 58 L50 54 Z";
const SIDE =
  "M54 46 L66 46 L68 56 Q80 62 77 90 L74 118 Q81 134 76 150 L72 248 L56 248 L52 160 Q42 140 46 118 L44 90 Q41 62 52 56 Z";

const frontLines = [
  { y: 76, x1: 36, x2: 84 },
  { y: 118, x1: 38, x2: 82 },
  { y: 146, x1: 34, x2: 86 },
];
const sideLines = [
  { y: 76, x1: 44, x2: 77 },
  { y: 118, x1: 46, x2: 74 },
  { y: 146, x1: 47, x2: 77 },
];

function Figure({ path, x, step, lines, label }: { path: string; x: number; step: number; lines: typeof frontLines; label: string }) {
  const filled = step >= 1;
  return (
    <g transform={`translate(${x} 14)`}>
      {/* phone frame */}
      <rect x="0" y="0" width="120" height="262" rx="16" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.14)" />
      <text x="60" y="-4" textAnchor="middle" className="fill-subtle font-mono" fontSize="8" letterSpacing="2">
        {label}
      </text>
      {/* head */}
      <motion.circle
        cx="60"
        cy="28"
        r="14"
        animate={{
          fill: filled ? "rgba(200,255,61,0.22)" : "rgba(200,255,61,0)",
          stroke: filled ? "rgba(200,255,61,0.9)" : "rgba(255,255,255,0.45)",
        }}
        strokeWidth="1.2"
        strokeDasharray={filled ? "0" : "3 3"}
        transition={{ duration: 0.6 }}
      />
      {/* body */}
      <motion.path
        d={path}
        animate={{
          fill: filled ? "rgba(200,255,61,0.22)" : "rgba(200,255,61,0)",
          stroke: filled ? "rgba(200,255,61,0.9)" : "rgba(255,255,255,0.45)",
        }}
        strokeWidth="1.2"
        strokeDasharray={filled ? "0" : "3 3"}
        strokeLinejoin="round"
        transition={{ duration: 0.6 }}
      />
      {/* measurement lines */}
      {step >= 2 &&
        lines.map((l, i) => (
          <motion.line
            key={l.y}
            x1={l.x1}
            x2={l.x2}
            y1={l.y}
            y2={l.y}
            stroke="var(--color-cyan)"
            strokeWidth="1.6"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease, delay: 0.15 + i * 0.18 }}
          />
        ))}
    </g>
  );
}

function Stage({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 300 292" className="h-auto w-full" role="img" aria-label={`Body check animation: ${steps[step].title}`}>
      <Figure path={FRONT} x={22} step={step} lines={frontLines} label="FRONT" />
      <Figure path={SIDE} x={158} step={step} lines={sideLines} label="SIDE" />
      {/* scan beam while segmenting */}
      {step === 1 && (
        <motion.g initial={{ y: 14 }} animate={{ y: 270 }} transition={{ duration: 1.6, ease: "easeInOut", repeat: 1, repeatType: "reverse" }}>
          <rect x="16" y="-14" width="268" height="14" fill="url(#beam)" />
          <rect x="16" y="0" width="268" height="1.2" fill="var(--color-volt)" />
        </motion.g>
      )}
      <defs>
        <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgb(200 255 61 / 0)" />
          <stop offset="1" stopColor="rgb(200 255 61 / 0.25)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function RangeRow({ label, value, unit, lo, hi, min, max, delay }: { label: string; value: number; unit: string; lo: number; hi: number; min: number; max: number; delay: number }) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-mono tabular-nums text-fg">
          {value}
          {unit} <span className="text-subtle">· likely {lo}–{hi}</span>
        </span>
      </div>
      <div className="relative mt-2.5 h-1.5 rounded-full bg-white/10">
        <motion.div
          className="absolute inset-y-0 origin-center rounded-full bg-gradient-to-r from-cyan to-volt"
          style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, ease, delay }}
        />
        <motion.div
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ink bg-volt"
          style={{ left: `${pct(value)}%` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: delay + 0.5 }}
        />
      </div>
    </div>
  );
}

function StepDetail({ step }: { step: number }) {
  if (step === 0)
    return (
      <ul className="space-y-2.5">
        {["Good light", "Whole body in frame", "Arms away from the body", "Sharp, not blurry"].map((c, i) => (
          <motion.li
            key={c}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.3 + i * 0.35 }}
            className="flex items-center gap-2.5 text-sm text-fg/90"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-volt/15 text-volt">
              <Check className="h-3 w-3" />
            </span>
            {c}
          </motion.li>
        ))}
      </ul>
    );
  if (step === 1)
    return (
      <div className="space-y-3 text-sm">
        <p className="flex items-center gap-2.5 text-fg/90">
          <span className="h-2 w-2 animate-pulse rounded-full bg-volt" /> Silhouette found in both photos
        </p>
        <p className="text-muted">Bad photo? You get a retry tip. The app never guesses from a photo it can&apos;t trust.</p>
      </div>
    );
  if (step === 2)
    return (
      <ul className="grid grid-cols-2 gap-2.5 text-sm">
        {[
          ["Chest", "98 cm"],
          ["Waist", "90 cm"],
          ["Hips", "97 cm"],
          ["+ 11 more", ""],
        ].map(([k, v], i) => (
          <motion.li
            key={k}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.3 + i * 0.2 }}
            className="rounded-xl border border-line bg-white/[0.02] px-3 py-2"
          >
            <span className="text-muted">{k}</span>
            {v && <span className="float-right font-mono text-cyan">{v}</span>}
          </motion.li>
        ))}
      </ul>
    );
  return (
    <div className="space-y-5">
      <RangeRow label="Waist" value={90} unit=" cm" lo={86} hi={94} min={80} max={100} delay={0.2} />
      <RangeRow label="Body fat" value={26} unit="%" lo={21} hi={31} min={15} max={37} delay={0.5} />
    </div>
  );
}

export function BodyCheckDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const playing = inView && !paused && !reduced;

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => setStep((s) => (s + 1) % steps.length), STEP_MS);
    return () => clearTimeout(id);
  }, [playing, step]);

  return (
    <div ref={ref} className="overflow-hidden rounded-3xl border border-line bg-surface/70">
      {/* story-style progress */}
      <div className="flex gap-1.5 px-5 pt-5 sm:px-8 sm:pt-7">
        {steps.map((s, i) => (
          <button
            key={s.title}
            onClick={() => setStep(i)}
            aria-label={`Show step ${i + 1}: ${s.title}`}
            aria-current={i === step ? "step" : undefined}
            className="group flex h-6 flex-1 items-center"
          >
            <span className="relative block h-1 w-full overflow-hidden rounded-full bg-white/10 group-hover:bg-white/20">
              {i < step && <span className="absolute inset-0 bg-volt/70" />}
              {i === step && (
                <motion.span
                  key={`${step}-${playing}`}
                  className="absolute inset-y-0 left-0 bg-volt"
                  initial={{ width: playing ? "0%" : "100%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: playing ? STEP_MS / 1000 : 0, ease: "linear" }}
                />
              )}
            </span>
          </button>
        ))}
        {!reduced && (
          <button
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play animation" : "Pause animation"}
            className="ml-2 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line text-muted hover:text-fg"
          >
            {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          </button>
        )}
      </div>

      <div className="grid items-center gap-8 p-5 sm:p-8 md:grid-cols-[1.1fr_1fr] md:gap-12">
        <div className="mx-auto w-full max-w-[420px]">
          <Stage step={step} />
        </div>

        <div className="min-h-[240px]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">
                Step {step + 1} of {steps.length}
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{steps[step].title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{steps[step].body}</p>
              <div className="mt-6">
                <StepDetail step={step} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <p className={cn("border-t border-line px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle sm:px-8")}>
        Animation of the planned body check · example values
      </p>
    </div>
  );
}
