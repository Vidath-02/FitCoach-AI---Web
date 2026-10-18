"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

function diff(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    minutes: Math.floor((ms / 60_000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

function Unit({ value, label }: { value: number | null; label: string }) {
  const text = value === null ? "--" : String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[1.1em] overflow-hidden font-display text-4xl font-semibold tabular-nums tracking-tight sm:text-5xl">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="block"
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-subtle">{label}</span>
    </div>
  );
}

export function Countdown({ target }: { target: Date }) {
  // Rendered client-side only to avoid server/client time mismatches.
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-6">
      <Unit value={t?.days ?? null} label="Days" />
      <Unit value={t?.hours ?? null} label="Hours" />
      <Unit value={t?.minutes ?? null} label="Mins" />
      <Unit value={t?.seconds ?? null} label="Secs" />
    </div>
  );
}
