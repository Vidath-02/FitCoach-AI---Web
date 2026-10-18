import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-8 w-8", className)} aria-hidden>
      <rect width="32" height="32" rx="9" className="fill-volt" />
      <path
        d="M8 12V8h4M20 8h4v4M24 20v4h-4M12 24H8v-4"
        fill="none"
        stroke="#050608"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="11.5" r="2.2" fill="#050608" />
      <path
        d="M12 15.5l4 2 4-2M16 17.5v4l-2.5 3M16 21.5l2.5 3"
        fill="none"
        stroke="#050608"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-display text-[17px] font-semibold tracking-tight">
        FitCoach<span className="text-volt"> AI</span>
      </span>
    </span>
  );
}
