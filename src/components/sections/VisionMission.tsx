"use client";

import { motion } from "framer-motion";
import { Eye, Gauge, Globe, Lock, Rocket, WandSparkles } from "lucide-react";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, staggerItem } from "@/components/ui/Reveal";
import { ScrollText } from "@/components/ui/ScrollText";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const pillars = [
  { icon: Gauge, title: "Accurate", body: "Measurements you can trust, validated against real tape-measure data." },
  { icon: Lock, title: "Private by design", body: "Your body data is yours. Minimal collection, clear consent, no surprises." },
  { icon: Globe, title: "Accessible", body: "No gym membership or expensive hardware — just the phone in your pocket." },
  { icon: WandSparkles, title: "Motivating", body: "Progress you can see, goals that adapt, and feedback that keeps you going." },
];

export function VisionMission() {
  return (
    <section id="vision" className="relative py-28 sm:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <Eyebrow>02 — Vision &amp; Mission</Eyebrow>
        </Reveal>

        <ScrollText
          className="mt-10 font-display text-[clamp(2rem,4.6vw,4.1rem)] font-semibold leading-[1.08] tracking-[-0.035em]"
          text="We believe everyone deserves to understand their body as precisely as an elite athlete — using nothing more than the phone in their pocket."
          highlight={["everyone", "precisely", "phone"]}
        />

        <div className="mt-24 grid gap-5 md:grid-cols-2">
          <Reveal>
            <SpotlightCard className="h-full p-8 sm:p-10" glow="rgba(61,224,255,0.12)">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">Our vision</span>
                <Eye className="h-5 w-5 text-cyan" />
              </div>
              <p className="mt-8 font-display text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
                A world where tracking your fitness is as effortless as taking a photo — and every person can see,
                trust and celebrate their own progress.
              </p>
            </SpotlightCard>
          </Reveal>
          <Reveal delay={0.1}>
            <SpotlightCard className="h-full p-8 sm:p-10">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">Our mission</span>
                <Rocket className="h-5 w-5 text-volt" />
              </div>
              <p className="mt-8 font-display text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
                Build an AI coach that measures accurately, protects privacy, and turns body data into simple,
                personal guidance that helps people stay active for life.
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
