"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import SegmentedRail, {
  type Chapter,
} from "@/components/fastrouter-slides/SegmentedRail";
import UltraAILogomark from "@/components/ultraai/UltraAILogomark";
import HeroSlide from "@/components/ultraai/HeroSlide";
import ProblemSlide from "@/components/ultraai/ProblemSlide";
import ShellIntroSlide from "@/components/ultraai/ShellIntroSlide";
import RejectedDirectionSlide from "@/components/ultraai/RejectedDirectionSlide";
import ShippedDirectionSlide from "@/components/ultraai/ShippedDirectionSlide";
import {
  ShellDecision01Slide,
  ShellDecision02Slide,
  ShellDecision03Slide,
  ShellDecision05Slide,
} from "@/components/ultraai/ShellDecisionSlide";
import { useTheme } from "@/components/shared/ThemeProvider";
import { useHeaderInvertSurface } from "@/components/shared/HeaderProvider";

const HEADER_HEIGHT_FALLBACK_PX = 64;

// Width of the soft edge on the sweeping reveal + how far each slide drifts
// horizontally, both carried over verbatim from fastrouter-slides/
// SlidesDeck.tsx's own tuned values — see that file's comments above these
// same two constants for the full reasoning (stacked slides + a feathered
// mask is what makes a real dissolve possible; the drift keeps a sense of
// travel without reading as a rectangle being pushed across).
const REVEAL_FEATHER_PCT = 26;
const REVEAL_DRIFT_RATIO = 0.1;

// Full chapter shape per content/ultraai.md's sticky side-rail table plus
// the Figma deck's own intro/problem/product frames (which the doc's rail
// table doesn't cover — it only starts at Scroll 5). Unbuilt chapters still
// render (inert) so the rail's shape doesn't change as slides are added —
// same convention as FastRouter's table.
const ULTRAAI_CHAPTERS: Chapter[] = [
  { id: "hero", label: "Introduction", number: "01" },
  { id: "problem", label: "The Problem", number: "02" },
  { id: "product", label: "The Product", number: "03" },
  { id: "shell", label: "The Shell", number: "04" },
  { id: "veda", label: "Veda", number: "05" },
  { id: "paywall", label: "Paywall System", number: "06" },
  { id: "flex", label: "Flex", number: "07" },
  { id: "design-system", label: "Design System", number: "08" },
  { id: "illustration-system", label: "Illustration System", number: "09" },
  { id: "status", label: "Status", number: null },
  { id: "reflections", label: "Reflections", number: null },
  { id: "closing", label: "Closing", number: null },
];
const ULTRAAI_BUILT_CHAPTER_IDS = new Set([
  "hero",
  "problem",
  "shell",
]);

// "product" is skipped on purpose (assets still in progress), so the deck
// goes problem -> shell and the rail's product tick stays inert.
const SLIDE_IDS = [
  "hero",
  "problem",
  "shell",
  "shell-rejected",
  "shell-shipped",
  "shell-decision-01",
  "shell-decision-02",
  "shell-decision-03",
  "shell-decision-05",
] as const;
// `active` is only passed on the pointer deck, to slides that run something
// while on screen (every slide stays mounted and stacked); the rest ignore it.
const SLIDE_COMPONENTS: ComponentType<{ active?: boolean }>[] = [
  HeroSlide,
  ProblemSlide,
  ShellIntroSlide,
  RejectedDirectionSlide,
  ShippedDirectionSlide,
  ShellDecision01Slide,
  ShellDecision02Slide,
  ShellDecision03Slide,
  ShellDecision05Slide,
];
// The Shell's intro, rejected and shipped direction slides share the "shell" tick;
// `fill` below is how much of the active chapter has been read.
const SLIDE_CHAPTER_IDS = [
  "hero",
  "problem",
  "shell",
  "shell",
  "shell",
  "shell",
  "shell",
  "shell",
  "shell",
] as const;
// How each slide's surface relates to the global toggle, deciding whether the
// rail (and the header) read light or dark over it — same meaning as
// fastrouter-slides/SlidesDeck.tsx's SLIDE_RAIL_MODE. "invert" is a
// `chapter-intro-invert` feature opener, the opposite of the toggle.
const SLIDE_RAIL_MODE = [
  "follow",
  "follow",
  "invert",
  "follow",
  "follow",
  "follow",
  "follow",
  "follow",
  "follow",
] as const;

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
// full reasoning — reproduced here close to verbatim, UltraAI-specific bits
// only (2 slides, no chapter spans/rail-mode table yet since nothing
// inverts and no chapter holds more than one slide so far).
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
    const update = () => setIsTouch(mql.matches);
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

      mobileSlideRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    [navigateTo, isTouch]
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
    logo: <UltraAILogomark />,
    business: "B2C",
    domain: "Multi-Expert AI",
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
        chapters={ULTRAAI_CHAPTERS}
        builtChapterIds={ULTRAAI_BUILT_CHAPTER_IDS}
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
