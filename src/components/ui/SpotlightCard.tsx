"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

/** Glass card with a soft light that follows the cursor and a glowing border. */
export function SpotlightCard({
  children,
  className,
  glow = "rgba(200,255,61,0.12)",
}: {
  children: React.ReactNode;
  className?: string;
  glow?: string;
}) {
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const bg = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, ${glow}, transparent 70%)`;
  const border = useMotionTemplate`radial-gradient(260px circle at ${mx}px ${my}px, rgba(200,255,61,0.55), transparent 70%)`;

  return (
    <div
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      onPointerLeave={() => {
        mx.set(-400);
        my.set(-400);
      }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-line bg-surface/85 pointer-fine:bg-surface/60 pointer-fine:backdrop-blur-xl",
        className,
      )}
    >
      {/* border glow (masked to the 1px edge) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: border,
          padding: 1,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: bg }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
