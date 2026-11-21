"use client";

import { motion } from "framer-motion";
import { ArrowRight, Dumbbell, HeartHandshake, RotateCcw, ScanLine, Scale, Soup, UserRoundCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, staggerItem } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { cn } from "@/lib/utils";

/** All 26 features, grouped as in the project document (F-numbers kept so they match the report). */
const modules = [
  {
    code: "M1",
    icon: UserRoundCheck,
    title: "Account & setup",
    body: "Decides who can safely use which features, then collects the goal, schedule and gym details every plan depends on. 16–17s get a limited version with no calorie or body numbers.",
    features: [
      ["F01", "Eligibility & onboarding"],
      ["F02", "Goals & weekly commitment"],
      ["F03", "Starting profile & gym setup"],
      ["F17", "Account & access"],
      ["F20", "Ages 16–17 pathway"],
    ],
  },
  {
    code: "M2",
    icon: Dumbbell,
    title: "Training",
    body: "Builds the weekly plan, guides each workout and saves every set safely. Plans are versioned, so your workout history is never rewritten.",
    features: [
      ["F04", "Weekly planning & routines"],
      ["F05", "Exercise library & guided sessions"],
      ["F06", "Set logging & alternatives"],
      ["F23", "Advanced sets & blocks"],
      ["F25", "CSV import"],
      ["F26", "Barbell plate calculator"],
    ],
  },
  {
    code: "M3",
    icon: Soup,
    title: "Nutrition & recovery",
    body: "A meal photo can suggest foods, but you confirm foods and amounts, and calories always come from food tables, never from an AI guess.",
    features: [
      ["F07", "Meal journal"],
      ["F08", "Recovery check-ins"],
      ["F09", "Food-energy estimation"],
      ["F10", "Food-photo assistance"],
      ["F21", "Reviewed meal guidance"],
      ["F22", "Saved meals & recipes"],
    ],
  },
  {
    code: "M4",
    icon: ScanLine,
    title: "Body & progress",
    research: true,
    body: "Turns photos and logs into measurements, body-fat ranges, forecasts and progress, always shown with a range or “not enough data”.",
    features: [
      ["F13", "Body check (research core)"],
      ["F14", "Forecasts & adaptive calories"],
      ["F11", "Today, progress & history"],
    ],
  },
  {
    code: "M5",
    icon: HeartHandshake,
    title: "Coaching & safety",
    body: "An AI coach and an optional human coach, but neither can change anything on its own: both propose, and you confirm.",
    features: [
      ["F12", "AI Coach"],
      ["F24", "Human-coach workspace"],
      ["F19", "Safety rules"],
      ["F15", "Privacy & data rights"],
      ["F16", "Reminders"],
      ["F18", "Full fictional demo"],
    ],
  },
] as const;

const rules = [
  { title: "One safety authority", body: "Forms, the AI coach, the human coach and imports all pass the same safety rules before anything is saved." },
  { title: "Proposals, not edits", body: "Only your confirmation changes the plan, and it can be undone if nothing changed since." },
  { title: "Versions protect history", body: "A plan change makes a new version. Finished workouts and past meals are never rewritten." },
  { title: "Unknown is not zero", body: "A day with no meal log is “unknown” and drafts never count, so totals and forecasts never use missing data." },
];

const loop = ["Body check", "Targets", "Plan & daily logs", "Progress"];

export function Features() {
  return (
    <section id="features" className="relative py-28 sm:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="02 / The app"
          title="One coach. 26 features. Five modules."
          highlight={["26"]}
          description="One feature, the body check, is the research contribution. The other 25 make it a complete, safe coaching app, and give the research a real use."
        />

        {/* The loop that ties the modules together */}
        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap items-center gap-2 text-sm">
            {loop.map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full border px-4 py-2",
                    i === 0 ? "border-volt/40 bg-volt/10 text-volt" : "border-line bg-white/[0.03] text-fg/90",
                  )}
                >
                  {step}
                </span>
                {i < loop.length - 1 && <ArrowRight className="h-4 w-4 text-subtle" aria-hidden />}
              </span>
            ))}
            <span className="flex items-center gap-2 text-muted">
              <RotateCcw className="h-4 w-4 text-cyan" aria-hidden />
              progress and new body checks correct the targets
            </span>
          </div>
        </Reveal>

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {modules.map((m) => (
            <motion.div key={m.code} variants={staggerItem}>
              <SpotlightCard
                className={cn("h-full p-7", "research" in m && "border-volt/30")}
                glow={"research" in m ? "rgba(200,255,61,0.16)" : "rgba(61,224,255,0.10)"}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-white/[0.03] text-volt">
                      <m.icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs text-subtle">{m.code}</span>
                  </div>
                  {"research" in m && (
                    <span className="rounded-full bg-volt px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink">
                      Research core
                    </span>
                  )}
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{m.body}</p>
                <ul className="mt-5 space-y-1.5">
                  {m.features.map(([id, name]) => (
                    <li key={id} className={cn("flex items-baseline gap-3 text-sm", id === "F13" ? "text-volt" : "text-fg/85")}>
                      <span className="w-8 shrink-0 font-mono text-[11px] text-subtle">{id}</span>
                      {name}
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </motion.div>
          ))}

          {/* Sixth tile: the rules every module follows */}
          <motion.div variants={staggerItem}>
            <div className="h-full rounded-3xl border border-line bg-white/[0.02] p-7">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-white/[0.03] text-cyan">
                  <Scale className="h-5 w-5" />
                </div>
                <span className="font-mono text-xs text-subtle">Every module</span>
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">Four rules that keep it honest</h3>
              <ul className="mt-4 space-y-4">
                {rules.map((r) => (
                  <li key={r.title}>
                    <p className="text-sm font-medium text-fg">{r.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted">{r.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </Stagger>
      </div>
    </section>
  );
}
