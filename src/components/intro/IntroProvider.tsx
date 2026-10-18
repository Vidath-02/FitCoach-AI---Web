"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { INTRO_SEEN_KEY } from "@/lib/intro";

interface IntroState {
  /** True once the hero may start its entrance (intro finished, skipped or never shown). */
  done: boolean;
  /** True while the overlay should be mounted. */
  active: boolean;
  finish: () => void;
  unmount: () => void;
}

const IntroContext = createContext<IntroState>({ done: true, active: false, finish: () => {}, unmount: () => {} });

export function IntroProvider({ children }: { children: React.ReactNode }) {
  // Server render assumes the intro plays; the client corrects this on mount.
  const [done, setDone] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (document.documentElement.classList.contains("intro-skip")) {
      setActive(false);
      setDone(true);
      return;
    }
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      /* storage blocked: the intro simply plays again next time */
    }
  }, []);

  const finish = useCallback(() => setDone(true), []);
  const unmount = useCallback(() => setActive(false), []);

  return <IntroContext.Provider value={{ done, active, finish, unmount }}>{children}</IntroContext.Provider>;
}

export const useIntro = () => useContext(IntroContext);
