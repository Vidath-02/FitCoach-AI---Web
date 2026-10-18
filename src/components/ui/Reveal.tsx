"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

/** Fades + lifts its children into view once, as they scroll in. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "span" | "p";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 1, ease, delay }}
    >
      {children}
    </Comp>
  );
}

const container: Variants = {
  hidden: {},
  show: (stagger: number = 0.08) => ({ transition: { staggerChildren: stagger } }),
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease }, transitionEnd: { filter: "none" } },
};

/** Parent that staggers any `motion` children using `staggerItem`. */
export function Stagger({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={cn(className)}
      variants={container}
      custom={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
    >
      {children}
    </motion.div>
  );
}

/** Word-by-word headline reveal with a masked slide-up. */
export function SplitText({
  text,
  className,
  wordClassName,
  delay = 0,
  highlight = [],
  highlightClassName = "text-gradient",
  animateOnMount = false,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  /** Words (case-insensitive, punctuation ignored) that get the highlight style. */
  highlight?: string[];
  highlightClassName?: string;
  animateOnMount?: boolean;
}) {
  const words = text.split(" ");
  const hl = highlight.map((w) => w.toLowerCase());
  const trigger = animateOnMount
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: { once: true, margin: "-10% 0px" } };

  return (
    <motion.span
      className={cn("inline", className)}
      initial="hidden"
      {...trigger}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, i) => {
        const isHl = hl.includes(word.toLowerCase().replace(/[^a-z0-9]/g, ""));
        return (
          <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className={cn("inline-block", wordClassName, isHl && highlightClassName)}
              variants={{
                hidden: { y: "110%", rotate: 4, opacity: 0 },
                show: { y: "0%", rotate: 0, opacity: 1, transition: { duration: 1.1, ease } },
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 && " "}
          </span>
        );
      })}
    </motion.span>
  );
}
