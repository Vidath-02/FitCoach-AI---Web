"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useId } from "react";
import { cn } from "@/lib/utils";
import type { Interest } from "./types";
import type { Option } from "./options";

const spring = { type: "spring", stiffness: 420, damping: 30 } as const;

/* ------------------------------------------------------------------ */
/*  Question wrapper                                                   */
/* ------------------------------------------------------------------ */
export function Question({
  title,
  hint,
  optional,
  children,
  className,
}: {
  title: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={cn("min-w-0", className)}>
      <legend className="flex w-full flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-display text-lg font-semibold tracking-tight sm:text-xl">{title}</span>
        {optional && (
          <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-subtle">
            Optional
          </span>
        )}
      </legend>
      {hint && <p className="mt-1.5 text-sm text-muted">{hint}</p>}
      <div className="mt-5">{children}</div>
    </fieldset>
  );
}

/* ------------------------------------------------------------------ */
/*  Option cards: single or multi select                                */
/* ------------------------------------------------------------------ */
function CheckBadge({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors duration-300",
        on ? "border-volt bg-volt text-ink" : "border-line-strong",
      )}
    >
      <AnimatePresence>
        {on && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring}>
            <Check className="h-3 w-3" strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export function OptionCards({
  options,
  value,
  onChange,
  multiple = false,
  columns = 2,
  size = "md",
  label,
}: {
  options: Option[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
  multiple?: boolean;
  columns?: 2 | 3 | 4;
  size?: "sm" | "md";
  label?: string;
}) {
  const selected = (v: string) => (Array.isArray(value) ? value.includes(v) : value === v);
  const toggle = (v: string) => {
    if (multiple) {
      const arr = Array.isArray(value) ? value : [];
      onChange(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
    } else {
      onChange(v);
    }
  };

  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "grid-cols-2 sm:grid-cols-4" }[columns];

  return (
    <div role={multiple ? "group" : "radiogroup"} aria-label={label} className={cn("grid gap-3", cols)}>
      {options.map((o) => {
        const on = selected(o.value);
        const Icon = o.icon;
        return (
          <motion.button
            key={o.value}
            type="button"
            role={multiple ? "checkbox" : "radio"}
            aria-checked={on}
            onClick={() => toggle(o.value)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={spring}
            className={cn(
              "group relative flex items-center gap-4 overflow-hidden rounded-2xl border text-left transition-[background-color,border-color,box-shadow] duration-300",
              size === "sm" ? "px-4 py-3.5" : "px-5 py-4",
              on
                ? "border-volt/70 bg-volt/[0.07] shadow-[0_0_0_1px_rgba(200,255,61,0.25),0_10px_40px_-20px_rgba(200,255,61,0.6)]"
                : "border-line bg-white/[0.025] hover:border-line-strong hover:bg-white/[0.045]",
            )}
          >
            {on && (
              <motion.span
                aria-hidden
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-volt/20 blur-2xl"
              />
            )}
            {Icon && (
              <span
                className={cn(
                  "relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-colors duration-300",
                  on ? "border-volt/40 bg-volt/15 text-volt" : "border-line bg-white/[0.03] text-muted group-hover:text-fg",
                )}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </span>
            )}
            {o.emoji && <span className="relative text-2xl leading-none">{o.emoji}</span>}
            <span className="relative min-w-0 flex-1">
              <span className={cn("block font-medium", size === "sm" ? "text-sm" : "text-[15px]", on ? "text-fg" : "text-fg/90")}>
                {o.label}
              </span>
              {o.description && <span className="mt-0.5 block text-xs text-muted sm:text-[13px]">{o.description}</span>}
            </span>
            <span className="relative">
              <CheckBadge on={on} />
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Chips: compact multi-select                                         */
/* ------------------------------------------------------------------ */
export function Chips({
  options,
  value,
  onChange,
  exclusive,
  label,
}: {
  options: Option[];
  value: string[];
  onChange: (v: string[]) => void;
  /** A value that clears everything else when chosen (e.g. "none"). */
  exclusive?: string;
  label?: string;
}) {
  const toggle = (v: string) => {
    if (value.includes(v)) return onChange(value.filter((x) => x !== v));
    if (v === exclusive) return onChange([v]);
    onChange([...value.filter((x) => x !== exclusive), v]);
  };

  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2.5">
      {options.map((o) => {
        const on = value.includes(o.value);
        const Icon = o.icon;
        return (
          <motion.button
            key={o.value}
            type="button"
            role="checkbox"
            aria-checked={on}
            onClick={() => toggle(o.value)}
            whileTap={{ scale: 0.95 }}
            transition={spring}
            className={cn(
              "relative inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-300",
              on
                ? "border-volt bg-volt text-ink shadow-[0_8px_30px_-12px_rgba(200,255,61,0.9)]"
                : "border-line bg-white/[0.03] text-fg/85 hover:border-line-strong hover:text-fg",
            )}
          >
            <AnimatePresence initial={false}>
              {on ? (
                <motion.span
                  key="c"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </motion.span>
              ) : (
                Icon && (
                  <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, width: 0 }}>
                    <Icon className="h-4 w-4 text-muted" />
                  </motion.span>
                )
              )}
            </AnimatePresence>
            {o.label}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Range slider                                                       */
/* ------------------------------------------------------------------ */
export function RangeSlider({
  value,
  onChange,
  min,
  max,
  step = 1,
  format,
  ticks,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  format: (v: number) => React.ReactNode;
  ticks?: [string, string] | [string, string, string];
  label: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const id = useId();

  return (
    <div className="rounded-2xl border border-line bg-white/[0.025] p-5 sm:p-6">
      <div className="flex items-end justify-between gap-4">
        <motion.output
          key={String(format(value))}
          htmlFor={id}
          initial={{ y: 6, opacity: 0.4 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="font-display text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl"
        >
          {format(value)}
        </motion.output>
      </div>
      <div className="relative mt-4">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/[0.07]" />
        <div
          className="pointer-events-none absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan to-volt shadow-[0_0_20px_rgba(200,255,61,0.45)]"
          style={{ width: `calc(${pct}% + ${(0.5 - pct / 100) * 26}px)` }}
        />
        <input
          id={id}
          type="range"
          aria-label={label}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="range relative"
        />
      </div>
      {ticks && (
        <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-subtle">
          {ticks.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Emoji rating scale                                                 */
/* ------------------------------------------------------------------ */
export function EmojiScale({
  options,
  value,
  onChange,
  label,
}: {
  options: Option[];
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-5 gap-2 sm:gap-3">
      {options.map((o) => {
        const n = Number(o.value);
        const on = value === n;
        return (
          <motion.button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(n)}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.94 }}
            transition={spring}
            className={cn(
              "relative flex flex-col items-center gap-2 rounded-2xl border px-1 py-4 transition-colors duration-300 sm:py-5",
              on ? "border-volt/70 bg-volt/[0.08]" : "border-line bg-white/[0.025] hover:border-line-strong",
            )}
          >
            <motion.span
              animate={{ scale: on ? 1.3 : value && !on ? 0.9 : 1, filter: value && !on ? "grayscale(0.8)" : "grayscale(0)" }}
              transition={spring}
              className="text-3xl leading-none sm:text-4xl"
            >
              {o.emoji}
            </motion.span>
            <span className={cn("text-center text-[11px] leading-tight sm:text-xs", on ? "text-volt" : "text-muted")}>
              {o.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Segmented control (per-feature interest)                           */
/* ------------------------------------------------------------------ */
const interestLabels: { v: Interest; label: string }[] = [
  { v: 0, label: "Skip" },
  { v: 1, label: "Nice" },
  { v: 2, label: "Must-have" },
];

export function FeatureRating({
  option,
  value,
  onChange,
}: {
  option: Option;
  value: Interest | undefined;
  onChange: (v: Interest) => void;
}) {
  const Icon = option.icon;
  const id = useId();
  const must = value === 2;
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border p-4 transition-colors duration-300 sm:flex-row sm:items-center",
        must ? "border-volt/50 bg-volt/[0.05]" : "border-line bg-white/[0.025]",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        {Icon && (
          <span
            className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-colors",
              must ? "border-volt/40 bg-volt/15 text-volt" : "border-line bg-white/[0.03] text-muted",
            )}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </span>
        )}
        <div className="min-w-0">
          <p className="text-[15px] font-medium">{option.label}</p>
          {option.description && <p className="text-xs text-muted">{option.description}</p>}
        </div>
      </div>
      <div role="radiogroup" aria-label={option.label} className="relative grid grid-cols-3 rounded-full border border-line bg-ink/60 p-1">
        {interestLabels.map((l) => {
          const on = value === l.v;
          return (
            <button
              key={l.v}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(l.v)}
              className={cn(
                "relative z-10 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-300 sm:px-3.5",
                on ? (l.v === 2 ? "text-ink" : "text-fg") : "text-muted hover:text-fg",
              )}
            >
              {on && (
                <motion.span
                  layoutId={`seg-${id}`}
                  transition={spring}
                  className={cn("absolute inset-0 -z-10 rounded-full", l.v === 2 ? "bg-volt" : l.v === 1 ? "bg-white/[0.12]" : "bg-white/[0.06]")}
                />
              )}
              {l.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Toggle switch                                                      */
/* ------------------------------------------------------------------ */
export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-colors duration-300",
        checked ? "border-volt/50 bg-volt/[0.05]" : "border-line bg-white/[0.025] hover:border-line-strong",
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium">{label}</span>
        {description && <span className="mt-0.5 block text-[13px] text-muted">{description}</span>}
      </span>
      <span
        className={cn(
          "relative flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors duration-300",
          checked ? "justify-end bg-volt" : "justify-start bg-white/[0.1]",
        )}
      >
        <motion.span layout transition={spring} className={cn("h-5 w-5 rounded-full shadow-md", checked ? "bg-ink" : "bg-fg/80")} />
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Text inputs                                                        */
/* ------------------------------------------------------------------ */
export function TextField({
  value,
  onChange,
  placeholder,
  type = "text",
  label,
  autoComplete,
  invalid,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "email";
  label: string;
  autoComplete?: string;
  invalid?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      aria-label={label}
      aria-invalid={invalid || undefined}
      autoComplete={autoComplete}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-14 w-full rounded-2xl border bg-white/[0.025] px-5 text-[15px] text-fg placeholder:text-subtle",
        "outline-none transition-[border-color,box-shadow,background-color] duration-300",
        "focus:border-volt/60 focus:bg-white/[0.04] focus:shadow-[0_0_0_4px_rgba(200,255,61,0.08)]",
        invalid ? "border-danger/60" : "border-line hover:border-line-strong",
      )}
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  label,
  max = 600,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label: string;
  max?: number;
  rows?: number;
}) {
  return (
    <div className="relative">
      <textarea
        value={value}
        rows={rows}
        maxLength={max}
        aria-label={label}
        placeholder={placeholder}
        data-lenis-prevent
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full resize-none rounded-2xl border border-line bg-white/[0.025] px-5 py-4 pb-8 text-[15px] leading-relaxed text-fg placeholder:text-subtle",
          "outline-none transition-[border-color,box-shadow,background-color] duration-300 hover:border-line-strong",
          "focus:border-volt/60 focus:bg-white/[0.04] focus:shadow-[0_0_0_4px_rgba(200,255,61,0.08)]",
        )}
      />
      <span className="pointer-events-none absolute bottom-3 right-4 font-mono text-[10px] tabular-nums text-subtle">
        {value.length}/{max}
      </span>
    </div>
  );
}

export function Checkbox({
  checked,
  onChange,
  children,
  invalid,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
  invalid?: boolean;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-start gap-3.5 rounded-2xl border px-5 py-4 text-left transition-colors duration-300",
        checked ? "border-volt/50 bg-volt/[0.05]" : invalid ? "border-danger/50 bg-danger/[0.04]" : "border-line bg-white/[0.025] hover:border-line-strong",
      )}
    >
      <span className="mt-0.5">
        <CheckBadge on={checked} />
      </span>
      <span className="text-sm leading-relaxed text-fg/90">{children}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Follow-up question that slides in when `show` is true              */
/* ------------------------------------------------------------------ */
export function FollowUp({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div className="border-l-2 border-volt/30 pl-5 pt-1">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Number scale (e.g. 0 to 10 likelihood)                             */
/* ------------------------------------------------------------------ */
export function NumberScale({
  value,
  onChange,
  min = 0,
  max = 10,
  lowLabel,
  highLabel,
  label,
}: {
  value: number | null;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  lowLabel: string;
  highLabel: string;
  label: string;
}) {
  const nums = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <div>
      <div role="radiogroup" aria-label={label} className="grid grid-cols-6 gap-2 sm:grid-cols-11">
        {nums.map((n) => {
          const on = value === n;
          return (
            <motion.button
              key={n}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(n)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.92 }}
              transition={spring}
              className={cn(
                "h-12 rounded-xl border font-mono text-sm tabular-nums transition-colors duration-300",
                on
                  ? "border-volt bg-volt font-semibold text-ink shadow-[0_8px_30px_-12px_rgba(200,255,61,0.9)]"
                  : "border-line bg-white/[0.025] text-fg/85 hover:border-line-strong hover:text-fg",
              )}
            >
              {n}
            </motion.button>
          );
        })}
      </div>
      <div className="mt-2.5 flex justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-subtle">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
