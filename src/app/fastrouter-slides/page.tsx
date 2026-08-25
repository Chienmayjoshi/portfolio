"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "motion/react";
import FastRouterLogomark from "@/components/fastrouter/FastRouterLogomark";
import SegmentedRail from "@/components/fastrouter-slides/SegmentedRail";
import HeroSlide from "@/components/fastrouter-slides/HeroSlide";
import ProblemSlide from "@/components/fastrouter-slides/ProblemSlide";
import ProductSlide from "@/components/fastrouter-slides/ProductSlide";
import { useTheme } from "@/components/shared/ThemeProvider";

const SLIDE_IDS = ["hero", "problem", "product"] as const;
// Parallel array of slide bodies, index-aligned with SLIDE_IDS — lets both
// the mobile stack and the desktop stage iterate rather than hardcoding two
// JSX branches per slide that drift apart as chapters are added.
const SLIDE_COMPONENTS = [HeroSlide, ProblemSlide, ProductSlide] as const;
// Parallel array: does this slide's background respond to the global
// light/dark toggle? Hero's is a static illustration (a photo doesn't
// change with the toggle) — always wants the bright "on-dark" ticks that
// were tuned against it. Problem's is `bg-bg-primary`, a token that
// itself flips light/dark with the toggle — flagged directly after
// hardcoding this slide to "on-light" produced dark ticks on a now-dark
// background in dark mode (nearly invisible). For a token-backed
// background, the rail's variant has to track the SAME toggle the
// background itself tracks, not a fixed per-slide constant.
// Product (index 2) is bg-bg-primary too, same as Problem → follows theme.
const SLIDE_BACKGROUND_FOLLOWS_THEME = [false, true, true] as const;
// Fallback only, used before the real measurement below runs (SSR / first
// paint) — was previously the ONLY value, hardcoded, carried over from
// TempHeader's old math ("12px padding + 40px ThemeToggle = ~64px") and
// never re-checked against the current Header.tsx. Header's pill content
// (font-ui text-16px, no explicit line-height) turned out taller than the
// 40px ThemeToggle it was sized against, so real Header height is 74px,
// not 64 — the resulting 10px-per-slide gap was silently producing a real
// (if small) page scroll on every fastrouter-slides route, flagged
// directly. Patching the number to 74 would just recreate the same bug
// the next time Header's content changes height (a longer pill label, a
// font tweak) — measuring it directly instead removes the guess entirely.
const HEADER_HEIGHT_FALLBACK_PX = 64;

// Parallel, full-page horizontal-slide rebuild of the FastRouter case
// study (Figma section "portfolio case study interactive horizontal
// sliding approach", node 7213:122638) — tested alongside the live
// vertical-scroll /fastrouter rather than replacing it. See
// IMPLEMENTATION_LOG.md's 2026-08-22/2026-08-24 entries.
//
// Two slides so far (Hero, Problem). Every other chapter is a future,
// separately-approved step, per the project's "one screen fully correct
// before the next opens" build order — see SegmentedRail.tsx's
// BUILT_CHAPTER_IDS.
//
// Header chrome comes from the global Header (src/app/layout.tsx), not a
// page-local component.
//
// Two presentations of the same slides, chosen by viewport (see the
// isMobile state below for the full rationale):
//   - Desktop owns a horizontal slide stage: slides side by side in a flex
//     row `SLIDE_IDS.length * 100%` wide, each cell `100/length %` of that,
//     translated via Motion on rail navigation — a real horizontal slide
//     transition. Click/state-driven, so Motion not GSAP (this project's
//     animation split). Stage height is 100dvh minus the real, measured
//     Header height (see the headerHeight effect below).
//   - Mobile stacks the slides in normal document flow and scrolls freely,
//     because a fixed one-viewport-tall slide clips content on shorter
//     phones. The bottom pill follows scroll instead of the rail.
// The measured Header height lives here rather than per-slide now that a
// second slide exists — was duplicated inside HeroSlide.tsx when it was the
// only one.
export default function FastRouterSlidesPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(HEADER_HEIGHT_FALLBACK_PX);
  // Touch and pointer devices get two genuinely different layouts here, not
  // one layout with responsive tweaks — so this drives a real branch in
  // render, not just class toggles.
  //
  // Pointer (mouse/trackpad): the horizontal slide stage — slides side by
  // side, translated on x, navigated by the hover-aware rail. A slide is
  // exactly one viewport tall. The horizontal slide and the rail's
  // hover-to-wake behavior are fundamentally pointer interactions.
  //
  // Touch: that fixed-height model clipped content, because device viewport
  // heights vary and a slide's content (headline + TL;DR + meta grid +
  // illustration) doesn't fit a short one — flagged directly. So touch drops
  // the stage entirely: slides stack in normal document flow and the page
  // scrolls freely, each slide at least a screen tall (min-h) but free to
  // grow. No swipe/drag and no rail; the bottom status pill instead follows
  // scroll position and relabels to whichever section is in view (see the
  // scroll-spy effect below). An earlier horizontal-swipe attempt on touch
  // was abandoned for this reason (variable viewport height), not refined.
  //
  // Split on input type, NOT width: a landscape phone or a tablet is wide
  // (>=768px) but still a touch device that wants the vertical experience,
  // and the width-based split used to hand those the pointer carousel and
  // hide the pill — flagged directly. `(hover: none) and (pointer: coarse)`
  // is the standard "touch-primary device" query; the same signal is passed
  // to SegmentedRail so its pill-vs-rail choice can never disagree with this
  // branch (a width-based rail over a vertical stack would render nav that
  // does nothing).
  const [isTouch, setIsTouch] = useState(false);
  const [stageWidth, setStageWidth] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  // Refs to each stacked (touch) slide wrapper, for the scroll-spy
  // IntersectionObserver — index-aligned with SLIDE_IDS. Unused in the
  // pointer branch (that stack isn't rendered there).
  const mobileSlideRefs = useRef<(HTMLElement | null)[]>([]);
  const controls = useAnimation();
  const { isDark } = useTheme();

  // Header lives in the root layout (a sibling ancestor, not a descendant
  // of this page), so there's no normal React ref path to it — measuring
  // the real DOM element directly, same "reach outside the component
  // tree via a direct query" pattern SectionRail.tsx already uses for its
  // own scroll targets. ResizeObserver keeps this correct if Header's own
  // height ever changes after mount (e.g. text wrapping differently at
  // another viewport width), not just once on load.
  useEffect(() => {
    const headerEl = document.querySelector("header");
    if (!headerEl) return;

    const measure = () => setHeaderHeight(headerEl.getBoundingClientRect().height);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(headerEl);
    return () => observer.disconnect();
  }, []);

  // Touch-primary detection — a live listener, not a one-time check, so a
  // 2-in-1 switching modes (or a device that reports capabilities late)
  // updates. `hover: none` rules out anything with a real hover (mouse);
  // `pointer: coarse` confirms a touch-sized primary pointer. Together they
  // are the widely-used "is this a touch device" test, independent of width.
  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // The desktop stage's x is animated in measured pixels, so measure the
  // stage's own rendered width — each slide cell is exactly one viewport
  // width regardless of slide count, so `stageWidth` is the per-slide step
  // that goToSlide translates by.
  // Re-runs on isTouch change: the pointer stage element only exists in the
  // pointer branch, so when the layout switches back to it (a 2-in-1 mode
  // change) this has to re-attach to the freshly-mounted stageRef. On touch
  // stageRef is null and this early-returns — the vertical stack has no
  // pixel-driven transform to feed.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const measure = () => setStageWidth(el.getBoundingClientRect().width);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isTouch]);

  // Mobile scroll-spy: keep activeIndex (which drives the bottom pill's
  // label via SegmentedRail's activeId) in sync with the section you've
  // scrolled to. Desktop drives activeIndex through goToSlide instead, so
  // this only runs on mobile.
  //
  // The rootMargin shrinks the observer root to a thin detection band LOW in
  // the viewport (~70%–75% down). Placement is the whole trick, and it's
  // counter-intuitive: a section becomes "active" only once its TOP edge
  // reaches the band, so a band near the TOP fires late (the section has to
  // scroll almost all the way up first — it's already filling most of the
  // screen), and a band low down fires early (as soon as the section's top
  // enters the lower part of the viewport — i.e. right as it starts). Two
  // earlier passes sat too high (center, then 20–30%) and both read as "the
  // label updates too late / only at the end of the section"; this low band
  // flips it at the start instead. The band is a real (non-zero) height on
  // purpose: the tempting `-50% 0px -50% 0px` shorthand collapses the root to
  // a zero-height line, and a zero-area overlap can register as NOT
  // intersecting in Chrome. `visible.length === 0` (e.g. while the fixed
  // 120px inter-slide gap is passing the band) keeps the last active index
  // rather than clearing it.
  useEffect(() => {
    if (!isTouch) return;
    const els = mobileSlideRefs.current.filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const front = visible.reduce((a, b) =>
          b.intersectionRatio > a.intersectionRatio ? b : a
        );
        const index = Number((front.target as HTMLElement).dataset.index);
        if (!Number.isNaN(index)) setActiveIndex(index);
      },
      { rootMargin: "-70% 0px -25% 0px", threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isTouch]);

  // If stageWidth changes after a navigation has already happened (device
  // rotation, window resize) — an instant correction, not an animated
  // `goToSlide` call, so resizing mid-session doesn't produce a visible
  // slide transition. Deliberately excludes activeIndex: this only reacts
  // to width changing, not index changes (those already get their own
  // animated `controls.start` from goToSlide).
  useEffect(() => {
    if (stageWidth === 0) return;
    controls.set({ x: -activeIndex * stageWidth });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageWidth]);

  // Desktop rail navigation: translate the stage to the chosen slide.
  // Mobile doesn't call this (no rail, no drag — activeIndex is driven by
  // the scroll-spy observer above instead).
  const goToSlide = (index: number) => {
    const clamped = Math.max(0, Math.min(SLIDE_IDS.length - 1, index));
    setActiveIndex(clamped);
    controls.start({
      x: -clamped * stageWidth,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    });
  };

  const pillContext = {
    logo: <FastRouterLogomark />,
    business: "B2B",
    domain: "AI Infrastructure",
  };

  const railTheme = SLIDE_BACKGROUND_FOLLOWS_THEME[activeIndex]
    ? isDark
      ? "on-dark"
      : "on-light"
    : "on-dark";

  return (
    <>
      {isTouch ? (
        // Touch: free-scrolling vertical stack, each slide sized to its own
        // content with a FIXED 120px gap between slides (flagged directly).
        // An earlier version made every slide at least a screen tall
        // (min-h-screen) so each read as a discrete "slide," but on short
        // slides that left a large, content-dependent empty gap before the
        // next one — inconsistent slide to slide. Content height + a constant
        // gap gives an even rhythm instead. bg-bg-primary on each wrapper
        // matches its slide's own background. (headerHeight is still measured
        // above for the pointer branch's stage height, just no longer needed
        // here.)
        <div className="flex w-full flex-col gap-[120px]">
          {SLIDE_IDS.map((id, index) => {
            const Slide = SLIDE_COMPONENTS[index];
            return (
              <div
                key={id}
                ref={(el) => {
                  mobileSlideRefs.current[index] = el;
                }}
                data-index={index}
                className="w-full bg-bg-primary"
              >
                <Slide />
              </div>
            );
          })}
        </div>
      ) : (
        // Pointer: the horizontal slide stage — cells side by side in a row
        // `SLIDE_IDS.length * 100%` wide, translated via Motion, navigated by
        // the rail. Height is one viewport minus the measured Header.
        <div
          ref={stageRef}
          className="relative w-full overflow-hidden"
          style={{ height: `calc(100dvh - ${headerHeight}px)` }}
        >
          <motion.div
            className="flex h-full"
            style={{ width: `${SLIDE_IDS.length * 100}%` }}
            initial={false}
            animate={controls}
          >
            {SLIDE_IDS.map((id, index) => {
              const Slide = SLIDE_COMPONENTS[index];
              return (
                <div
                  key={id}
                  className="h-full shrink-0"
                  style={{ width: `${100 / SLIDE_IDS.length}%` }}
                >
                  <Slide />
                </div>
              );
            })}
          </motion.div>
        </div>
      )}

      <SegmentedRail
        activeId={SLIDE_IDS[activeIndex]}
        pillContext={pillContext}
        onNavigate={goToSlide}
        theme={railTheme}
        // Same touch signal as the layout branch above, so the rail (pointer)
        // vs. status pill (touch) choice always matches which stage is
        // actually rendered — never a width-based rail floating over the
        // vertical stack.
        variant={isTouch ? "pill" : "rail"}
      />
    </>
  );
}
