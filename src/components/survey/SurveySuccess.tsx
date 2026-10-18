"use client";

import { motion } from "framer-motion";
import { ArrowUp, Check, Share2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useScrollTo } from "@/lib/useScrollTo";
import { features, goals, labelOf } from "./options";
import type { SurveyAnswers } from "./types";

const ease = [0.16, 1, 0.3, 1] as const;
const COLORS = ["#c8ff3d", "#3de0ff", "#8b7bff", "#f4f6fb"];

function Burst() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => {
        const angle = (i / 36) * Math.PI * 2 + Math.random() * 0.3;
        const dist = 120 + Math.random() * 160;
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          rotate: Math.random() * 360,
          color: COLORS[i % COLORS.length],
          size: 4 + Math.random() * 6,
          round: Math.random() > 0.5,
        };
      }),
    [],
  );
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{
            width: p.size,
            height: p.round ? p.size : p.size * 2.2,
            background: p.color,
            borderRadius: p.round ? 999 : 2,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{ x: p.x, y: p.y + 60, opacity: 0, scale: 1, rotate: p.rotate }}
          transition={{ duration: 1.6 + Math.random() * 0.6, ease: [0.2, 0.8, 0.4, 1], delay: 0.35 }}
        />
      ))}
    </div>
  );
}

export function SurveySuccess({ answers, onAnother }: { answers: SurveyAnswers; onAnother: () => void }) {
  const scrollTo = useScrollTo();
  const [copied, setCopied] = useState(false);
  const mustHaves = Object.entries(answers.featureInterest)
    .filter(([, v]) => v === 2)
    .map(([k]) => labelOf(features, k));
  const firstName = answers.name.trim().split(" ")[0];

  const share = async () => {
    const url = window.location.origin;
    const data = { title: "FitCoach AI", text: "Help shape FitCoach AI. A new standard in fitness is coming.", url };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      /* user dismissed share sheet */
    }
  };

  return (
    <div className="relative flex flex-col items-center px-7 py-16 text-center sm:px-12 sm:py-24">
      <div className="relative">
        <Burst />
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="relative grid h-24 w-24 place-items-center rounded-full bg-volt text-ink shadow-[0_0_80px_rgba(200,255,61,0.55)]"
        >
          <span className="animate-pulse-ring absolute inset-0 rounded-full bg-volt/40" />
          <motion.span initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.25, type: "spring", stiffness: 260, damping: 14 }}>
            <Check className="h-11 w-11" strokeWidth={3} />
          </motion.span>
        </motion.div>
      </div>

      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease, delay: 0.4 }}
        className="mt-10 max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl"
      >
        {firstName ? `Thank you, ${firstName}.` : "Thank you."} <span className="text-gradient">You&apos;re shaping the future of fitness.</span>
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease, delay: 0.55 }}
        className="mt-5 max-w-xl leading-relaxed text-muted"
      >
        Your response has been recorded.{" "}
        {answers.betaTester && answers.email
          ? "You're on the beta tester list. I'll email you when the first build is ready to try."
          : answers.earlyAccess && answers.email
            ? "You're on the early-access list, and you'll get an email when Phase 1 is ready in January."
            : "Keep an eye out for Phase 1 in January."}
      </motion.p>

      {(answers.goals.length > 0 || mustHaves.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.7 }}
          className="mt-10 w-full max-w-xl rounded-2xl border border-line bg-white/[0.02] p-5 text-left"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">What you shared</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {answers.goals.map((g) => (
              <span key={g} className="rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-xs text-cyan">
                {labelOf(goals, g)}
              </span>
            ))}
            {mustHaves.map((m) => (
              <span key={m} className="rounded-full border border-volt/30 bg-volt/10 px-3 py-1 text-xs text-volt">
                ★ {m}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease, delay: 0.85 }}
        className="mt-10 flex flex-col gap-3 sm:flex-row"
      >
        <Button size="lg" icon={<Share2 className="h-4 w-4" />} onClick={share}>
          {copied ? "Link copied!" : "Share with a friend"}
        </Button>
        <Button size="lg" variant="ghost" iconLeft={<ArrowUp className="h-4 w-4" />} onClick={() => scrollTo("top")}>
          Back to top
        </Button>
      </motion.div>

      <button onClick={onAnother} className="mt-6 text-xs text-subtle underline-offset-4 transition-colors hover:text-muted hover:underline">
        Submit another response
      </button>
    </div>
  );
}
