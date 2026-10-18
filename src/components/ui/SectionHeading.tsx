import { cn } from "@/lib/utils";
import { Reveal, SplitText } from "./Reveal";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-volt shadow-[0_0_10px_var(--color-volt)]" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  highlight?: string[];
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl">
        <SplitText text={title} highlight={highlight} />
      </h2>
      {description && (
        <Reveal delay={0.15}>
          <p
            className={cn(
              "mt-6 max-w-2xl text-base leading-relaxed text-muted text-pretty sm:text-lg",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
