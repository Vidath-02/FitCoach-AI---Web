"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

/** Same footprint as the survey card, so nothing jumps when the real one arrives. */
function Placeholder() {
  return <div aria-hidden className="min-h-[640px] rounded-[2rem] border border-line bg-surface/70" />;
}

const Survey = dynamic(() => import("./Survey").then((m) => m.Survey), { ssr: false, loading: Placeholder });

/**
 * The survey is the last section and the largest chunk of page code, so it's kept out of
 * the first download and fetched when the visitor scrolls within ~1.5 screens of it
 * (or lands on #survey directly).
 */
export function LazySurvey() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (location.hash === "#survey") {
      setShow(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setShow(true);
        io.disconnect();
      },
      { rootMargin: "150% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref}>{show ? <Survey /> : <Placeholder />}</div>;
}
