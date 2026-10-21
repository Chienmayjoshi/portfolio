"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useProgressLoop } from "@/components/ultraai/useProgressLoop";
import GridDepthLayer from "@/components/shared/GridDepthLayer";
import ThemeAwareVideo from "@/components/shared/ThemeAwareVideo";
import PromptTemplateCard from "@/components/ultraai/PromptTemplateCard";
import ExpertIconBlocks from "@/components/ultraai/ExpertIconBlocks";

// "The illustration system" slide for the UltraAI deck — Figma desktop node
// 8079:113728 ("design system - scroll 11"), file 2aoIFdaJMyNBEWeQESBEzG. Rail
// tick: "illustration-system". No mobile frame was drawn.
//
// Left (600 wide, the list 580): accent eyebrow, headline (deck slide-title
// token), muted paragraph, three green thumbs-up points, then a semibold
// closing statement. Right: a 600x600 asset for the active point.
//
// The three points are a selector in the same family as the Rejected/Shipped
// direction slides: the active one carries a 2px progress bar (inactive bars
// keep their space at opacity 0, as in Figma), the bar finishing hands over to
// the next point and loops, and any point is a button that makes it active and
// restarts its bar. The loop runs only while this slide is the deck's active
// one and not under reduced motion (then it is click-only, the bar full). The
// active title takes the success tone, and hovering a point does too.
//
// POINT 1: `ua_ManyAItoolsonestyle_{light,dark}.mp4` (1328x1328, 72s), loaded
// only once the slide is, or is about to be, on screen. POINT 2: the tappable
// prompt-template card (PromptTemplateCard.tsx). POINT 3: the floating expert icon
// blocks (ExpertIconBlocks.tsx). `visual: null` is still supported — a point
// without an asset keeps showing the last one — but none uses it now.
//
// MOBILE (no frame, so smart): header, then the square asset at full width,
// then the points and the statement — the order the decision slides use. The
// selector and its progress bars stay live there.
//
// FADE: the light clip has its top and bottom fade baked into the export; the
// dark one does not, so `.ua-video-fade-dark` (globals.css) masks the slot's
// top and bottom 64px in dark mode only.
//
// Figma notes, flagged: point text is a one-off #1E2B14 (set as text-primary);
// the second point's title-to-description gap is 16 where the others are 8
// (set to 8). The video is ~3.3MB each; fine, but re-encode if it grows.
const THUMB_UP =
  "M22.4831 14.7188L21.3581 5.71875C21.2896 5.17489 21.0249 4.67475 20.6137 4.31224C20.2025 3.94974 19.6732 3.74981 19.125 3.75H3C2.60218 3.75 2.22064 3.90804 1.93934 4.18934C1.65804 4.47064 1.5 4.85218 1.5 5.25V13.5C1.5 13.8978 1.65804 14.2794 1.93934 14.5607C2.22064 14.842 2.60218 15 3 15H7.03687L10.5787 22.0856C10.6411 22.2102 10.7369 22.315 10.8555 22.3882C10.9741 22.4614 11.1107 22.5001 11.25 22.5C12.2446 22.5 13.1984 22.1049 13.9017 21.4017C14.6049 20.6984 15 19.7446 15 18.75V17.25H20.25C20.5693 17.2501 20.8849 17.1823 21.176 17.051C21.467 16.9197 21.7268 16.728 21.938 16.4885C22.1492 16.2491 22.3071 15.9675 22.4011 15.6623C22.4951 15.3572 22.523 15.0355 22.4831 14.7188ZM6.75 13.5H3V5.25H6.75V13.5Z";

const PROGRESS_SECONDS = 6;

type Visual =
  | { kind: "video"; light: string; dark: string; label: string }
  | { kind: "prompt" }
  | { kind: "icons" };

interface Point {
  title: string;
  body: string;
  /** null = no asset yet; the right side keeps the last one it has. */
  visual: Visual | null;
}

const POINTS: readonly Point[] = [
  {
    title: "Many AI tools, one style",
    body: "ChatGPT and Gemini make the tarot cards, icons, banners, and empty states. One shared style guide sits behind all of them.",
    visual: {
      kind: "video",
      light: "/images/ultraai/ua_ManyAItoolsonestyle_light.mp4",
      dark: "/images/ultraai/ua_ManyAItoolsonestyle_dark.mp4",
      label:
        "A continuous grid of UltraAI illustrations — tarot cards, expert portraits, icons and empty states — all in one style",
    },
  },
  {
    title: "A fixed prompt template",
    body: "The same template runs in every tool, so images match across all nine experts and in light and dark mode",
    visual: { kind: "prompt" },
  },
  {
    title: "An icon for every expert",
    body: "Crescent for Veda, dumbbell for Flex, chef’s hat for Luca. Color plus icon makes each expert easy to recognize.",
    visual: { kind: "icons" },
  },
];

export default function IllustrationSystemSlide({
  active = true,
}: {
  active?: boolean;
}) {
  const [seen, setSeen] = useState(false);
  const reduceMotion = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  // null until measured; the visuals mount only for the layout in use, so the
  // phone never loads a second copy of each clip behind a hidden desktop slot.
  const [wide, setWide] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const { index, progress, select, hover } = useProgressLoop({
    count: POINTS.length,
    seconds: PROGRESS_SECONDS,
    active: active && wide === true,
  });

  // Entering the slide loads the asset; the touch stack, which never flips
  // `active`, loads it when it nears the viewport.
  useEffect(() => {
    if (active) setSeen(true);
  }, [active]);

  useEffect(() => {
    if (seen) return;
    const el = frameRef.current;
    if (!el || wide === null) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, wide]);

  // The asset on screen: the active point's, else the last one that has one.
  let shown = POINTS[index].visual;
  for (let i = index; !shown && i >= 0; i--) shown = POINTS[i].visual;
  shown = shown ?? POINTS.find((p) => p.visual)?.visual ?? null;

  const renderVisual = (v: Visual | null) => (
    <>
      {v?.kind === "video" && (
        <div className="ua-video-fade-dark aspect-square w-full md:w-[600px]">
          {seen && (
            <ThemeAwareVideo
              lightSrc={v.light}
              darkSrc={v.dark}
              className="size-full object-cover"
              aria-label={v.label}
            />
          )}
        </div>
      )}
      {v?.kind === "prompt" && <PromptTemplateCard />}
      {v?.kind === "icons" && <ExpertIconBlocks />}
    </>
  );

  return (
    <section
      id="illustration-system"
      className="relative flex h-full w-full flex-col overflow-y-auto overflow-x-hidden bg-bg-primary md:overflow-hidden"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:hidden" />
      <GridDepthLayer className="absolute inset-0 hidden w-full [--grid-cell:40px] md:block" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] shrink-0 flex-col gap-24px px-20px py-32px md:h-full md:flex-row md:items-center md:justify-between md:gap-0 md:px-80px md:py-0">
        <div className="contents md:flex md:w-[600px] md:shrink-0 md:flex-col md:gap-[40px]">
          <div className="flex flex-col gap-24px">
            <span className="font-mono text-[13px] text-text-accent uppercase leading-[18px] tracking-[0.78px]">
              The illustration system
            </span>
            <div className="flex flex-col gap-16px">
              <h2 className="font-display text-slide-title-sm text-text-primary md:text-slide-title">
                One style guide for every AI tool
              </h2>
              <p className="font-ui font-normal text-[16px] text-text-muted leading-[28px] tracking-[0.08px]">
                Every image in UltraAI is AI generated, and three things keep
                it looking like one product.
              </p>
            </div>
          </div>

          <div className="order-2 flex flex-col gap-24px md:order-none md:max-w-[580px] md:gap-[32px]">
            {/* Phone: every asset upfront, static, each with its pointer below
                it — no selector, no progress bars (as the Shipped direction). */}
            <div ref={wide === false ? frameRef : undefined} className="flex flex-col gap-40px md:hidden">
              {wide === false &&
                POINTS.map((p) => (
                  <div key={p.title} className="flex flex-col gap-16px">
                    {renderVisual(p.visual)}
                    <div className="flex items-start gap-12px">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                        className="mt-2px size-16px shrink-0 -scale-y-100 text-text-success"
                      >
                        <path d={THUMB_UP} />
                      </svg>
                      <span className="flex flex-col gap-8px text-[14px] leading-[20px]">
                        <span className="font-ui font-semibold text-text-success">
                          {p.title}
                        </span>
                        <span className="font-ui font-normal text-text-primary tracking-[0.07px]">
                          {p.body}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
            </div>
            <div className="hidden flex-col md:flex" {...hover}>
              {POINTS.map((p, i) => {
                const isActive = i === index;
                return (
                  <button
                    key={p.title}
                    type="button"
                    aria-current={isActive}
                    onClick={() => select(i)}
                    className="group flex w-full cursor-pointer items-start gap-16px py-16px text-left"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      className="mt-2px size-16px shrink-0 -scale-y-100 text-text-success"
                    >
                      <path d={THUMB_UP} />
                    </svg>
                    <span className="flex min-w-0 flex-1 flex-col gap-16px">
                      <span className="flex flex-col gap-8px text-[14px] leading-[20px]">
                        <span
                          className={`font-ui font-semibold transition-colors duration-200 group-hover:text-text-success group-focus-visible:text-text-success ${
                            isActive ? "text-text-success" : "text-text-primary"
                          }`}
                        >
                          {p.title}
                        </span>
                        <span className="font-ui font-normal text-text-primary tracking-[0.07px]">
                          {p.body}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={`block h-[2px] w-full bg-border-frame md:max-w-[320px] ${isActive ? "" : "opacity-0"}`}
                      >
                        {isActive && (
                          <motion.span
                            className="block h-full w-full origin-left bg-text-primary"
                            style={{ scaleX: progress }}
                          />
                        )}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="font-ui font-semibold text-[17px] text-text-primary leading-[28px] tracking-[0.085px]">
              Any new asset comes out in the product’s style on the first
              prompt.
            </p>
          </div>
        </div>

        {/* Desktop: the right-hand asset for the active point; each fades in
            as it takes over. The clip's slot carries the dark-mode fade. */}
        {wide === true && (
          <div
            ref={frameRef}
            {...hover}
            className="flex w-[600px] shrink-0 items-center justify-center"
          >
            <motion.div
              key={shown?.kind ?? "none"}
              initial={{ opacity: reduceMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
            >
              {renderVisual(shown)}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
