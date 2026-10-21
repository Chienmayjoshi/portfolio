"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, useMotionValue, useReducedMotion } from "motion/react";

// The auto-advancing "pointer" loop shared by the UltraAI selector slides
// (Rejected / Shipped direction via DirectionSlide, and the Illustration System
// slide): one point is active, its progress bar runs 0 -> 1 over `seconds`,
// then the next point takes over, wrapping after the last.
//
// The bar is a MotionValue driven by one imperative `animate()` so it can be
// PAUSED and RESUMED mid-run — the declarative `animate` prop it replaced
// could only restart. `hover` handlers pause it while the pointer is over the
// list of points or over the visual they control (a counter, so crossing from
// one to the other doesn't blip the loop on), and releasing resumes from the
// same spot. A click (`select`) restarts the clicked point's bar; if the
// pointer is still over the slide, that new bar waits until it leaves.
//
// Runs only while `active` (the deck's current slide) and not under
// prefers-reduced-motion, where the bar is simply held full on the active
// point and nothing advances on its own.
export function useProgressLoop({
  count,
  seconds,
  active,
}: {
  count: number;
  seconds: number;
  active: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [run, setRun] = useState(0);
  const reduceMotion = useReducedMotion();
  const progress = useMotionValue(0);
  const controls = useRef<ReturnType<typeof animate> | null>(null);
  const hovering = useRef(0);

  // Entering the slide starts the loop from the first point.
  useEffect(() => {
    if (!active) return;
    setIndex(0);
    setRun((r) => r + 1);
  }, [active]);

  useEffect(() => {
    if (!active || reduceMotion) {
      progress.set(1);
      return;
    }
    progress.set(0);
    const c = animate(progress, 1, {
      duration: seconds,
      ease: "linear",
      onComplete: () => {
        setIndex((cur) => (cur + 1) % count);
        setRun((r) => r + 1);
      },
    });
    if (hovering.current > 0) c.pause();
    controls.current = c;
    return () => {
      c.stop();
      if (controls.current === c) controls.current = null;
    };
  }, [index, run, active, reduceMotion, seconds, count, progress]);

  const select = useCallback((i: number) => {
    setIndex(i);
    setRun((r) => r + 1);
  }, []);

  const hover = {
    onMouseEnter: () => {
      hovering.current += 1;
      controls.current?.pause();
    },
    onMouseLeave: () => {
      hovering.current = Math.max(0, hovering.current - 1);
      if (hovering.current === 0) controls.current?.play();
    },
  };

  return { index, run, progress, select, hover };
}
