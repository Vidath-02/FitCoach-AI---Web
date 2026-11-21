"use client";

import { motion } from "framer-motion";
import { Check, CircleAlert, Minus, X } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, staggerItem } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { cn } from "@/lib/utils";

/** The three gaps (G1–G3) and the new parts (N1–N4) that address them. */
const gaps = [
  {
    code: "G1",
    title: "Home photos",
    problem: "Open models learn from clean lab silhouettes, made by one segmentation model, and are less accurate on real home photos.",
    fixes: [
      { code: "N1", title: "Better segmentation", body: "Compare foundation models (Sapiens, SAM 3) with DeepLabV3 and MediaPipe, and pick the most accurate at the waist." },
      { code: "N2", title: "“Messy” training", body: "Add rough edges, small holes and arms close to the body during training, so an imperfect silhouette doesn’t break the model." },
    ],
  },
  {
    code: "G2",
    title: "Body types",
    problem: "Training data is mostly average body sizes, so larger and more muscular people get weaker results.",
    fixes: [
      { code: "N3", title: "3D body pre-training", body: "Train first on computer-generated SMPL-X bodies, including larger and muscular shapes, then on real BodyM data." },
    ],
  },
  {
    code: "G3",
    title: "Honest results",
    problem: "Apps show one number and papers report an average error. None of the apps I reviewed shows a per-person range.",
    fixes: [
      { code: "N4", title: "Checked likely ranges", body: "Conformal prediction calibrated for each sex and body-size group, carried through to body fat and energy." },
    ],
  },
];

const rangeSteps = [
  "After training, the model is tested on people it has never seen, and its error is recorded for each person.",
  "From those errors I find the margin that covers 90% of people, separately for men and women and for each body-size group.",
  "For a new user the app adds that margin: prediction 90 cm, margin 4 cm, so the likely range is 86–94 cm.",
  "Groups where the model is less sure automatically get wider ranges, and the app explains why.",
];

type Cell = "yes" | "no" | "partly" | string;
// FitCoach AI first, so it stays visible on phones where the table scrolls sideways.
const products = ["FitCoach AI", "Prism Labs", "Bodymapp", "3DLOOK", "BMnet (research)"];
const comparison: { row: string; cells: Cell[] }[] = [
  { row: "Shows a range for each person", cells: ["yes", "no", "no", "no", "no"] },
  { row: "Range checked for each group", cells: ["yes", "no", "no", "no", "no"] },
  { row: "Open and testable by others", cells: ["yes", "no", "no", "no", "yes"] },
  { row: "Built for home photos", cells: ["yes", "Not stated", "Not stated", "Not stated", "No (lab silhouettes)"] },
  { row: "Trained for less common body types", cells: ["yes", "Not stated", "Not stated", "Not stated", "partly"] },
  { row: "Works with a normal phone camera", cells: ["Yes (browser)", "Not stated", "No (depth sensor)", "yes", "—"] },
  { row: "Result used for targets and training", cells: ["Yes (full loop)", "partly", "partly", "No (clothing sizes)", "no"] },
];

function CellValue({ value, highlight }: { value: Cell; highlight: boolean }) {
  if (value === "yes")
    return (
      <span className={cn("inline-flex items-center gap-1.5", highlight ? "text-volt" : "text-fg")}>
        <Check className="h-4 w-4" aria-hidden /> Yes
      </span>
    );
  if (value === "no")
    return (
      <span className="inline-flex items-center gap-1.5 text-subtle">
        <X className="h-4 w-4" aria-hidden /> No
      </span>
    );
  if (value === "partly")
    return (
      <span className="inline-flex items-center gap-1.5 text-muted">
        <Minus className="h-4 w-4" aria-hidden /> Partly
      </span>
    );
  return <span className={cn(highlight ? "text-volt" : "text-muted")}>{value}</span>;
}

const models = [
  { code: "A", name: "Height, weight and sex only", proves: "Are photos worth using at all?" },
  { code: "B", name: "Standard photo model (like BMnet)", proves: "The normal starting point" },
  { code: "C", name: "All four new parts, with checked ranges", proves: "My full solution" },
];

const limits = [
  "Not a medical device. It makes no health diagnosis.",
  "Body fat comes from the RFM formula, not DXA scans of the same people: no public dataset has both phone photos and DXA.",
  "Accuracy for Sri Lankan users isn’t proven yet. A local study needs a new ethics approval, so it is future work.",
  "Forecasts are tested in simulation only, and safety thresholds stay candidates until a qualified reviewer signs them off.",
];

export function Research() {
  return (
    <section id="research" className="relative py-28 sm:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="03 / The research"
          title="A body check that tells you how sure it is."
          highlight={["sure"]}
          description="Photo body measurement already exists, but it does three things badly. My research adds four new parts (N1–N4) to a standard body-check pipeline, and each one is tested on its own."
        />

        {/* Gaps → new parts */}
        <Stagger className="mt-16 grid gap-5 lg:grid-cols-3" stagger={0.1}>
          {gaps.map((g) => (
            <motion.div key={g.code} variants={staggerItem}>
              <SpotlightCard className="h-full p-7">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-cyan">{g.code}</span>
                  <h3 className="font-display text-xl font-semibold tracking-tight">{g.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{g.problem}</p>
                <div className="mt-6 space-y-3">
                  {g.fixes.map((f) => (
                    <div key={f.code} className="rounded-2xl border border-volt/20 bg-volt/[0.04] p-4">
                      <p className="flex items-baseline gap-2.5">
                        <span className="font-mono text-xs text-volt">{f.code}</span>
                        <span className="font-medium text-fg">{f.title}</span>
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.body}</p>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </Stagger>

        {/* Research question */}
        <Reveal className="mt-5">
          <div className="glass rounded-3xl p-7 sm:p-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">Research question</p>
            <p className="mt-4 max-w-4xl font-display text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
              Can a body check from two phone photos be accurate on home-like photos, work fairly for different body
              types, and give each user a range that is correct about <span className="text-gradient">90% of the time</span>?
            </p>
            <ul className="mt-6 grid gap-3 text-sm text-muted md:grid-cols-3">
              <li><span className="mr-2 font-mono text-xs text-volt">RQ1</span>Do photos beat height, weight and sex alone?</li>
              <li><span className="mr-2 font-mono text-xs text-volt">RQ2</span>Do N1–N3 reduce error on home photos and for less common body types?</li>
              <li><span className="mr-2 font-mono text-xs text-volt">RQ3</span>Are the ranges right about 90% of the time in every group?</li>
            </ul>
          </div>
        </Reveal>

        {/* How the likely range works */}
        <div className="mt-24 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">How the likely range works</p>
            </Reveal>
            <ol className="mt-6 space-y-4">
              {rangeSteps.map((step, i) => (
                <Reveal key={step} delay={i * 0.06}>
                  <li className="flex gap-4">
                    <span className="mt-0.5 font-mono text-xs text-volt">0{i + 1}</span>
                    <p className="leading-relaxed text-muted">{step}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>

          <Reveal delay={0.1}>
            <SpotlightCard className="p-7 sm:p-9">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">Waist</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">Example values</p>
              </div>
              <p className="mt-3 font-display text-5xl font-semibold tracking-[-0.04em]">
                90<span className="ml-1 text-2xl text-volt">cm</span>
              </p>
              <p className="mt-1 text-sm text-muted">likely 86–94 cm</p>

              {/* range bar on an 80–100 cm scale */}
              <div className="relative mt-10 h-2 rounded-full bg-white/10" role="img" aria-label="Likely range 86 to 94 cm on a scale from 80 to 100 cm, with the estimate at 90 cm">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="absolute inset-y-0 left-[30%] w-[40%] origin-center rounded-full bg-gradient-to-r from-cyan to-volt"
                />
                <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-ink bg-volt shadow-[0_0_14px_rgba(200,255,61,0.7)]" />
              </div>
              <div className="mt-3 flex justify-between font-mono text-[11px] text-subtle">
                <span>80</span>
                <span className="text-muted">86</span>
                <span className="text-fg">90</span>
                <span className="text-muted">94</span>
                <span>100</span>
              </div>

              <div className="mt-8 border-t border-line pt-6">
                <p className="text-sm leading-relaxed text-muted">
                  <span className="text-fg">Carried through to body fat.</span> For a 175 cm man, that waist range means
                  about 23–27% body fat. Showing only &ldquo;25%&rdquo; would hide this, so the range flows on to body
                  fat and resting energy.
                </p>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>

        {/* Comparison */}
        <div className="mt-24">
          <Reveal>
            <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">How it compares</h3>
            <p className="mt-3 max-w-2xl text-muted">
              Phone photos can already estimate body fat better than common scales, but the best systems are private,
              and none of them shows you how sure it is.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 overflow-x-auto rounded-3xl border border-line bg-surface/60">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="p-4 font-mono text-[11px] font-normal uppercase tracking-[0.15em] text-subtle">
                      What matters
                    </th>
                    {products.map((p) => (
                      <th
                        key={p}
                        scope="col"
                        className={cn("p-4 font-display font-semibold", p === "FitCoach AI" ? "bg-volt/[0.06] text-volt" : "text-fg")}
                      >
                        {p}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((r) => (
                    <tr key={r.row} className="border-b border-line last:border-0">
                      <th scope="row" className="p-4 font-normal text-fg/90">
                        {r.row}
                      </th>
                      {r.cells.map((c, i) => {
                        const ours = products[i] === "FitCoach AI";
                        return (
                          <td key={i} className={cn("p-4", ours && "bg-volt/[0.06]")}>
                            <CellValue value={c} highlight={ours} />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 max-w-3xl text-xs leading-relaxed text-subtle">
              I don&apos;t claim higher accuracy than private apps, because their tests used private data. Each cell is my
              reading of the product&apos;s public description; &ldquo;Not stated&rdquo; means the product doesn&apos;t say.
            </p>
          </Reveal>
        </div>

        {/* Proof + limits */}
        <div className="mt-24 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <SpotlightCard className="h-full p-7 sm:p-9">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">How I&apos;ll prove it</p>
              <p className="mt-4 leading-relaxed text-muted">
                Trained on <span className="text-fg">BodyM</span>, a public dataset of 8,978 front and side silhouettes
                from 2,505 people, plus computer-generated 3D bodies. Three models are compared, and the final test sets
                are used only once, at the very end.
              </p>
              <ul className="mt-6 space-y-3">
                {models.map((m) => (
                  <li key={m.code} className="flex gap-4 rounded-2xl border border-line bg-white/[0.02] p-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line font-mono text-xs text-volt">
                      {m.code}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-fg">{m.name}</p>
                      <p className="text-sm text-muted">{m.proves}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-relaxed text-muted">
                If a new part doesn&apos;t help, I&apos;ll report it as a negative result. That is still a valid finding.
              </p>
            </SpotlightCard>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-3xl border border-line bg-white/[0.02] p-7 sm:p-9">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">What it can&apos;t prove (yet)</p>
              <ul className="mt-6 space-y-4">
                {limits.map((l) => (
                  <li key={l} className="flex gap-3">
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden />
                    <p className="text-sm leading-relaxed text-muted">{l}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
