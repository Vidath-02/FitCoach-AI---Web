"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { nav } from "@/lib/site";
import { useScrollTo } from "@/lib/useScrollTo";
import { useIntro } from "@/components/intro/IntroProvider";
import { cn } from "@/lib/utils";

export function Navbar() {
  const scrollTo = useScrollTo();
  const { done: introDone } = useIntro();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    // Back in the hero: no section is active.
    if (y < window.innerHeight * 0.5) setActive("");
    setHidden(y > 600 && y > prev + 4 && !open);
    if (y < prev - 4) setHidden(false);
  });

  // Highlight the section currently in view.
  useEffect(() => {
    const els = nav.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollTo(id);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden || !introDone ? -100 : 0, opacity: introDone ? 1 : 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: introDone && !scrolled ? 0.35 : 0 }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6"
      >
        <nav
          className={cn(
            "mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full px-3 pl-5 transition-all duration-500",
            scrolled ? "glass shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)]" : "border border-transparent",
          )}
        >
          <button onClick={() => go("top")} aria-label="Back to top" className="rounded-full">
            <Logo />
          </button>

          <ul className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => go(item.id)}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm transition-colors duration-300",
                    active === item.id ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-white/[0.07]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Button
              size="md"
              className="hidden h-10 sm:inline-flex"
              icon={<ArrowRight className="h-4 w-4" />}
              onClick={() => go("survey")}
            >
              Take the survey
            </Button>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-fg md:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-ink/90 backdrop-blur-2xl md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.ul
              className="flex h-full flex-col justify-center gap-2 px-8"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
            >
              {nav.map((item, i) => (
                <motion.li
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      go(item.id);
                    }}
                    className="flex w-full items-baseline gap-4 border-b border-line py-5 text-left font-display text-4xl font-semibold tracking-tight"
                  >
                    <span className="font-mono text-xs text-volt">0{i + 1}</span>
                    {item.label}
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
