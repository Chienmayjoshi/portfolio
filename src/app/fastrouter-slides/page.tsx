"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import FastRouterLogomark from "@/components/fastrouter/FastRouterLogomark";
import SegmentedRail from "@/components/fastrouter-slides/SegmentedRail";
import HeroSlide from "@/components/fastrouter-slides/HeroSlide";
import ProblemSlide from "@/components/fastrouter-slides/ProblemSlide";
import ProductSlide from "@/components/fastrouter-slides/ProductSlide";
import FeaturesSlide from "@/components/fastrouter-slides/FeaturesSlide";
import CouncilIntroSlide from "@/components/fastrouter-slides/CouncilIntroSlide";
import BriefSlide from "@/components/fastrouter-slides/BriefSlide";
import ConceptualGroundingSlide from "@/components/fastrouter-slides/ConceptualGroundingSlide";
import ReframeSlide from "@/components/fastrouter-slides/ReframeSlide";
import {
  CouncilDecision01,
  CouncilDecision02,
  CouncilDecision03,
  CouncilDecision04,
  ObservabilityDecision01,
  ObservabilityDecision02,
} from "@/components/fastrouter-slides/DecisionSlide";
import RejectedVsShippedSlide from "@/components/fastrouter-slides/RejectedVsShippedSlide";
import ObservabilityIntroSlide from "@/components/fastrouter-slides/ObservabilityIntroSlide";
import { useTheme } from "@/components/shared/ThemeProvider";
import { useHeaderInvertSurface } from "@/components/shared/HeaderProvider";

// Per-slide REACT KEY / DOM-anchor ids — these must be unique, so the two
// slides that both belong to the Council chapter carry distinct ids
// ("council-intro" = the feature title card, "council" = the first
// DecisionSlide preview). Which rail tick each one lights is a separate
// mapping (SLIDE_CHAPTER_IDS below), so both can point at the "council"
// chapter without colliding as keys. The DecisionSlide slot is still a
// preview placement (a template, not necessarily its final sequence spot).
const SLIDE_IDS = [
  "hero",
  "problem",
  "product",
  "features",
  "council-intro",
  "council-brief",
  "council-grounding",
  "council-reframe",
  "council-rejected-shipped",
  "council-decision-01",
  "council-decision-02",
  "council-decision-03",
  "council-decision-04",
  "observability-intro",
  "observability-decision-01",
  "observability-decision-02",
] as const;
// Parallel array of slide bodies, index-aligned with SLIDE_IDS — lets both
// the touch stack and the pointer deck iterate rather than hardcoding two
// JSX branches per slide that drift apart as chapters are added.
const SLIDE_COMPONENTS = [
  HeroSlide,
  ProblemSlide,
  ProductSlide,
  FeaturesSlide,
  CouncilIntroSlide,
  BriefSlide,
  ConceptualGroundingSlide,
  ReframeSlide,
  RejectedVsShippedSlide,
  CouncilDecision01,
  CouncilDecision02,
  CouncilDecision03,
  CouncilDecision04,
  ObservabilityIntroSlide,
  ObservabilityDecision01,
  ObservabilityDecision02,
] as const;
// Parallel array: which SegmentedRail chapter tick each slide lights up.
// Distinct from SLIDE_IDS (React keys) because several slides can share one
// chapter — the Council intro and the first decision are both chapter
// "council", so the rail keeps that one tick active across both. Every value
// here must be an id that exists in SegmentedRail's CHAPTERS table, or the
// rail's findIndex returns -1 and crashes.
const SLIDE_CHAPTER_IDS = [
  "hero",
  "problem",
  "product",
  "features",
  "council",
  "council",
  "council",
  "council",
  "council",
  "council",
  "council",
  "council",
  "council",
  "observability",
  "observability",
  "observability",
] as const;
// Parallel array: how each slide's background relates to the global toggle,
// which decides whether the rail's ticks read light or dark over it.
//   - "fixed-dark": background doesn't track the toggle at all. Hero's is a
//     static illustration (a photo doesn't change with the toggle) — always
//     wants the bright "on-dark" ticks tuned against it.
//   - "follow": a `bg-bg-primary` surface that flips WITH the toggle, so the
//     rail must track the SAME toggle (Problem/Product/Features, and the
//     Council decision — all plain token surfaces).
//   - "invert": a `chapter-intro-invert` surface that renders OPPOSITE to the
//     toggle (globals.css) as a "new feature" signal, so the rail must be the
//     inverse of the toggle too. The two chapter intros (Council at index 4,
//     Observability at 13) are the only ones; the coming Evaluations intro
//     will join them. A chapter's DECISION slides are plain bg-bg-primary and
//     stay "follow" — only the intro card inverts.
type SlideRailMode = "fixed-dark" | "follow" | "invert";
const SLIDE_RAIL_MODE: readonly SlideRailMode[] = [
  "fixed-dark",
  "follow",
  "follow",
  "follow",
  "invert",
  "follow",
  "follow",
  "follow",
  "follow",
  "follow",
  "follow",
  "follow",
  "follow",
  "invert",
  "follow",
  "follow",
];
// Fallback only, used before the real measurement below runs (SSR / first
// paint). Header's real height (~74px) is measured directly rather than
// hardcoded, so a font/label change to the Header can't silently desync the
// deck's stage height from it.
const HEADER_HEIGHT_FALLBACK_PX = 64;

// Masked slide transition. Reproduces the effect of Motion's "page mask
// transitions" example; that example's own AnimateView API needs react@canary
// and the paid motion-plus package, so this is built from the deck's existing
// scroll math instead and adds no dependency.
//
// Slides are STACKED, not laid side by side, and the incoming one is revealed
// through a mask that sweeps across it. The first attempt kept the side-by-side
// row and merely feathered the two viewport edges; that was measurably working
// and completely imperceptible, because the thing that makes a deck read as
// "blocks sliding in and out" is the hard vertical seam where two slides meet,
// and a mask cannot soften that seam while the slides are non-overlapping
// siblings — there is nothing behind one to blend into the other. Stacking them
// is what makes a real dissolve possible: what shows through the incoming
// slide's mask IS the outgoing slide.
//
// Width of the soft edge on the sweeping reveal, as a percentage of the
// viewport. Wide on purpose — this is the whole effect now, not a trim.
const REVEAL_FEATHER_PCT = 26;
// Each slide still drifts horizontally, but a fraction of a viewport instead of
// a full one, so the transition keeps a direction and a sense of travel without
// reading as a rectangle being pushed across. 0.1 = ~144px at 1440.
const REVEAL_DRIFT_RATIO = 0.1;

// ScrollToPlugin drives the mobile section panel's jump-to-section (see
// navigateToChapter), rather than the native `window.scrollTo({behavior:
// "smooth"})` the pointer deck uses, for two reasons the pointer deck doesn't
// have: the jump can cross the entire page (Introduction to Observability is a
// dozen slides), so a controlled 0.8s duration beats the browser's own
// unspecified one; and the scroll-spy has to stay frozen for exactly as long
// as the scroll lasts, which needs a real completion callback — `scrollend` is
// a guess with a timeout behind it, `onComplete`/`onInterrupt` are not. Same
// plugin, same job, same 0.8s/power2.inOut as the desktop SectionRail's own
// click-to-jump, so both rails jump with one feel.
gsap.registerPlugin(ScrollToPlugin);

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
//     touch stacks the slides in normal document flow with a fixed 48px gap
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
  // True while a tap on the mobile section panel is scrolling the page. The
  // scroll-spy below ignores everything during that window: a jump from
  // Introduction to Observability crosses a dozen slides, and letting the
  // observer report each one in turn flickers the pill's label AND its
  // adaptive colour the whole way down. Cleared by the scroll tween itself
  // (see navigateToChapter), so it can't be left stuck on.
  const programmaticScroll = useRef(false);
  // The in-flight jump tween, so a second tap (or unmount) can kill it rather
  // than leaving two tweens fighting over one scroll position.
  const scrollTween = useRef<gsap.core.Tween | null>(null);
  // Masked slide transition: one ref per stacked slide, plus the last
  // visibility state written for each so a settled deck stops writing styles
  // entirely instead of re-hiding fourteen already-hidden slides every frame.
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slideHiddenRef = useRef<boolean[]>([]);
  const reduceMotionRef = useRef(false);
  const { isDark } = useTheme();
  const { setInvertSurface } = useHeaderInvertSurface();

  // Tell the global Header to invert its chrome whenever the active slide is an
  // "invert" surface (the chapter-intro slides), so the header matches the
  // slide instead of leaving global-theme chrome stranded over an inverted
  // card. POINTER ONLY: on the desktop deck the whole viewport is the one
  // active slide, so inverting the header is correct. On the touch stack the
  // header sits over whatever's scrolled to the TOP — not necessarily the
  // "active" (scroll-spy) slide — so inverting it turns the mobile gradient
  // scrim dark over a still-light section above the intro. Mobile keeps the
  // header (and its white scrim) at the global theme. Cleanup resets it on
  // slide change and when the reader leaves the deck.
  useEffect(() => {
    setInvertSurface(!isTouch && SLIDE_RAIL_MODE[activeIndex] === "invert");
    return () => setInvertSurface(false);
  }, [activeIndex, isTouch, setInvertSurface]);

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

  // Rail click handler. The rail reports a CHAPTER id; this resolves it to
  // that chapter's FIRST slide. Chapters and slides stopped being 1:1 once
  // Council grew to eight slides, so the rail can no longer hand over an
  // index — see the onNavigate note in SegmentedRail.tsx.
  //
  // Touch needs a different mechanism entirely, not just a different target:
  // `navigateTo` scrolls the pointer deck's own scroll container, which doesn't
  // exist on the touch branch (scrollRef is null there), so this used to be a
  // silent no-op on mobile — the section panel had nothing to call. On touch
  // the slides are ordinary document flow, so scroll the WINDOW to the slide
  // wrapper's own offset instead, less the header height so the section
  // doesn't land underneath it. Uses mobileSlideRefs (already index-aligned
  // and already populated for the scroll-spy) rather than looking up a DOM id
  // — the wrappers carry no id, and the slides' own ids belong to the slide
  // components, not these wrappers.
  const navigateToChapter = useCallback(
    (chapterId: string) => {
      const first = SLIDE_CHAPTER_IDS.indexOf(
        chapterId as (typeof SLIDE_CHAPTER_IDS)[number]
      );
      if (first === -1) return;

      if (!isTouch) {
        navigateTo(first);
        return;
      }

      const el = mobileSlideRefs.current[first];
      if (!el) return;

      // Set the destination's chapter immediately and freeze the spy for the
      // duration of the tween, so the pill reads the section you asked for the
      // whole way there instead of ticking through every slide in between.
      //
      // Handing control back mid-flight is done with a real touchstart/wheel
      // listener, NOT ScrollToPlugin's `autoKill`. autoKill infers "the reader
      // grabbed the page" by comparing the scroll position it reads back each
      // tick against the one it just wrote — and iOS updates scroll position
      // off the main thread, so those two routinely disagree through no fault
      // of the reader. On iPhone (Safari and Chrome alike, both WebKit) that
      // made every jump die a few frames in: the page would start moving
      // toward the section and stop well short of it. A touch or a wheel event
      // is the thing actually being inferred, so listen for it directly.
      // Kill any previous jump FIRST: that fires its onInterrupt, which runs
      // the old release — including clearing the spy guard. Setting the guard
      // before this would have it immediately unset by the tween we cancelled,
      // leaving the new jump unguarded on a fast second tap.
      scrollTween.current?.kill();
      programmaticScroll.current = true;
      setActiveIndex(first);

      const cancel = () => scrollTween.current?.kill();
      const release = () => {
        programmaticScroll.current = false;
        scrollTween.current = null;
        window.removeEventListener("touchstart", cancel);
        window.removeEventListener("wheel", cancel);
      };

      scrollTween.current = gsap.to(window, {
        duration: 0.8,
        ease: "power2.inOut",
        scrollTo: { y: el, offsetY: headerHeight },
        onComplete: release,
        onInterrupt: release,
      });
      // Attached after the tween starts, so the tap that opened this jump —
      // whose own touchstart has already fired by the time click runs — can't
      // cancel the very scroll it asked for.
      window.addEventListener("touchstart", cancel, { passive: true });
      window.addEventListener("wheel", cancel, { passive: true });
    },
    [navigateTo, isTouch, headerHeight]
  );

  // Leaving the page mid-jump kills the tween, whose onInterrupt runs the same
  // release that detaches its listeners — otherwise a tween and two window
  // listeners outlive the component that started them.
  useEffect(
    () => () => {
      scrollTween.current?.kill();
    },
    []
  );

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
      const pos = progress * (slides - 1);
      const index = Math.round(pos);
      if (index !== activeIndexRef.current) setActiveIndex(index);

      // --- masked reveal -------------------------------------------------
      // Per slide, `d` is its signed distance from the current position: 0 when
      // it is the one being read, -1 when it is the next one up, +1 when it has
      // just been passed. `t` is how far THIS slide has been revealed, so it
      // climbs 0 -> 1 as the reader crosses from the slide before it, and then
      // stays at 1 while it sits underneath whatever comes next.
      //
      // Exactly two slides are ever live: the one being revealed and the one
      // showing through it. Everything else is `visibility: hidden` — with
      // sixteen full-viewport slides now stacked on one another rather than
      // queued side by side, leaving them all painted would be sixteen
      // overlapping layers instead of one.
      //
      // Smoothstep rather than the house cubic-bezier(0.22, 1, 0.36, 1): that
      // curve is an ease-OUT for a state change with a start and an end, and
      // this value is scrubbed, so it wants a symmetric ease-in-out.
      const drift = sc.clientWidth * REVEAL_DRIFT_RATIO;
      const hidden = slideHiddenRef.current;
      for (let i = 0; i < slides; i++) {
        const el = slideRefs.current[i];
        if (!el) continue;
        const d = pos - i;

        if (d <= -1 || d >= 1) {
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

        // Clamped BEFORE the smoothstep, which is only defined on [0, 1]:
        // a slide already passed has d > 0, so an unclamped d + 1 feeds it
        // values above 1, where the polynomial turns back downward and even
        // goes negative. That put a spurious, reversing mask on the OUTGOING
        // slide — it would have dissolved out from under the incoming one
        // instead of sitting solid behind it.
        const linear = Math.min(1, Math.max(0, d + 1));
        // Reduced motion keeps the deck usable but removes the animation
        // outright: a hard swap at the halfway point and no drift. There is no
        // reduced form of "a mask sweeping across the screen" that is not still
        // a mask sweeping across the screen.
        const t = reduceMotionRef.current
          ? linear < 0.5
            ? 0
            : 1
          : linear * linear * (3 - 2 * linear);

        el.style.transform = reduceMotionRef.current
          ? "none"
          : `translate3d(${((i - pos) * drift).toFixed(1)}px, 0, 0)`;

        if (t >= 1) {
          // Fully revealed — drop the mask rather than leave a fully-open one
          // applied, so the slide being read carries no render surface at all.
          // That matters beyond cost: a masked ancestor forces its subtree onto
          // a render surface, and ProductSlide's <video> is a promoted,
          // continuously-animating layer, so it only sits inside a mask for the
          // length of a transition and never at rest. If a flicker ever shows
          // on real hardware, start here. Hero is exempt either way — as slide
          // 0 nothing precedes it, so its `t` is always 1 and its
          // .hero-zoom-loop layer is never masked at all.
          el.style.maskImage = "none";
          el.style.setProperty("-webkit-mask-image", "none");
          continue;
        }

        // The reveal edge travels from just past the right edge to just past
        // the left, so the slide is fully hidden at t=0 and fully open at t=1
        // without either end clipping the feather.
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

    // Reduced motion kills the feather outright rather than shortening it. The
    // rail's panel (SegmentedRail) degrades instead of disabling because its
    // animation carries information; this one is purely ornamental softening
    // layered over travel that continues either way, so there is no reduced
    // form of it worth keeping. matchMedia rather than Motion's
    // useReducedMotion, matching how this same file already reads the
    // touch/pointer query — CLAUDE.md keeps scroll-scrubbed work out of Motion.
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onReduceChange = () => {
      reduceMotionRef.current = reduceQuery.matches;
      sync();
    };
    // Also performs the initial sync — setting the transform, and the correct
    // at-rest mask state, before the first scroll event.
    onReduceChange();

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
    reduceQuery.addEventListener("change", onReduceChange);
    // Recompute the transform when the container is resized (its width, and so
    // the per-slide pixel step, changes).
    const observer = new ResizeObserver(sync);
    observer.observe(sc);
    return () => {
      sc.removeEventListener("scroll", sync);
      window.removeEventListener("keydown", onKey);
      reduceQuery.removeEventListener("change", onReduceChange);
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
        if (programmaticScroll.current) return;
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

  // "follow" tracks the toggle (dark page → on-dark ticks); "invert" is the
  // opposite (dark page → light slide → on-light ticks); "fixed-dark" is
  // always on-dark (Hero's static illustration).
  const railMode = SLIDE_RAIL_MODE[activeIndex];
  const railTheme =
    railMode === "fixed-dark"
      ? "on-dark"
      : railMode === "invert"
        ? isDark
          ? "on-light"
          : "on-dark"
        : isDark
          ? "on-dark"
          : "on-light";

  // The deck fills the WHOLE viewport (not the below-header remainder) and is
  // pulled up behind the header — see the scroll container's marginTop below.
  const stageHeight = "100dvh";

  return (
    <>
      {isTouch ? (
        // Touch: free-scrolling vertical stack, each slide sized to its own
        // content with a fixed 48px gap between slides. bg-bg-primary on each
        // wrapper matches its slide's own background.
        <div className="flex w-full flex-col gap-48px">
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
          // The deck fills the whole viewport and is pulled UP behind the
          // sticky Header (marginTop: -headerHeight), so each full-height slide
          // extends under the transparent header and the slide's own
          // background covers the header zone. This is how the reference
          // (zainabkabira.com) keeps the header seamless across a horizontal
          // slide between a light and a dark panel: the split IS the panels
          // showing through a transparent fixed nav, not the nav painting a
          // band that can only be one colour at a time. The header just swaps
          // its chrome colour (Header.tsx / invertSurface). Content still
          // centres on the true viewport centre — the stage is now the full
          // viewport. `--fr-header-h` is re-exposed so TOP-ANCHORED slides
          // (Product, Hero — content that starts at the top rather than
          // centring) can pad their content down by the header height and not
          // be overlapped by the transparent header; centred slides don't need
          // it (their content sits at ~50dvh, clear of the header).
          style={
            {
              height: stageHeight,
              marginTop: -headerHeight,
              "--fr-header-h": `${headerHeight}px`,
            } as React.CSSProperties
          }
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
              {/* Slides are STACKED, every one filling the whole pinned
                  viewport, rather than queued side by side in a row. That is
                  what lets a transition dissolve instead of slide: what shows
                  through the incoming slide's mask is the outgoing slide
                  itself. Position, mask and visibility are all written per
                  slide from sync(), imperatively — outside React's managed
                  style props, so an activeIndex re-render can't clobber them
                  mid-transition (the same rule the old row transform followed).

                  z-index is the one thing set declaratively, because it never
                  changes: a later slide always stacks above an earlier one, so
                  the incoming slide is the one carrying the mask and the
                  outgoing one simply shows through it. It also means no
                  backdrop layer is needed — an earlier attempt had to mirror
                  every slide's background behind the mask because a masked
                  slide revealed the page instead of its neighbour. Stacked,
                  the neighbour IS what's behind, so the two chapter-intro
                  slides that invert their background need no special case at
                  all. */}
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
                      style={{ zIndex: index }}
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
        activeId={SLIDE_CHAPTER_IDS[activeIndex]}
        pillContext={pillContext}
        onNavigate={navigateToChapter}
        theme={railTheme}
        // Same touch signal as the layout branch above, so the rail (pointer)
        // vs. status pill (touch) choice always matches which stage is
        // actually rendered.
        variant={isTouch ? "pill" : "rail"}
      />
    </>
  );
}
