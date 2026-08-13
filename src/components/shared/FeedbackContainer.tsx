"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";

// Not sourced from Figma — see CaseStudyFeedback.tsx for the feature's
// provenance note. Replaces an earlier `<motion.div layout>` wrapper that
// visibly stretched its children (the CTA buttons) whenever a much taller
// subtree swapped in — Motion's `layout` prop animates size via a
// transform-based FLIP/scale correction, and that scale is inherited by
// every descendant, distorting anything with real text/controls inside.
//
// This wrapper instead measures the actual rendered content height via
// ResizeObserver and animates a plain numeric `height` — a genuine
// CSS-property animation the browser reflows each frame, never touching
// `transform`, so the scale-distortion class of bug is structurally
// impossible here (nothing in this tree carries `layout`/`layoutId`).
// `overflow-hidden` clips content during the resize itself.
//
// `height` starts at "auto" so first paint never animates (the observer's
// first callback just confirms the already-rendered height); every stage
// swap after that animates from a real previous pixel value to a real new
// one. Reused for both the collapsed/expanded/submitted swap in
// CaseStudyFeedback.tsx and the wizard's own step-to-step height in
// FeedbackWizard.tsx — one mechanism, not two.
export default function FeedbackContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <motion.div
      animate={{ height }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden w-full"
    >
      <div ref={contentRef}>{children}</div>
    </motion.div>
  );
}
