"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, Layers, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";
import { steps } from "./steps";

const ease = [0.16, 1, 0.3, 1] as const;

/** Positions + tilts a card (Framer) while an inner wrapper floats (CSS), kept separate so transforms don't clash. */
function FloatCard({
  className,
  rotate,
  delay,
  float,
  children,
}: {
  className: string;
  rotate: number;
  delay: number;
  float: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease, delay }}
      className={`absolute ${className}`}
    >
      <div className="glass rounded-2xl p-4 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.9)]" style={{ animation: float }}>
        {children}
      </div>
    </motion.div>
  );
}

/** Decorative stack of mini controls, previewing what the survey feels like. */
function PreviewStack() {
  return (
    <div aria-hidden className="relative mx-auto h-[340px] w-full max-w-[380px]">
      <FloatCard rotate={-6} delay={0.1} className="left-0 top-4 w-[78%]" float="float 7s ease-in-out infinite">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Your goals</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Build muscle", "Posture", "Stay healthy"].map((c, i) => (
            <span
              key={c}
              className={
                i !== 1
                  ? "rounded-full bg-volt px-3 py-1.5 text-xs font-medium text-ink"
                  : "rounded-full border border-line px-3 py-1.5 text-xs text-muted"
              }
            >
              {c}
            </span>
          ))}
        </div>
      </FloatCard>

      <FloatCard rotate={4} delay={0.25} className="right-0 top-[120px] w-[80%]" float="float 8s ease-in-out -2s infinite">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Camera scan comfort</p>
        <div className="mt-3 flex justify-between text-2xl">
          {["😟", "😕", "😐", "🙂", "🤩"].map((e, i) => (
            <span key={e} className={i === 4 ? "scale-125 drop-shadow-[0_0_12px_rgba(200,255,61,0.6)]" : "opacity-40 grayscale"}>
              {e}
            </span>
          ))}
        </div>
      </FloatCard>

      <FloatCard rotate={-2} delay={0.4} className="bottom-2 left-[6%] w-[84%]" float="float 9s ease-in-out -4s infinite">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Privacy importance</p>
          <p className="font-display text-sm font-semibold text-volt">Critical</p>
        </div>
        <div className="relative mt-4 h-1.5 rounded-full bg-white/10">
          <div className="absolute inset-y-0 left-0 w-[85%] rounded-full bg-gradient-to-r from-cyan to-volt" />
          <div className="absolute left-[85%] top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-ink bg-volt shadow-[0_0_14px_rgba(200,255,61,0.7)]" />
        </div>
      </FloatCard>
    </div>
  );
}

export function SurveyIntro({
  onStart,
  resumeStep,
  onRestart,
}: {
  onStart: () => void;
  resumeStep: number | null;
  onRestart: () => void;
}) {
  return (
    <div className="grid items-center gap-12 p-7 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:p-16">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">FitCoach AI · Research survey</p>
        <h3 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl">
          Your answers decide what gets built.
        </h3>
        <p className="mt-5 max-w-lg leading-relaxed text-muted">
          Forget boring forms. Tap, slide and rate your way through {steps.length} short steps. It takes about{" "}
          {site.surveyMinutes} minutes, and every response feeds directly into my research.
        </p>

        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Layers, label: `${steps.length} quick steps` },
            { icon: Clock, label: `~${site.surveyMinutes} minutes` },
            { icon: ShieldCheck, label: "Anonymous by default" },
          ].map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2.5 rounded-xl border border-line bg-white/[0.02] px-3.5 py-3 text-sm">
              <Icon className="h-4 w-4 shrink-0 text-volt" />
              {label}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button size="lg" magnetic icon={<ArrowRight className="h-4 w-4" />} onClick={onStart}>
            {resumeStep !== null ? `Continue from step ${resumeStep + 1}` : "Start the survey"}
          </Button>
          {resumeStep !== null && (
            <Button size="lg" variant="ghost" iconLeft={<RotateCcw className="h-4 w-4" />} onClick={onRestart}>
              Start over
            </Button>
          )}
        </div>
      </div>

      <PreviewStack />
    </div>
  );
}
