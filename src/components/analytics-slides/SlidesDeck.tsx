"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import SegmentedRail, {
  type Chapter,
} from "@/components/fastrouter-slides/SegmentedRail";
import AnalyticsLogomark from "@/components/analytics-slides/AnalyticsLogomark";
import {
  HeroSlide,
  ProblemSlide,
  ProductSlide,
} from "@/components/analytics-slides/IntroSlides";
import {
  MetricCreationIntro,
  QueryBreakdownIntro,
  CalendarCompareIntro,
  MetricTaxonomyIntro,
} from "@/components/analytics-slides/FeatureIntroSlide";
import {
  MetricCreationRejected,
  QueryBreakdownRejected,
} from "@/components/analytics-slides/RejectedSlide";
import {
  MetricCreationDecision01,
  MetricCreationDecision02,
  MetricCreationDecision03,
  QueryBreakdownDecision01,
  QueryBreakdownDecision02,
  CalendarCompareDecision01,
  MetricTaxonomyDecision01,
  MetricTaxonomyDecision02,
} from "@/components/analytics-slides/DecisionSlides";
import {
  ImpactSlide,
  HonestFailureSlide,
  ReflectionsSlide,
  ThanksSlide,
  ReadNext,
} from "@/components/analytics-slides/ClosingSlides";
import { useTheme } from "@/components/shared/ThemeProvider";
import { useHeaderInvertSurface } from "@/components/shared/HeaderProvider";

// The Analytics case study's slide deck — the same mechanic as
// ultraai/SlidesDeck.tsx (a sticky pinned stage over a tall scroll track,
// slides dissolving into each other, a segmented rail on pointer devices and a
// chapter pill on touch). Every slide below is already built, so every chapter
// is live. Per CLAUDE.md, every case study after FastRouter is a deck, never
// the sticky-side-rail vertical page the old /analytics route was.
gsap.registerPlugin(ScrollToPlugin);

const HEADER_HEIGHT_FALLBACK_PX = 64;

// Soft edge of the dissolve + how far each slide drifts, carried over from
// fastrouter-slides/SlidesDeck.tsx's tuned values (see that file).
const REVEAL_FEATHER_PCT = 26;
const REVEAL_DRIFT_RATIO = 0.1;

// Rail ticks. Hero / Problem / Product, then the four modules, then three
// unnumbered bookends (Impact, Reflections, Closing) — the same shape as
// FastRouter's table. The honest-failure slide sits inside Impact.
const ANALYTICS_CHAPTERS: Chapter[] = [
  { id: "hero", label: "Introduction", number: "01" },
  { id: "problem", label: "The Problem", number: "02" },
  { id: "product", label: "The Product", number: "03" },
  { id: "metric-creation", label: "Metric Creation", number: "04" },
  { id: "query-breakdown", label: "Query Breakdown", number: "05" },
  { id: "calendar-compare", label: "Calendar Compare", number: "06" },
  { id: "metric-taxonomy", label: "Metric Taxonomy", number: "07" },
  { id: "impact", label: "Impact", number: null },
  { id: "reflections", label: "Reflections", number: null },
  { id: "closing", label: "Closing", number: null },
];
const ANALYTICS_BUILT_CHAPTER_IDS = new Set(
  ANALYTICS_CHAPTERS.map((c) => c.id)
);

// One row per slide: [dom id, component, rail chapter, rail mode]. "invert" is
// a `chapter-intro-invert` feature opener, the opposite of the global toggle.
// Kept as one table so the four parallel arrays below can't drift apart.
type SlideMode = "follow" | "invert";
const SLIDES: readonly [
  string,
  ComponentType<{ active?: boolean }>,
  string,
  SlideMode,
][] = [
  ["hero", HeroSlide, "hero", "follow"],
  ["problem", ProblemSlide, "problem", "follow"],
  ["product", ProductSlide, "product", "follow"],
  ["metric-creation", MetricCreationIntro, "metric-creation", "invert"],
  ["metric-creation-rejected", MetricCreationRejected, "metric-creation", "follow"],
  ["metric-creation-decision-01", MetricCreationDecision01, "metric-creation", "follow"],
  ["metric-creation-decision-02", MetricCreationDecision02, "metric-creation", "follow"],
  ["metric-creation-decision-03", MetricCreationDecision03, "metric-creation", "follow"],
  ["query-breakdown", QueryBreakdownIntro, "query-breakdown", "invert"],
  ["query-breakdown-rejected", QueryBreakdownRejected, "query-breakdown", "follow"],
  ["query-breakdown-decision-01", QueryBreakdownDecision01, "query-breakdown", "follow"],
  ["query-breakdown-decision-02", QueryBreakdownDecision02, "query-breakdown", "follow"],
  ["calendar-compare", CalendarCompareIntro, "calendar-compare", "invert"],
  ["calendar-compare-decision-01", CalendarCompareDecision01, "calendar-compare", "follow"],
  ["metric-taxonomy", MetricTaxonomyIntro, "metric-taxonomy", "invert"],
  ["metric-taxonomy-decision-01", MetricTaxonomyDecision01, "metric-taxonomy", "follow"],
  ["metric-taxonomy-decision-02", MetricTaxonomyDecision02, "metric-taxonomy", "follow"],
  ["impact", ImpactSlide, "impact", "follow"],
  ["honest-failure", HonestFailureSlide, "impact", "follow"],
  ["reflections", ReflectionsSlide, "reflections", "follow"],
  ["thanks", ThanksSlide, "closing", "follow"],
  ["read-next", ReadNext, "closing", "follow"],
];
const SLIDE_IDS = SLIDES.map((s) => s[0]);
const SLIDE_COMPONENTS = SLIDES.map((s) => s[1]);
const SLIDE_CHAPTER_IDS = SLIDES.map((s) => s[2]);
const SLIDE_RAIL_MODE = SLIDES.map((s) => s[3]);

// Ported from fastrouter-slides/SlidesDeck.tsx, mechanism unchanged: a tall
// scroll track (one container-height per slide) drives a STICKY pinned
// viewport. Slides are stacked absolutely rather than queued side by side —
// that's what lets a transition dissolve instead of slide (what shows
// through the incoming slide's mask is the outgoing slide itself). Native
// scroll does all the input handling (wheel, trackpad, keyboard, scrollbar);
// the only imperative JS is sync(), mapping scroll position onto each
// slide's mask + horizontal drift every frame, written directly to the DOM
// (outside React's managed style props) so it doesn't trigger a re-render
// per scroll tick. See that file's much longer comments on `sync()` for the
// full reasoning. Copied from ultraai/SlidesDeck.tsx unchanged apart from the
// slide tables above and the pill context.
export default function SlidesDeck() {
  const [headerHeight, setHeaderHeight] = useState(HEADER_HEIGHT_FALLBACK_PX);
  const [isTouch, setIsTouch] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { isDark } = useTheme();
  const { setInvertSurface } = useHeaderInvertSurface();

  const scrollRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slideHiddenRef = useRef<boolean[]>([]);
  const mobileSlideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeIndexRef = useRef(0);
  const jumpRef = useRef<{ from: number; to: number } | null>(null);
  const reduceMotionRef = useRef(false);
  // True while a pill jump is scrolling, so the touch scroll-spy doesn't tick
  // through every slide on the way and flicker the pill. Cleared by the tween.
  const programmaticScroll = useRef(false);
  const scrollTween = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Header chrome follows an inverted slide on the pointer deck only — on the
  // touch stack it sits over whatever is scrolled to the top, not necessarily
  // the active slide (same reasoning as fastrouter-slides/SlidesDeck.tsx).
  useEffect(() => {
    setInvertSurface(!isTouch && SLIDE_RAIL_MODE[activeIndex] === "invert");
    return () => setInvertSurface(false);
  }, [activeIndex, isTouch, setInvertSurface]);

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

  useEffect(() => {
    const mql = window.matchMedia("(hover: none) and (pointer: coarse)");
    // `?input=touch` forces the touch layout, for checking the phone stack and
    // the pill from a desktop browser that can't report a coarse pointer.
    const forced =
      new URLSearchParams(window.location.search).get("input") === "touch";
    const update = () => setIsTouch(forced || mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // Touch scroll-spy only — the pointer branch derives activeIndex directly
  // from scroll position inside sync() below, same split as FastRouter.
  useEffect(() => {
    if (!isTouch) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (programmaticScroll.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = mobileSlideRefs.current.findIndex(
          (el) => el === visible.target
        );
        if (index !== -1) setActiveIndex(index);
      },
      { threshold: 0.5 }
    );
    mobileSlideRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [isTouch]);

  const navigateTo = useCallback((index: number) => {
    const sc = scrollRef.current;
    if (!sc) return;
    const clamped = Math.max(0, Math.min(SLIDE_IDS.length - 1, index));

    const max = sc.scrollHeight - sc.clientHeight;
    const from =
      max > 0 ? Math.round((sc.scrollTop / max) * (SLIDE_IDS.length - 1)) : 0;

    if (Math.abs(clamped - from) > 1) {
      jumpRef.current = { from, to: clamped };
      setActiveIndex(clamped);
    }

    sc.scrollTo({ top: clamped * sc.clientHeight, behavior: "smooth" });
  }, []);

  const navigateToChapter = useCallback(
    (chapterId: string) => {
      const index = SLIDE_CHAPTER_IDS.indexOf(
        chapterId as (typeof SLIDE_CHAPTER_IDS)[number]
      );
      if (index === -1) return;

      if (!isTouch) {
        navigateTo(index);
        return;
      }

      const el = mobileSlideRefs.current[index];
      if (!el) return;

      // Kill any earlier jump FIRST (its interrupt clears the guard), then
      // guard the spy and show the destination's chapter immediately.
      scrollTween.current?.kill();
      programmaticScroll.current = true;
      setActiveIndex(index);

      // Hand control back on a real touch/wheel rather than ScrollToPlugin's
      // autoKill, which dies a few frames in on iOS (it compares scroll
      // positions iOS updates off the main thread).
      //
      // Two guards on top of that, both for input that ISN'T the reader
      // taking over: events in the first 400ms are ignored (the tail of the
      // tap itself, and the trackpad's wheel inertia that is still firing when
      // a laptop/inspector user taps the pill, which would otherwise kill the
      // jump on its first frame), and a finished jump re-measures its target
      // and corrects, because images and video above it settle after the
      // tween has already read where the section was.
      const startedAt = performance.now();
      const cancel = () => {
        if (performance.now() - startedAt < 400) return;
        scrollTween.current?.kill();
      };
      const release = () => {
        programmaticScroll.current = false;
        scrollTween.current = null;
        window.removeEventListener("touchstart", cancel);
        window.removeEventListener("wheel", cancel);
      };
      const settle = () => {
        const off = el.getBoundingClientRect().top - headerHeight;
        if (Math.abs(off) > 4) {
          window.scrollTo({ top: window.scrollY + off, behavior: "auto" });
        }
        release();
      };

      scrollTween.current = gsap.to(window, {
        duration: 0.8,
        ease: "power2.inOut",
        scrollTo: { y: el, offsetY: headerHeight },
        onComplete: settle,
        onInterrupt: release,
      });
      window.addEventListener("touchstart", cancel, { passive: true });
      window.addEventListener("wheel", cancel, { passive: true });
    },
    [navigateTo, isTouch, headerHeight]
  );

  // Leaving mid-jump kills the tween; its interrupt detaches the listeners.
  useEffect(
    () => () => {
      scrollTween.current?.kill();
    },
    []
  );

  // Keyboard: ArrowDown/PageDown/Space -> next, ArrowUp/PageUp -> previous.
  // Pointer only — the touch stack is ordinary document flow, where the
  // browser's own scroll handles arrow keys already.
  useEffect(() => {
    if (isTouch) return;
    const onKey = (e: KeyboardEvent) => {
      const forward =
        e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ";
      const back = e.key === "ArrowUp" || e.key === "PageUp";
      if (!forward && !back) return;
      if (e.repeat) return;
      e.preventDefault();
      navigateTo(activeIndexRef.current + (forward ? 1 : -1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isTouch, navigateTo]);

  // The pointer deck driver — maps scroll position onto each slide's mask +
  // horizontal drift. See the file-level comment above; this is
  // fastrouter-slides/SlidesDeck.tsx's sync() with FastRouter-specific
  // pieces (jump-rail-fill, invert surfaces) removed since nothing here
  // uses them yet.
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
      const pos = progress * (slides - 1);

      let jump = jumpRef.current;
      if (jump) {
        const travelled = (pos - jump.from) / (jump.to - jump.from);
        if (travelled >= 0.998 || travelled < -0.05) {
          jumpRef.current = null;
          jump = null;
        }
      }

      const index = Math.round(pos);
      if (!jump && index !== activeIndexRef.current) setActiveIndex(index);

      const drift = sc.clientWidth * REVEAL_DRIFT_RATIO;
      const hidden = slideHiddenRef.current;
      let pair: { lo: number; hi: number; reveal: number } | null = null;
      if (jump) {
        const travelled = Math.min(
          1,
          Math.max(0, (pos - jump.from) / (jump.to - jump.from))
        );
        const forward = jump.to > jump.from;
        pair = {
          lo: Math.min(jump.from, jump.to),
          hi: Math.max(jump.from, jump.to),
          reveal: forward ? travelled : 1 - travelled,
        };
      }

      for (let i = 0; i < slides; i++) {
        const el = slideRefs.current[i];
        if (!el) continue;

        let live: boolean;
        let linearReveal: number;
        let offsetUnits: number;
        if (pair) {
          live = i === pair.lo || i === pair.hi;
          const isHigh = i === pair.hi;
          linearReveal = isHigh ? pair.reveal : 1;
          offsetUnits = isHigh ? 1 - pair.reveal : -pair.reveal;
        } else {
          const d = pos - i;
          live = d > -1 && d < 1;
          linearReveal = Math.min(1, Math.max(0, d + 1));
          offsetUnits = i - pos;
        }

        if (!live) {
          if (hidden[i] !== true) {
            el.style.visibility = "hidden";
            el.style.maskImage = "none";
            el.style.setProperty("-webkit-mask-image", "none");
            hidden[i] = true;
          }
          continue;
        }
        if (hidden[i] !== false) {
          el.style.visibility = "visible";
          hidden[i] = false;
        }

        // Masks don't affect hit-testing, so a neighbouring slide that is "live"
        // but almost fully masked (a sub-pixel scroll leaves the next one at a
        // tiny reveal) would swallow clicks meant for the slide in view. Only
        // the slide that is mostly visible takes pointer input.
        el.style.pointerEvents = i === index ? "auto" : "none";

        const t = reduceMotionRef.current
          ? linearReveal < 0.5
            ? 0
            : 1
          : linearReveal * linearReveal * (3 - 2 * linearReveal);

        el.style.transform = reduceMotionRef.current
          ? "none"
          : `translate3d(${(offsetUnits * drift).toFixed(1)}px, 0, 0)`;

        if (t >= 1) {
          el.style.maskImage = "none";
          el.style.setProperty("-webkit-mask-image", "none");
          continue;
        }

        const edge = (100 + REVEAL_FEATHER_PCT) * (1 - t);
        const gradient = `linear-gradient(to right, transparent ${(
          edge - REVEAL_FEATHER_PCT
        ).toFixed(2)}%, black ${edge.toFixed(2)}%)`;
        el.style.maskImage = gradient;
        el.style.maskRepeat = "no-repeat";
        el.style.setProperty("-webkit-mask-image", gradient);
        el.style.setProperty("-webkit-mask-repeat", "no-repeat");
      }
    };

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onReduceChange = () => {
      reduceMotionRef.current = reduceQuery.matches;
      sync();
    };
    reduceMotionRef.current = reduceQuery.matches;
    onReduceChange();

    sc.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    reduceQuery.addEventListener("change", onReduceChange);
    return () => {
      sc.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      reduceQuery.removeEventListener("change", onReduceChange);
    };
  }, [isTouch]);

  // k/n on the k-th of n slides in the chapter, so every chapter reaches 1 on
  // its own last slide (same rule as fastrouter-slides' railFill).
  const chapterId = SLIDE_CHAPTER_IDS[activeIndex];
  const chapterStart = SLIDE_CHAPTER_IDS.indexOf(chapterId);
  const chapterCount = SLIDE_CHAPTER_IDS.filter((c) => c === chapterId).length;
  const railFill = (activeIndex - chapterStart + 1) / chapterCount;

  const pillContext = {
    logo: <AnalyticsLogomark />,
    business: "B2B",
    domain: "Ad Analytics",
  };

  const stageHeight = "100dvh";

  return (
    <>
      {isTouch ? (
        <div className="flex w-full flex-col gap-48px pb-[112px]">
          {SLIDE_IDS.map((id, index) => {
            const Slide = SLIDE_COMPONENTS[index];
            return (
              <div
                key={id}
                ref={(el) => {
                  mobileSlideRefs.current[index] = el;
                }}
                className="w-full bg-bg-primary"
              >
                <Slide />
              </div>
            );
          })}
        </div>
      ) : (
        <div
          ref={scrollRef}
          tabIndex={-1}
          className="relative w-full snap-y snap-mandatory overflow-y-auto overscroll-contain outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={
            {
              height: stageHeight,
              marginTop: -headerHeight,
              "--fr-header-h": `${headerHeight}px`,
            } as React.CSSProperties
          }
        >
          <div
            className="relative w-full"
            style={{ height: `${SLIDE_IDS.length * 100}%` }}
          >
            <div
              className="sticky top-0 w-full overflow-hidden"
              style={{ height: stageHeight }}
            >
              <div ref={rowRef} className="relative h-full w-full">
                {SLIDE_IDS.map((id, index) => {
                  const Slide = SLIDE_COMPONENTS[index];
                  return (
                    <div
                      key={id}
                      ref={(el) => {
                        slideRefs.current[index] = el;
                      }}
                      className="absolute inset-0 h-full w-full"
                      style={{
                        zIndex: index,
                        visibility: index === 0 ? "visible" : "hidden",
                      }}
                    >
                      <Slide active={index === activeIndex} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Snap points — one per slide at each viewport boundary.
                snap-always forces a fast fling to stop at the next slide
                rather than skipping several. Ported from
                fastrouter-slides/SlidesDeck.tsx: without these, `snap-y
                snap-mandatory` on the scroll container has nothing to
                actually snap TO (the sticky pinned viewport above isn't a
                snap target itself), so a scroll could come to rest
                mid-transition instead of settling on a slide. */}
            {SLIDE_IDS.map((id) => (
              <div
                key={`snap-${id}`}
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 snap-start snap-always"
                style={{
                  top: `${(SLIDE_IDS.indexOf(id) * 100) / SLIDE_IDS.length}%`,
                  height: `${100 / SLIDE_IDS.length}%`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <SegmentedRail
        chapters={ANALYTICS_CHAPTERS}
        builtChapterIds={ANALYTICS_BUILT_CHAPTER_IDS}
        activeId={SLIDE_CHAPTER_IDS[activeIndex]}
        fill={railFill}
        pillContext={pillContext}
        onNavigate={navigateToChapter}
        theme={
          (SLIDE_RAIL_MODE[activeIndex] === "invert") === isDark
            ? "on-light"
            : "on-dark"
        }
        variant={isTouch ? "pill" : "rail"}
      />
    </>
  );
}
