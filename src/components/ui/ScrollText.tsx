"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

function Word({
  children,
  progress,
  range,
  highlight,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  highlight: boolean;
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <span className="relative mr-[0.25em] inline-block">
      <motion.span style={{ opacity, y }} className={cn("inline-block", highlight && "text-gradient")}>
        {children}
      </motion.span>
    </span>
  );
}

/** Paragraph whose words light up one by one as you scroll through it. */
export function ScrollText({
  text,
  className,
  highlight = [],
}: {
  text: string;
  className?: string;
  highlight?: string[];
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  const hl = highlight.map((w) => w.toLowerCase());

  return (
    <p ref={ref} className={cn("flex flex-wrap", className)}>
      {words.map((w, i) => (
        <Word
          key={i}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
          highlight={hl.includes(w.toLowerCase().replace(/[^a-z]/g, ""))}
        >
          {w}
        </Word>
      ))}
    </p>
  );
}
