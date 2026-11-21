"use client";

import { motion } from "framer-motion";
import { Eye, Gauge, Globe, Lock, Rocket, ShieldCheck } from "lucide-react";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, staggerItem } from "@/components/ui/Reveal";
import { ScrollText } from "@/components/ui/ScrollText";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const pillars = [
  { icon: Gauge, title: "Honest", body: "Every estimate comes with a checked likely range, and “not enough data” beats a guess." },
  { icon: Lock, title: "Private by design", body: "Body photos are processed on my server, deleted after the check and never sent to an outside AI." },
  { icon: Globe, title: "Accessible", body: "Runs in the browser with any phone camera. No depth sensor, no smart scale, no install." },
  { icon: ShieldCheck, title: "Safe", body: "One rule engine checks every change, and nothing changes without your confirmation." },
];

export function VisionMission() {
  return (
    <section id="vision" className="relative py-28 sm:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <Eyebrow>04 / Vision &amp; Mission</Eyebrow>
        </Reveal>

        <ScrollText
          className="mt-10 font-display text-[clamp(2rem,4.6vw,4.1rem)] font-semibold leading-[1.08] tracking-[-0.035em]"
          text="I believe a fitness app should be honest about what it knows, and coach you with a plan that stays in your hands."
          highlight={["honest", "your", "hands"]}
        />

        <div className="mt-24 grid gap-5 md:grid-cols-2">
          <Reveal>
            <SpotlightCard className="h-full p-8 sm:p-10" glow="rgba(61,224,255,0.12)">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">The vision</span>
                <Eye className="h-5 w-5 text-cyan" />
              </div>
              <p className="mt-8 font-display text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
                A world where anyone can understand their body from a phone photo, and trust the numbers because they
                come with an honest range.
              </p>
            </SpotlightCard>
          </Reveal>
          <Reveal delay={0.1}>
            <SpotlightCard className="h-full p-8 sm:p-10">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">The mission</span>
                <Rocket className="h-5 w-5 text-volt" />
              </div>
              <p className="mt-8 font-display text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
                Build an adaptive gym coach whose body check works on home photos, is fair for every body type and is
                honest about its uncertainty, and that never changes your plan without your OK.
              </p>
            </SpotlightCard>
          </Reveal>
        </div>

        <Stagger className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {pillars.map((p) => (
            <motion.div key={p.title} variants={staggerItem} className="rounded-3xl border border-line bg-white/[0.02] p-6">
              <p.icon className="h-5 w-5 text-muted" strokeWidth={1.6} />
              <h4 className="mt-6 font-display text-lg font-semibold tracking-tight">{p.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
