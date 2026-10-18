"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, Clock, ScanLine, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SplitText } from "@/components/ui/Reveal";
import { BodyScanCanvas } from "@/components/three/SceneCanvas";
import { site } from "@/lib/site";
import { useScrollTo } from "@/lib/useScrollTo";
import { useIntro } from "@/components/intro/IntroProvider";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

/** Floating measurement tags drawn over the 3D figure (the "computer vision" HUD). */
const tags = [
  { label: "Shoulders", base: 46.2, unit: "cm", pos: "left-[4%] top-[22%]", side: "left" as const },
  { label: "Chest", base: 98.4, unit: "cm", pos: "right-[2%] top-[33%]", side: "right" as const },
  { label: "Waist", base: 81.7, unit: "cm", pos: "left-[0%] top-[50%]", side: "left" as const },
  { label: "Hip", base: 96.1, unit: "cm", pos: "right-[4%] top-[60%]", side: "right" as const },
];

function MeasureTag({
  label,
  base,
  unit,
  pos,
  side,
  delay,
}: (typeof tags)[number] & { delay: number }) {
  const { done } = useIntro();
  const [value, setValue] = useState(base);
  useEffect(() => {
    const id = setInterval(() => setValue(base + (Math.random() - 0.5) * 0.6), 1400 + delay * 400);
    return () => clearInterval(id);
  }, [base, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, x: side === "left" ? -12 : 12 }}
      animate={done ? { opacity: 1, scale: 1, x: 0 } : undefined}
      transition={{ duration: 1, ease, delay: 1.2 + delay * 0.15 }}
      className={cn("absolute z-10 hidden sm:block", pos)}
    >
      <div className={cn("flex items-center gap-2", side === "right" && "flex-row-reverse")}>
        <div className="glass rounded-xl px-3 py-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">{label}</p>
          <p className="font-mono text-sm tabular-nums text-fg">
            {value.toFixed(1)}
            <span className="ml-1 text-[11px] text-volt">{unit}</span>
          </p>
        </div>
        <span className="h-px w-10 bg-gradient-to-r from-volt/0 via-volt/70 to-volt/0" />
        <span className="relative grid h-2.5 w-2.5 place-items-center">
          <span className="animate-pulse-ring absolute inset-0 rounded-full bg-volt/60" />
          <span className="h-1.5 w-1.5 rounded-full bg-volt" />
        </span>
      </div>
    </motion.div>
  );
}

function FigureFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="h-[70%] w-[45%] rounded-full bg-gradient-to-b from-cyan/20 via-violet/10 to-volt/20 blur-3xl" />
    </div>
  );
}

export function Hero() {
  const scrollTo = useScrollTo();
  const { done } = useIntro();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Parallax only when the columns sit side by side; stacked (mobile) it would overlap the scene.
  const desktop = useMediaQuery("(min-width: 1024px)");
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", desktop ? "35%" : "0%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, desktop ? 0 : 1]);
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", desktop ? "18%" : "0%"]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28 lg:pt-24"
    >
      {/* spotlight behind the figure */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[10%] h-[80vh] w-[60vw] rounded-full bg-[radial-gradient(closest-side,rgba(61,224,255,0.14),transparent)] blur-2xl"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-6 px-6 lg:grid-cols-[1.08fr_0.92fr]">
        <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={done ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, ease, delay: 0.2 }}
            className="inline-flex items-center gap-3 rounded-full border border-line bg-white/[0.03] py-1.5 pl-1.5 pr-4 backdrop-blur"
          >
            <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-volt px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink">
              <Sparkles className="h-3 w-3" /> Pre-launch
            </span>
            <span className="whitespace-nowrap text-xs text-muted sm:text-sm">
              <span className="hidden sm:inline">AI body measurement · </span>Phase 1 in January
            </span>
          </motion.div>

          <h1 className="mt-8 font-display text-[clamp(2.9rem,7.2vw,6.2rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-balance">
            <SplitText
              text="A new standard in fitness is coming."
              highlight={["fitness"]}
              highlightClassName="text-gradient gradient-drift"
              delay={0.35}
              animateOnMount
              play={done}
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={done ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, ease, delay: 0.9 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-muted text-pretty sm:text-lg"
          >
            FitCoach AI turns your phone camera into a precision body-measurement tool, then uses those
            numbers to track real progress and coach you forward. Help shape it from day one.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={done ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, ease, delay: 1.05 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button size="lg" magnetic icon={<ArrowRight className="h-4 w-4" />} onClick={() => scrollTo("survey")}>
              Take the {site.surveyMinutes}-min survey
            </Button>
            <Button size="lg" variant="ghost" onClick={() => scrollTo("about")}>
              Discover FitCoach AI
            </Button>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={done ? { opacity: 1 } : undefined}
            transition={{ duration: 1.2, delay: 1.3 }}
            className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6"
          >
            {[
              { icon: ScanLine, k: "Phone camera", v: "body scan" },
              { icon: Clock, k: `~${site.surveyMinutes} minutes`, v: "to share your voice" },
              { icon: Sparkles, k: "Jan 2027", v: "Phase 1 release" },
            ].map(({ icon: Icon, k, v }) => (
              <div key={k}>
                <Icon className="h-4 w-4 text-volt" />
                <dt className="mt-3 font-display text-sm font-semibold sm:text-base">{k}</dt>
                <dd className="text-xs text-subtle sm:text-sm">{v}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* 3D figure */}
        <motion.div
          style={{ y: sceneY, scale: sceneScale }}
          initial={{ opacity: 0 }}
          animate={done ? { opacity: 1 } : undefined}
          transition={{ duration: 2, delay: 0.4 }}
          className="relative mx-auto aspect-[4/5] w-full max-w-[520px] lg:-mr-10"
        >
          {/* scanner frame corners */}
          <div aria-hidden className="pointer-events-none absolute inset-6 z-10">
            {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map(
              (c) => (
                <span key={c} className={cn("absolute h-8 w-8 rounded-[2px] border-volt/60", c)} />
              ),
            )}
            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-ink/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-volt backdrop-blur">
              ● Scanning
            </span>
          </div>

          <BodyScanCanvas className="absolute inset-0" fallback={<FigureFallback />} />

          {tags.map((t, i) => (
            <MeasureTag key={t.label} {...t} delay={i} />
          ))}
        </motion.div>
      </div>

      <motion.button
        onClick={() => scrollTo("about")}
        initial={{ opacity: 0 }}
        animate={done ? { opacity: 1 } : undefined}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-subtle transition-colors hover:text-fg md:flex"
        aria-label="Scroll to learn more"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="animate-float grid h-9 w-6 place-items-start justify-center rounded-full border border-line-strong pt-1.5">
          <ArrowDown className="h-3 w-3" />
        </span>
      </motion.button>
    </section>
  );
}
