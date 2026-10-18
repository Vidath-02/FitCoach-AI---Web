const words = [
  "Computer vision",
  "Body measurement",
  "Progress tracking",
  "Posture insight",
  "Personalised plans",
  "Privacy first",
  "Built with you",
];

export function KeywordMarquee() {
  return (
    <div aria-hidden className="mask-fade-x relative overflow-hidden border-y border-line bg-ink-2/60 py-6">
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap hover:[animation-play-state:paused]">
        {[...words, ...words].map((w, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-2xl font-medium tracking-tight sm:text-3xl">
            <span className={i % 2 ? "text-outline" : "text-fg/80"}>{w}</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-volt" fill="currentColor">
              <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
