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
              <ul className="mt-2">
                {nav.map((n) => (
                  <li key={n.id}>
                    <button onClick={() => scrollTo(n.id)} className="inline-flex min-h-11 items-center text-muted transition-colors hover:text-fg">
                      {n.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">Project</p>
              <ul className="mt-2">
                <li>
                  <a
                    href="https://github.com/Vidath-02/FitCoach-AI---Web"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center gap-1 text-muted transition-colors hover:text-fg"
                  >
                    Source <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </li>
                <li>
                  <button onClick={() => scrollTo("survey")} className="inline-flex min-h-11 items-center text-muted transition-colors hover:text-fg">
                    Join early access
                  </button>
                </li>
                <li>
                  <Link href="/privacy" className="inline-flex min-h-11 items-center text-muted transition-colors hover:text-fg">
                    Privacy notice
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Oversized outlined wordmark */}
      {/* SVG so the word always spans the full width exactly, at any screen size */}
      <div aria-hidden className="pointer-events-none select-none px-4 sm:px-6">
        <svg viewBox="0 0 1000 128" className="block w-full" preserveAspectRatio="xMidYMin meet">
          <text
            x="500"
            y="160"
            textAnchor="middle"
            textLength="990"
            lengthAdjust="spacingAndGlyphs"
            className="font-display"
            fontSize="172"
            fontWeight="700"
            fill="none"
            stroke="rgba(255,255,255,0.13)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          >
            FITCOACH AI
          </text>
        </svg>
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
