"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Brain, Camera, ChartLine, HeartPulse, InfinityIcon, Moon, ScanLine } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, staggerItem } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Counter } from "@/components/ui/Counter";
import { creator } from "@/lib/site";

const steps = [
  {
    icon: Camera,
    title: "Capture",
    body: "Two quick photos, one from the front and one from the side, taken with the phone you already own. No tape, no smart scale.",
  },
  {
    icon: ScanLine,
    title: "Analyse",
    body: "A computer-vision model detects your body's key points and estimates measurements like chest, waist and hips.",
  },
  {
    icon: ChartLine,
    title: "Progress",
    body: "Every scan becomes a data point. See real change over time and get guidance tuned to your body and goals.",
  },
];

const benefits = [
  {
    icon: HeartPulse,
    title: "A stronger heart",
    body: "Regular activity improves cardiovascular fitness and helps manage blood pressure and cholesterol.",
  },
  {
    icon: Brain,
    title: "A clearer mind",
    body: "Exercise is linked to better mood, lower stress and reduced symptoms of anxiety and depression.",
  },
  {
    icon: Moon,
    title: "Better sleep & energy",
    body: "Active people tend to fall asleep faster, sleep deeper and feel more energised through the day.",
  },
  {
    icon: InfinityIcon,
    title: "A longer, healthier life",
    body: "Staying active lowers the risk of many chronic diseases and keeps you independent for longer.",
  },
];

export function About() {
  return (
    <section id="about" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="01 / About FitCoach AI"
          title="Fitness progress, finally measured properly."
          highlight={["measured"]}
          description={
            <>
              Most people track fitness with a bathroom scale and a guess. Weight alone hides the real story:
              you can lose fat, gain muscle and see <em className="not-italic text-fg">no change on the scale</em>.
              FitCoach AI gives everyone access to the kind of body measurements that used to need a trainer.
            </>
          }
        />

        {/* Who's building it / Why */}
        <div className="mt-20 grid gap-5 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <SpotlightCard className="h-full p-8">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-volt to-cyan font-display text-lg font-bold text-ink">
                  {creator.initials}
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Who&apos;s building it</p>
                  <h3 className="mt-1 font-display text-xl font-semibold tracking-tight">{creator.name}</h3>
                  <p className="text-sm text-muted">{creator.role}</p>
                </div>
              </div>
              <p className="mt-6 leading-relaxed text-muted">
                FitCoach AI is my individual final-year project for a BEng (Hons) in Software Engineering at the
                University of Westminster, studied at IIT Sri Lanka. Before this, I spent two years in industry
                building automation pipelines, backend services and applied-AI tools. Now I&apos;m using that
                experience to answer one simple question: why is understanding your own body still so hard?
              </p>
              <h3 className="mt-8 font-display text-2xl font-semibold tracking-tight">Why I&apos;m building it</h3>
              <p className="mt-3 leading-relaxed text-muted">
                Motivation dies when progress is invisible. Accurate, effortless measurement makes progress visible,
                and visible progress keeps people moving. That&apos;s the habit loop I want to unlock for everyone.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {creator.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-4 text-sm text-fg/85 transition-colors hover:border-volt/50 hover:text-volt"
                  >
                    {l.label}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </SpotlightCard>
          </Reveal>

          {/* Label stays on top; the three cards share the remaining height evenly. */}
          <div className="flex flex-col gap-5 lg:col-span-3">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">How it works</p>
            </Reveal>
            <Stagger className="grid flex-1 gap-5 sm:grid-cols-3 lg:grid-cols-1 lg:grid-rows-3" stagger={0.12}>
              {steps.map((s, i) => (
                <motion.div key={s.title} variants={staggerItem}>
                  <SpotlightCard className="h-full p-6 lg:p-7">
                    <div className="flex h-full flex-col gap-5 lg:flex-row lg:items-center lg:gap-7">
                      <div className="flex items-center gap-4 lg:w-44 lg:shrink-0">
                        <span className="font-mono text-xs text-subtle">0{i + 1}</span>
                        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-white/[0.03] text-volt">
                          <s.icon className="h-5 w-5" />
                        </div>
                        <h4 className="font-display text-xl font-semibold tracking-tight">{s.title}</h4>
                      </div>
                      <p className="text-sm leading-relaxed text-muted lg:text-[15px]">{s.body}</p>
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </Stagger>
          </div>
        </div>

        {/* Why fitness matters */}
        <div className="mt-32">
          <div className="grid items-end gap-10 lg:grid-cols-2">
            <SectionHeading
              eyebrow="Why fitness matters"
              title="Movement is the closest thing to medicine."
              highlight={["medicine"]}
            />
            <Reveal delay={0.1}>
              <div className="glass relative overflow-hidden rounded-3xl p-8">
                <div className="absolute -right-10 -top-10 h-56 w-56 bg-[radial-gradient(closest-side,rgb(200_255_61/0.2),transparent)]" />
                <p className="font-display text-6xl font-semibold tracking-[-0.04em] sm:text-7xl">
                  <Counter to={150} />
                  <span className="text-volt">+</span>
                  <span className="ml-2 align-middle text-2xl text-muted sm:text-3xl">min / week</span>
                </p>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
                  The World Health Organization recommends that adults get 150–300 minutes of moderate
                  activity every week. FitCoach AI is designed to make reaching it feel rewarding.
                </p>
              </div>
            </Reveal>
          </div>

          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
            {benefits.map((b) => (
              <motion.div key={b.title} variants={staggerItem}>
                <SpotlightCard className="h-full p-7">
                  <b.icon className="h-6 w-6 text-volt" strokeWidth={1.6} />
                  <h3 className="mt-10 font-display text-lg font-semibold tracking-tight">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{b.body}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
