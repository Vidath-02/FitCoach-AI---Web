"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";
type Size = "md" | "lg";

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> {
  variant?: Variant;
  size?: Size;
  /** Subtle pull towards the cursor. */
  magnetic?: boolean;
  icon?: React.ReactNode;
  iconLeft?: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-volt text-ink shadow-[0_0_0_1px_rgba(200,255,61,0.4),0_10px_40px_-10px_rgba(200,255,61,0.6)] hover:shadow-[0_0_0_1px_rgba(200,255,61,0.7),0_16px_60px_-12px_rgba(200,255,61,0.85)]",
  ghost: "glass text-fg hover:bg-white/[0.07] hover:border-line-strong",
  outline: "border border-line-strong text-fg hover:border-volt/60 hover:text-volt",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-14 px-7 text-[15px] gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", magnetic = false, icon, iconLeft, className, children, ...props },
  forwarded,
) {
  const local = useRef<HTMLButtonElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 15, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 220, damping: 15, mass: 0.3 });

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!magnetic || e.pointerType !== "mouse" || !local.current) return;
    const r = local.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={(node) => {
        local.current = node;
        if (typeof forwarded === "function") forwarded(node);
        else if (forwarded) forwarded.current = node;
      }}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.96 }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={cn(
        "group relative inline-flex select-none items-center justify-center overflow-hidden rounded-full font-medium tracking-tight",
        "transition-[background-color,border-color,color,box-shadow] duration-300 ease-out",
        "disabled:pointer-events-none disabled:opacity-40",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {variant === "primary" && (
        <span
          aria-hidden
          className="animate-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        />
      )}
      {iconLeft && (
        <span className="relative transition-transform duration-300 group-hover:-translate-x-0.5">{iconLeft}</span>
      )}
      <span className="relative">{children}</span>
      {icon && (
        <span className="relative transition-transform duration-300 group-hover:translate-x-1">{icon}</span>
      )}
    </motion.button>
  );
});
