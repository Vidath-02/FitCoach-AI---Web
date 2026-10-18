"use client";

import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { AlertCircle, ArrowLeft, ArrowRight, Check, CornerDownLeft, LoaderCircle, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { submitSurvey } from "@/lib/submitSurvey";
import { site } from "@/lib/site";
import { useScrollTo } from "@/lib/useScrollTo";
import { useLenis } from "lenis/react";
import { cn } from "@/lib/utils";
import { steps } from "./steps";
import { SurveyIntro } from "./SurveyIntro";
import { SurveySuccess } from "./SurveySuccess";
import { initialAnswers, type SurveyAnswers, type Update } from "./types";
import { validators } from "./validation";

// Bump the version when steps change, so old drafts don't resume on the wrong step.
const STORAGE_KEY = "fitcoach-survey-draft-v2";
/** Set after a successful submit, so a returning visitor sees a thank-you instead of a fresh survey. */
const SUBMITTED_KEY = "fitcoach-survey-submitted";
/** Unfinished drafts older than this are discarded. */
const DRAFT_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;
const ease = [0.16, 1, 0.3, 1] as const;

type Phase = "intro" | "steps" | "done";

interface Draft {
  answers: SurveyAnswers;
  step: number;
  maxStep: number;
  startedAt: number;
  savedAt?: number;
}

const storage = {
  load(): Draft | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Draft) : null;
    } catch {
      return null;
    }
  },
  save(d: Draft) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...d, savedAt: Date.now() }));
    } catch {
      /* storage unavailable; survey still works */
    }
  },
  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  },
  markSubmitted() {
    try {
      localStorage.setItem(SUBMITTED_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  },
  submittedBefore(): boolean {
    try {
      return localStorage.getItem(SUBMITTED_KEY) !== null;
    } catch {
      return false;
    }
  },
};

/** A draft is worth resuming only if it's recent and the visitor actually got somewhere. */
const isResumable = (d: Draft) =>
  Date.now() - (d.savedAt ?? d.startedAt) < DRAFT_MAX_AGE_MS && (d.maxStep > 0 || Boolean(d.answers?.ageRange));

const slide = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60, filter: "blur(10px)" }),
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60, filter: "blur(10px)" }),
};

/* ------------------------------------------------------------------ */
/*  Progress pieces                                                    */
/* ------------------------------------------------------------------ */
function ProgressRing({ value }: { value: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-16 w-16">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
        <motion.circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="url(#ring)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - value) }}
          transition={{ duration: 0.8, ease }}
        />
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3de0ff" />
            <stop offset="100%" stopColor="#c8ff3d" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 grid place-items-center font-mono text-xs tabular-nums">{Math.round(value * 100)}%</span>
    </div>
  );
}

function StepRail({
  current,
  maxStep,
  onJump,
}: {
  current: number;
  maxStep: number;
  onJump: (i: number) => void;
}) {
  const progress = current / steps.length;
  const minutesLeft = Math.max(1, Math.round(((steps.length - current) / steps.length) * site.surveyMinutes));
  return (
    <aside className="hidden flex-col border-r border-line p-8 lg:flex">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Your progress</p>
      <ol className="relative mt-6 space-y-1">
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          const reachable = i <= maxStep && i !== current;
          return (
            <li key={s.id}>
              <button
                type="button"
                disabled={!reachable}
                onClick={() => onJump(i)}
                className={cn(
                  "group flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                  active ? "bg-white/[0.05] text-fg" : done ? "text-fg/80 hover:bg-white/[0.03]" : "text-subtle",
                  reachable && "cursor-pointer",
                  !reachable && "cursor-default",
                )}
              >
                <span
                  className={cn(
                    "relative grid h-7 w-7 shrink-0 place-items-center rounded-full border font-mono text-[11px] transition-all duration-500",
                    done && "border-volt bg-volt text-ink",
                    active && "border-volt text-volt shadow-[0_0_16px_rgba(200,255,61,0.35)]",
                    !done && !active && "border-line-strong",
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                </span>
                <span className="flex-1">{s.short}</span>
                {active && <motion.span layoutId="rail-dot" className="h-1.5 w-1.5 rounded-full bg-volt" />}
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-auto flex items-center gap-4 rounded-2xl border border-line bg-white/[0.02] p-4">
        <ProgressRing value={progress} />
        <div>
          <p className="text-sm font-medium">{current === 0 ? "Just getting started" : progress >= 0.8 ? "Almost there!" : "Nice pace"}</p>
          <p className="text-xs text-muted">About {minutesLeft} min left</p>
        </div>
      </div>
    </aside>
  );
}

function MobileProgress({ current }: { current: number }) {
  return (
    <div className="flex gap-1.5 lg:hidden" aria-hidden>
      {steps.map((s, i) => (
        <span key={s.id} className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
          <motion.span
            className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-cyan to-volt"
            initial={false}
            animate={{ scaleX: i < current ? 1 : i === current ? 0.5 : 0 }}
            transition={{ duration: 0.6, ease }}
          />
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Survey                                                             */
/* ------------------------------------------------------------------ */
export function Survey() {
  const scrollTo = useScrollTo();
  const lenis = useLenis();
  const cardRef = useRef<HTMLDivElement>(null);
  const shake = useAnimationControls();

  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<SurveyAnswers>(initialAnswers);
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resumeStep, setResumeStep] = useState<number | null>(null);
  const [submittedBefore, setSubmittedBefore] = useState(false);
  const startedAt = useRef<number>(0);
  const hydrated = useRef(false);

  // Restore a saved draft on first load.
  useEffect(() => {
    setSubmittedBefore(storage.submittedBefore());
    const draft = storage.load();
    if (draft && !isResumable(draft)) storage.clear();
    else if (draft) {
      setAnswers({ ...initialAnswers, ...draft.answers });
      setStep(Math.min(draft.step, steps.length - 1));
      setMaxStep(Math.min(draft.maxStep, steps.length - 1));
      startedAt.current = draft.startedAt;
      setResumeStep(Math.min(draft.step, steps.length - 1));
    }
    hydrated.current = true;
  }, []);

  // Persist progress while answering.
  useEffect(() => {
    if (!hydrated.current || phase !== "steps") return;
    storage.save({ answers, step, maxStep, startedAt: startedAt.current });
  }, [answers, step, maxStep, phase]);

  const update: Update = useCallback((key, value) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    setError(null);
  }, []);

  const keepInView = () => {
    const top = cardRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0 || top > window.innerHeight * 0.5) scrollTo("survey-card");
  };

  const goTo = (i: number) => {
    setDir(i > step ? 1 : -1);
    setStep(i);
    setError(null);
    setShowErrors(false);
    setMaxStep((m) => Math.max(m, i));
    keepInView();
  };

  const start = () => {
    if (!startedAt.current) startedAt.current = Date.now();
    setPhase("steps");
    keepInView();
  };

  const restart = () => {
    storage.clear();
    setAnswers(initialAnswers);
    setStep(0);
    setMaxStep(0);
    setResumeStep(null);
    startedAt.current = Date.now();
    setPhase("steps");
    keepInView();
  };

  const next = async () => {
    const msg = validators[step]?.(answers) ?? null;
    if (msg) {
      setError(msg);
      setShowErrors(true);
      shake.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.45 } });
      // After the highlights render, bring the first unanswered question into view.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const first = cardRef.current?.querySelector<HTMLElement>("[data-invalid]");
          if (!first) return;
          if (lenis) lenis.scrollTo(first, { offset: -130, duration: 1 });
          else first.scrollIntoView({ behavior: "smooth", block: "center" });
        }),
      );
      return;
    }
    if (step < steps.length - 1) return goTo(step + 1);

    // final step → submit
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitSurvey(answers, startedAt.current || Date.now());
      storage.clear();
      storage.markSubmitted();
      setSubmittedBefore(true);
      setPhase("done");
      keepInView();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const back = () => step > 0 && goTo(step - 1);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const t = e.target as HTMLElement;
    if (e.key !== "Enter" || e.shiftKey || t.tagName === "TEXTAREA" || t.tagName === "BUTTON") return;
    e.preventDefault();
    void next();
  };

  const isLast = step === steps.length - 1;
  const current = steps[step];
  const StepComponent = current.Component;

  return (
    <div
      id="survey-card"
      ref={cardRef}
      className="relative overflow-clip rounded-[2rem] border border-line bg-surface/70 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
    >
      {/* top glow line */}
      <div aria-hidden className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-volt/60 to-transparent" />

      <AnimatePresence mode="wait" initial={false}>
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
            transition={{ duration: 0.6, ease }}
          >
            <SurveyIntro
              onStart={start}
              resumeStep={resumeStep}
              totalSteps={steps.length}
              submittedBefore={submittedBefore}
              onRestart={restart}
            />
          </motion.div>
        )}

        {phase === "steps" && (
          <motion.div
            key="steps"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
            transition={{ duration: 0.6, ease }}
            className="grid lg:grid-cols-[290px_1fr]"
          >
            <StepRail current={step} maxStep={maxStep} onJump={goTo} />

            <div className="flex min-w-0 flex-col" onKeyDown={onKeyDown}>
              <div className="px-6 pb-4 pt-8 sm:px-10 sm:pt-10 lg:px-12">
                <MobileProgress current={step} />
                <div className="mt-6 flex items-center gap-3 lg:mt-0">
                  <span className="grid h-9 w-9 place-items-center rounded-xl border border-volt/30 bg-volt/10 text-volt">
                    <current.icon className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                    Step {step + 1} <span className="text-subtle">/ {steps.length}</span>
                  </span>
                </div>
                <AnimatePresence mode="wait" initial={false} custom={dir}>
                  <motion.div
                    key={current.id + "-head"}
                    custom={dir}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease }}
                  >
                    <h3 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">
                      {current.title}
                    </h3>
                    <p className="mt-2 text-muted">{current.subtitle}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="relative min-h-[460px] px-6 pb-10 pt-6 sm:px-10 lg:px-12">
                <AnimatePresence mode="wait" initial={false} custom={dir}>
                  <motion.div
                    key={current.id}
                    custom={dir}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease, delay: 0.04 }}
                  >
                    <StepComponent answers={answers} update={update} showErrors={showErrors} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Sticky action bar */}
              <div className="sticky bottom-0 z-20 mt-auto border-t border-line bg-ink-2/85 px-6 py-4 backdrop-blur-xl sm:px-10 lg:px-12">
                <AnimatePresence>
                  {(error || submitError) && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      role="alert"
                      className="flex items-center gap-2 overflow-hidden pb-3 text-sm text-danger"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {submitError ?? error}
                    </motion.p>
                  )}
                </AnimatePresence>
                <div className="flex items-center justify-between gap-3">
                  <Button
                    variant="ghost"
                    iconLeft={<ArrowLeft className="h-4 w-4" />}
                    onClick={back}
                    disabled={step === 0 || submitting}
                    className={cn(step === 0 && "invisible")}
                  >
                    Back
                  </Button>
                  <div className="flex items-center gap-4">
                    <span className="hidden items-center gap-1.5 font-mono text-[11px] text-subtle md:inline-flex">
                      press <kbd className="inline-flex items-center gap-1 rounded-md border border-line bg-white/[0.04] px-1.5 py-0.5">Enter <CornerDownLeft className="h-3 w-3" /></kbd>
                    </span>
                    <motion.div animate={shake}>
                      <Button
                        onClick={() => void next()}
                        disabled={submitting}
                        magnetic
                        icon={
                          submitting ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          ) : isLast ? (
                            <Send className="h-4 w-4" />
                          ) : (
                            <ArrowRight className="h-4 w-4" />
                          )
                        }
                      >
                        {submitting ? "Submitting" : isLast ? "Submit responses" : "Continue"}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease }}
          >
            <SurveySuccess
              answers={answers}
              onAnother={() => {
                setAnswers(initialAnswers);
                setStep(0);
                setMaxStep(0);
                setResumeStep(null);
                startedAt.current = 0;
                setPhase("intro");
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
