"use client";

import { useEffect, useRef, useState } from "react";

// Headline with an optional marked phrase: a green highlighter across the lower
// half of the words and a blue squiggle under them (Figma node 8168:47725).
// Sized in em so it holds at the 32px mobile and 48px desktop titles. The
// squiggle is a one-period SVG used as a repeating mask, so it takes the accent
// colour (and its dark-mode value) from the token instead of a fixed fill.
const SQUIGGLE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='8' viewBox='0 0 26 8'%3E%3Cpath d='M0 4C4.3 -.5 8.7 -.5 13 4S21.7 8.5 26 4' fill='none' stroke='black' stroke-width='2'/%3E%3C/svg%3E\")";

// The marks draw in left to right the first time the slide is entered, then
// stay. The delays are deliberate: the deck flips `active` at the midpoint of
// the dissolve, so a wipe that starts immediately is half over before the slide
// is fully visible. The marker starts at 0.5s and the squiggle follows at 0.9s. `active` comes from the pointer deck (the slide in view). The touch
// stack passes nothing, so there an IntersectionObserver stands in; on the
// pointer deck it is skipped, because every slide is mounted and stacked and it
// would fire for all of them at once. Reduced motion shows the marks drawn.
export default function HighlightedHeadline({
  text,
  highlight,
  active,
}: {
  text: string;
  highlight?: string;
  active?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [drawn, setDrawn] = useState(false);

  // Adjusting state during render is React's sanctioned way to derive it from
  // a prop; an effect would add a frame before the marks start drawing.
  if (active && !drawn) setDrawn(true);

  useEffect(() => {
    const el = ref.current;
    if (active !== undefined || drawn || !el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [active, drawn]);

  const at = highlight ? text.indexOf(highlight) : -1;
  if (!highlight || at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span ref={ref} className="relative isolate inline-block">
        <span
          aria-hidden="true"
          className="-z-10 absolute inset-x-0 bottom-[0.08em] h-[0.5em] rounded-[8px] bg-[var(--color-title-highlight)] transition-[clip-path] delay-500 duration-[800ms] ease-out motion-reduce:transition-none"
          style={{
            clipPath: drawn ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
          }}
        />
        {highlight}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-[-0.14em] h-[8px] bg-text-accent transition-[clip-path] delay-[900ms] duration-[800ms] ease-out motion-reduce:transition-none"
          style={{
            maskImage: SQUIGGLE,
            WebkitMaskImage: SQUIGGLE,
            maskRepeat: "repeat-x",
            WebkitMaskRepeat: "repeat-x",
            clipPath: drawn ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
          }}
        />
      </span>
      {text.slice(at + highlight.length)}
    </>
  );
}

