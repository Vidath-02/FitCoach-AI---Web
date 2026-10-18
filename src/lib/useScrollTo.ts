"use client";

import { useLenis } from "lenis/react";
import { useCallback } from "react";

const NAV_OFFSET = -72;

/** Smoothly scrolls to a section id, using Lenis when it's active. */
export function useScrollTo() {
  const lenis = useLenis();

  return useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (lenis) {
        lenis.scrollTo(el, { offset: NAV_OFFSET, duration: 1.6 });
      } else {
        const top = el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET;
        window.scrollTo({ top, behavior: "smooth" });
      }
      history.replaceState(null, "", `#${id}`);
    },
    [lenis],
  );
}
