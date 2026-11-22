import { useEffect, useRef, useState } from "react";

const HIDE_FROM_Y = 80;
const SCROLLED_FROM_Y = 8;
const IGNORED_DELTA = 6;
const COLLAPSIBLE_QUERY = "(max-width: 1279px) and (prefers-reduced-motion: no-preference)";

interface HeaderVisibility {
  hidden: boolean;
  scrolled: boolean;
}

export default function useHeaderVisibility(paused: boolean): HeaderVisibility {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    if (paused) setHidden(false);
  }, [paused]);

  useEffect(() => {
    const collapsible = window.matchMedia(COLLAPSIBLE_QUERY);
    let lastY = window.scrollY;
    setScrolled(lastY > SCROLLED_FROM_Y);

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > SCROLLED_FROM_Y);
      if (!collapsible.matches || pausedRef.current || y < HIDE_FROM_Y) {
        setHidden(false);
        lastY = y;
        return;
      }
      const delta = y - lastY;
      if (Math.abs(delta) < IGNORED_DELTA) return;
      setHidden(delta > 0);
      lastY = y;
    };
    const onMediaChange = () => !collapsible.matches && setHidden(false);

    window.addEventListener("scroll", onScroll, { passive: true });
    collapsible.addEventListener("change", onMediaChange);
    return () => {
      window.removeEventListener("scroll", onScroll);
      collapsible.removeEventListener("change", onMediaChange);
    };
  }, []);

  return { hidden, scrolled };
}
