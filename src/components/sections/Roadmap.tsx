"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { CalendarDays, FlaskConical, Flag, GraduationCap, ScanLine } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Countdown } from "@/components/ui/Countdown";
import { countdownMilestones, roadmap, type MilestoneStatus } from "@/lib/site";
import { cn } from "@/lib/utils";

const statusStyles: Record<MilestoneStatus, { label: string; chip: string; dot: string }> = {
  done: { label: "Done", chip: "bg-white/5 text-fg/80 ring-line-strong", dot: "bg-fg/60" },
  active: { label: "In progress", chip: "bg-volt/10 text-volt ring-volt/30", dot: "bg-volt" },
  upcoming: { label: "Next up", chip: "bg-cyan/10 text-cyan ring-cyan/30", dot: "bg-cyan" },
  planned: { label: "Planned", chip: "bg-white/5 text-muted ring-line-strong", dot: "bg-muted" },
};

const icons = [Flag, ScanLine, FlaskConical, GraduationCap];

/** Counts down to the next milestone still in the future. Picked in the browser so a static build never shows a passed date. */
function NextMilestone() {
  const [next, setNext] = useState<(typeof countdownMilestones)[number] | null>(null);
  useEffect(() => {
    const now = Date.now();
    setNext(countdownMilestones.find((m) => m.date.getTime() > now) ?? countdownMilestones[countdownMilestones.length - 1]);
  }, []);

  return (
    <>
      <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">
        <CalendarDays className="h-3.5 w-3.5" /> Next milestone{next ? ` · ${next.label}` : ""}
      </p>
      <div className="mt-5">
        <Countdown target={(next ?? countdownMilestones[0]).date} />
      </div>
    </>
  );
}

export function Roadmap() {
  const timeline = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: timeline, offset: ["start 0.7", "end 0.6"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="roadmap" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <SectionHeading
            eyebrow="05 / Roadmap"
            title="Building in the open, until April 2027."
            highlight={["open"]}
            description="Baseline models first, then each new research part, then one final test and a user study. Final results are frozen a month before submission, and your survey answers shape the app along the way."
          />
          <Reveal delay={0.15}>
            <div className="glass rounded-3xl p-6 sm:p-8">
              <NextMilestone />
            </div>
          </Reveal>
        </div>

        <div ref={timeline} className="relative mt-20">
          {/* rail */}
          <div className="absolute bottom-0 left-[19px] top-0 w-px bg-line md:left-1/2 md:-translate-x-1/2" />
          <motion.div
            style={{ scaleY }}
            className="absolute bottom-0 left-[19px] top-0 w-px origin-top bg-gradient-to-b from-volt via-cyan to-violet md:left-1/2 md:-translate-x-1/2"
          />

          <ol className="space-y-16 md:space-y-24">
            {roadmap.map((m, i) => {
              const s = statusStyles[m.status];
              const Icon = icons[i] ?? Flag;
              const right = i % 2 === 1;
              return (
                <li key={m.title} className="relative grid md:grid-cols-2 md:gap-20">
                  {/* node */}
                  <div className="absolute left-0 top-0 md:left-1/2 md:-translate-x-1/2">
                    <motion.div
                      initial={{ scale: 0.4, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-20% 0px" }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      className="relative grid h-10 w-10 place-items-center rounded-full border border-line-strong bg-ink"
                    >
                      {m.status === "active" && (
                        <span className="animate-pulse-ring absolute inset-0 rounded-full bg-volt/30" />
                      )}
                      <Icon className={cn("h-4 w-4", m.status === "planned" || m.status === "done" ? "text-muted" : m.status === "active" ? "text-volt" : "text-cyan")} />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: right ? 40 : -40, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className={cn("pl-16 md:pl-0", right ? "md:col-start-2" : "md:pr-0 md:text-right")}
                  >
                    <div className={cn("flex flex-wrap items-center gap-3", !right && "md:justify-end")}>
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">{m.phase}</span>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1", s.chip)}>{s.label}</span>
                    </div>
                    <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{m.title}</h3>
                    <p className={cn("mt-2 inline-flex items-center gap-2 font-display text-lg font-medium", m.status === "planned" ? "text-muted" : "text-gradient")}>
                      {m.when}
                    </p>
                    <p className={cn("mt-4 max-w-md leading-relaxed text-muted", !right && "md:ml-auto")}>{m.summary}</p>
                    <ul className={cn("mt-5 space-y-2.5", !right && "md:ml-auto md:max-w-md")}>
                      {m.items.map((item) => (
                        <li
                          key={item.text}
                          className={cn(
                            "flex items-center gap-3 rounded-xl border border-line bg-white/[0.02] px-4 py-3 text-sm text-fg/90",
                            !right && "md:flex-row-reverse md:text-right",
                          )}
                        >
                          <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", s.dot)} />
                          <span className="w-14 shrink-0 font-mono text-[11px] uppercase tracking-wider text-subtle">{item.date}</span>
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
