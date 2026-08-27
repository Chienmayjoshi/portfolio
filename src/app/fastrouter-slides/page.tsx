"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import FastRouterLogomark from "@/components/fastrouter/FastRouterLogomark";
import SegmentedRail from "@/components/fastrouter-slides/SegmentedRail";
import HeroSlide from "@/components/fastrouter-slides/HeroSlide";
import ProblemSlide from "@/components/fastrouter-slides/ProblemSlide";
import ProductSlide from "@/components/fastrouter-slides/ProductSlide";
import { useTheme } from "@/components/shared/ThemeProvider";

const SLIDE_IDS = ["hero", "problem", "product"] as const;
// Parallel array of slide bodies, index-aligned with SLIDE_IDS — lets both
// the touch stack and the pointer deck iterate rather than hardcoding two
// JSX branches per slide that drift apart as chapters are added.
const SLIDE_COMPONENTS = [HeroSlide, ProblemSlide, ProductSlide] as const;
// Parallel array: does this slide's background respond to the global
// light/dark toggle? Hero's is a static illustration (a photo doesn't
// change with the toggle) — always wants the bright "on-dark" ticks that
// were tuned against it. Problem's is `bg-bg-primary`, a token that itself
// flips light/dark with the toggle. Product (index 2) is bg-bg-primary too,
// same as Problem → follows theme. For a token-backed background the rail's
// variant has to track the SAME toggle the background tracks, not a fixed
// per-slide constant.
const SLIDE_BACKGROUND_FOLLOWS_THEME = [false, true, true] as const;
// Fallback only, used before the real measurement below runs (SSR / first
// paint). Header's real height (~74px) is measured directly rather than
// hardcoded, so a font/label change to the Header can't silently desync the
// deck's stage height from it.
const HEADER_HEIGHT_FALLBACK_PX = 64;

// Parallel, full-page slide rebuild of the FastRouter case study (Figma
// section "portfolio case study interactive horizontal sliding approach",
// node 7213:122638), tested alongside the live vertical-scroll /fastrouter.
// Header chrome comes from the global Header (src/app/layout.tsx).
//
// Two presentations of the same slides, chosen by INPUT TYPE (see the isTouch
// state below), not width:
//
//   - Pointer (mouse/trackpad): a horizontal slide DECK driven by NATIVE
//     vertical scroll. The deck is a real scroll container tall enough for one
//     viewport per slide; the visible slides are a pinned (sticky) horizontal
//     row whose translateX is driven from the container's scroll position, and
//     CSS scroll-snap (with snap-stop: always) settles on one slide per swipe.
//     This replaced an earlier wheel-hijacking approach that was unreliable on
//     macOS trackpads ("doesn't slide until I click the page") — native scroll
//     is delivered by the browser unconditionally: no click, and wheel /
//     trackpad / keyboard / scrollbar all work for free. Reference: the smooth
//     native-scroll case studies on zainabkabira.com (the same site the rail
//     was modelled on) are plain native scroll, not scroll-jacked.
//
//   - Touch: the deck's fixed-height model clips content on short phones, so
//     touch stacks the slides in normal document flow with a fixed 120px gap
//     and scrolls freely; the bottom status pill follows scroll (scroll-spy)
//     instead of the rail.
//
// Split on input type so a wide-but-touch device (landscape phone, tablet)
// still gets the vertical experience; the same signal is passed to
// SegmentedRail so its rail-vs-pill choice can't disagree with this branch.
export default function FastRouterSlidesPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(HEADER_HEIGHT_FALLBACK_PX);
  const [isTouch, setIsTouch] = useState(false);
  // Pointer deck: the native scroll container and the horizontal row inside it
  // whose transform tracks scroll position.
  const scrollRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  // Refs to each stacked (touch) slide wrapper, for the scroll-spy
  // IntersectionObserver — index-aligned with SLIDE_IDS. Unused in the pointer
  // branch (that stack isn't rendered there).
  const mobileSlideRefs = useRef<(HTMLElement | null)[]>([]);
  const { isDark } = useTheme();

  // Latest activeIndex for the pointer deck's scroll/key handlers, which are
  // attached once (in an effect keyed on isTouch) and so can't read it from a
  // stale render closure.
  const activeIndexRef = useRef(0);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Header lives in the root layout (a sibling ancestor, not a descendant of
  // this page), so measure the real DOM element directly. ResizeObserver keeps
  // the deck's stage height correct if the Header's own height ever changes.
  useEffect(() => {
    const headerEl = document.querySelector("header");
    if (!headerEl) return;

    const measure = () =>
      setHeaderHeight(headerEl.getBoundingClientRect().height);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(headerEl);
    return () => observer.disconnect();
  }, []);

  // Touch-primary detection — a live listener, not a one-time check, so a
  // 2-in-1 switching modes updates. `hover: none` rules out anything with a
  // real hover (mouse); `pointer: coarse` confirms a touch-sized primary
  // pointer. Together they are the standard "is this a touch device" test,
  // independent of width.
  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Navigation entry point for the rail (click) and the keyboard handler: a
  // smooth NATIVE scroll to the target slide's section. The scroll handler
  // below turns the resulting scroll into the horizontal slide + activeIndex
  // update, so scroll position stays the single source of truth. Stable
  // (reads scrollRef), so the once-attached key listener can call it.
  const navigateTo = useCallback((index: number) => {
    const sc = scrollRef.current;
    if (!sc) return;
    const clamped = Math.max(0, Math.min(SLIDE_IDS.length - 1, index));
    sc.scrollTo({ top: clamped * sc.clientHeight, behavior: "smooth" });
  }, []);

  // Pointer deck driver: map the scroll container's vertical scroll position
  // onto the horizontal row's translateX, and mirror it into activeIndex for
  // the rail. Native scroll does all the input handling (wheel, trackpad,
  // keyboard, scrollbar) — reliably and without a prior click — so there is no
  // wheel listener here. Only runs on the pointer branch (scrollRef exists).
  //
  // The transform is written imperatively to rowRef (not via React state) so
  // it can update every scroll frame without re-rendering; it's set outside
  // React's managed style props, so activeIndex re-renders don't clobber it.
  useEffect(() => {
    if (isTouch) return;
    const sc = scrollRef.current;
    if (!sc) return;

    const slides = SLIDE_IDS.length;

    const sync = () => {
      const row = rowRef.current;
      if (!row) return;
      const max = sc.scrollHeight - sc.clientHeight;
      const progress = max > 0 ? sc.scrollTop / max : 0;
      row.style.transform = `translate3d(${
        -progress * (slides - 1) * sc.clientWidth
      }px, 0, 0)`;
      const index = Math.round(progress * (slides - 1));
      if (index !== activeIndexRef.current) setActiveIndex(index);
    };
    sync(); // set the initial transform before the first scroll

    // Keyboard: ArrowDown/PageDown/Space → next, ArrowUp/PageUp → previous.
    // navigateTo does a smooth native scrollTo, which the scroll handler above
    // turns into the slide transition. e.repeat ignored so a held key doesn't
    // machine-gun through slides.
    const onKey = (e: KeyboardEvent) => {
      const forward =
        e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ";
      const back = e.key === "ArrowUp" || e.key === "PageUp";
      if (!forward && !back) return;
      if (e.repeat) return;
      e.preventDefault();
      navigateTo(activeIndexRef.current + (forward ? 1 : -1));
    };

    sc.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("keydown", onKey);
    // Recompute the transform when the container is resized (its width, and so
    // the per-slide pixel step, changes).
    const observer = new ResizeObserver(sync);
    observer.observe(sc);
    return () => {
      sc.removeEventListener("scroll", sync);
      window.removeEventListener("keydown", onKey);
      observer.disconnect();
    };
  }, [isTouch, navigateTo]);

  // Touch scroll-spy: keep activeIndex (which drives the bottom pill's label)
  // in sync with the section scrolled to. Detection band sits LOW in the
  // viewport (~70–75% down) so a section becomes active as it starts entering,
  // not once it already fills the screen. Non-zero band height on purpose (a
  // zero-height `-50%/-50%` root can read as not-intersecting in Chrome).
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

  const stageHeight = `calc(100dvh - ${headerHeight}px)`;

  return (
    <>
      {isTouch ? (
        // Touch: free-scrolling vertical stack, each slide sized to its own
        // content with a fixed 120px gap between slides. bg-bg-primary on each
        // wrapper matches its slide's own background.
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
        // Pointer: native-scroll slide deck. The container scrolls vertically
        // (one viewport of scroll length per slide); the pinned row inside
        // translates horizontally with scroll position. Scrollbar hidden;
        // overscroll-contain stops scroll chaining to the page; snap-mandatory
        // + snap-always (on the markers) gives one slide per swipe.
        <div
          ref={scrollRef}
          tabIndex={-1}
          className="relative w-full snap-y snap-mandatory overflow-y-auto overscroll-contain outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ height: stageHeight }}
        >
          {/* Tall track — creates the scroll length: one container-height per
              slide. */}
          <div
            className="relative w-full"
            style={{ height: `${SLIDE_IDS.length * 100}%` }}
          >
            {/* Pinned viewport — stays put while the track scrolls under it. */}
            <div
              className="sticky top-0 w-full overflow-hidden"
              style={{ height: stageHeight }}
            >
              {/* Horizontal row — translateX written imperatively from scroll
                  position (see the pointer effect). */}
              <div
                ref={rowRef}
                className="flex h-full will-change-transform"
                style={{ width: `${SLIDE_IDS.length * 100}%` }}
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
              </div>
            </div>

            {/* Snap points — one per slide at each viewport boundary.
                snap-always forces a fast fling to stop at the next slide
                rather than skipping several. */}
            {SLIDE_IDS.map((id, index) => (
              <div
                key={`snap-${id}`}
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 snap-start snap-always"
                style={{
                  top: `${(index * 100) / SLIDE_IDS.length}%`,
                  height: `${100 / SLIDE_IDS.length}%`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <SegmentedRail
        activeId={SLIDE_IDS[activeIndex]}
        pillContext={pillContext}
        onNavigate={navigateTo}
        theme={railTheme}
        // Same touch signal as the layout branch above, so the rail (pointer)
        // vs. status pill (touch) choice always matches which stage is
        // actually rendered.
        variant={isTouch ? "pill" : "rail"}
      />
    </>
  );
}
