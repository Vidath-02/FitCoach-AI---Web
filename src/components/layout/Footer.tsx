"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { creator, nav, site } from "@/lib/site";
import { useScrollTo } from "@/lib/useScrollTo";

export function Footer() {
  const scrollTo = useScrollTo();

  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-20">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-muted">
              An AI-powered platform for computer-vision body measurement and fitness tracking. An individual
              final-year project by {creator.name}.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 text-sm">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">Explore</p>
              <ul className="mt-4 space-y-3">
                {nav.map((n) => (
                  <li key={n.id}>
                    <button onClick={() => scrollTo(n.id)} className="text-muted transition-colors hover:text-fg">
                      {n.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">Project</p>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href="https://github.com/Vidath-02/FitCoach-AI---Web"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-muted transition-colors hover:text-fg"
                  >
                    Source <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </li>
                <li>
                  <button onClick={() => scrollTo("survey")} className="text-muted transition-colors hover:text-fg">
                    Join early access
                  </button>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted transition-colors hover:text-fg">
                    Privacy notice
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Oversized outlined wordmark */}
      <div aria-hidden className="pointer-events-none select-none px-4">
        <p className="text-outline -mb-[0.22em] whitespace-nowrap text-center font-display text-[19vw] font-bold leading-none tracking-[-0.06em]">
          FITCOACH AI
        </p>
      </div>

      <div className="relative border-t border-line bg-ink/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-subtle sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name} · Built by {creator.name}</p>
          <p className="font-mono uppercase tracking-[0.18em]">Pre-launch · v0.1</p>
        </div>
      </div>
    </footer>
  );
}
