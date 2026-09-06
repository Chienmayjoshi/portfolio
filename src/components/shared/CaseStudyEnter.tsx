"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import type { EnterTitleLines } from "@/components/shared/caseStudyEnterLines";

// Case study entrance: a large centered headline builds letter-by-letter, then
// its words fly into the real <h1> on the page while the rest of the intro
// stages in behind them.
//
// Source of truth: Figma node 7438:44091 ("case study enter animation"). Frames
// 1-3 are the build; frame 4 is the landed intro page. Reference for the build's
// register is wondermake.xyz's hero (per-char stagger; their h1 splits to both
// words and chars). The snap is NOT from that reference - it exists because the
// Figma overlay and the shipped hero break the same sentence at different
// points ("Enterprise AI teams were / flying blind on every / model decision."
// vs. ".../ flying blind on every model / decision."). The word SEQUENCE is
// identical either way, so pairing overlay word i to target word i is
// unambiguous, and "model" migrating up a line is the point rather than a bug.
//
// GSAP rather than Motion, which is a deliberate exception to CLAUDE.md's
// "Motion for mount-time" split: this is one choreographed timeline, not a
// React state transition, and SplitText does the splitting for free (it ships
// in the public gsap package since 3.13 - no new dependency). Nothing but GSAP
// touches these elements, so the "never mix on one element" rule still holds.
//
// The FLIP is hand-rolled rather than done with the Flip plugin. Flip.fit()
// would fit box-to-box with scaleX/scaleY, and the overlay/target line-heights
// aren't in exactly the same ratio as their font sizes - that would distort the
// glyphs. A single uniform scale (targetFontSize / overlayFontSize) about a
// "0 0" origin is exact, because letterSpacing below is set in `em` so widths
// scale proportionally too.
gsap.registerPlugin(SplitText);

// useLayoutEffect, not the repo's usual useEffect-for-GSAP: the first thing
// this does is hide the page's own title and intro blocks, and useEffect would
// let one fully-visible frame paint first. The other GSAP call sites are all
// scroll-driven, where a frame doesn't matter.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// The hero is `tracking-[-1.2px]` at 68px. Expressed in em so the overlay's
// tracking scales with its font size and the uniform FLIP scale stays exact.
const TRACKING_EM = -1.2 / 68;

// Glyph-box measurement, used on both sides of the FLIP.
//
// A Range's rect is the font's em box (ascent + descent), not the line box, so
// it scales exactly with font-size and its top sits a fixed distance above the
// baseline. That makes "align the tops" and "align the baselines" the same
// statement, and makes the scale factor fall out of the two heights - no
// leading, letter-spacing or font-size rounding to correct for.
//
// It also measures the target without touching its DOM. Splitting the real
// <h1> to measure it was the first approach and it was wrong twice over: it
// hands React a half-rewritten heading, and SplitText has to wrap each word in
// an inline-block, whose box snaps to whole pixels - so a line's words drift
// progressively rightward, up to 7px by the end of a line here, which lands as
// a visible ghost against the real title.
function rectOfRange(node: Node, start: number, end: number) {
  const range = document.createRange();
  range.setStart(node, start);
  range.setEnd(node, end);
  return range.getBoundingClientRect();
}

/** Per-word or per-char glyph boxes of an element, leaving its DOM alone. */
function measureText(root: HTMLElement, unit: Pairing) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const out: DOMRect[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = node.nodeValue ?? "";
    // \S+ per word / \S per char matches how SplitText counts them: runs of
    // non-whitespace, with the spaces between them belonging to neither.
    const pattern = unit === "chars" ? /\S/g : /\S+/g;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text))) {
      out.push(rectOfRange(node, match.index, match.index + match[0].length));
    }
  }
  return out;
}

/** Glyph box of one already-split element, unioned over its text nodes. */
function textRect(el: HTMLElement) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = node.nodeValue ?? "";
    if (!text.trim()) continue;
    const box = rectOfRange(node, 0, text.length);
    left = Math.min(left, box.left);
    top = Math.min(top, box.top);
    right = Math.max(right, box.right);
    bottom = Math.max(bottom, box.bottom);
  }
  return { left, top, right, bottom, width: right - left, height: bottom - top };
}

export type RevealStyle = "mask-up" | "blur-fade" | "y-fade";
export type Pairing = "words" | "chars";

export interface CaseStudyEnterConfig {
  // (a) the build
  revealStyle: RevealStyle;
  charDuration: number;
  charStagger: number;
  charEase: string;
  charShift: number; // yPercent
  charBlur: number; // px, blur-fade only
  // (b) the hold before it moves
  hold: number;
  // (c) the snap
  pairing: Pairing;
  flipDuration: number;
  flipEase: string;
  flipLead: number; // per-item delay, so it reads as a flock
  // (d) handoff to the real title
  handoff: number;
  // overlay type - Figma-derived estimates, tuned in /lab/case-study-enter
  fontSize: number;
  lineHeight: number;
  boxWidth: number;
  // (e) staged reveal of eyebrow / tldr + metadata / cockpit
  stageDuration: number;
  stageOffset: number;
  stageShift: number;
  stageEase: string;
}

// Starting values. fontSize/lineHeight/boxWidth come from the outlined vectors
// in Figma frames 1-3: a 940px box centered in a 1440 frame, 96px line spacing,
// and line 1 "Enterprise AI teams were" measuring 884.3px. The title is
// outlined there so no text style is readable - 78.5px is solved from that
// width, measured in-browser against the real Season Mix face (it renders
// 884.6px, i.e. Figma's line to within half a pixel).
//
// Note this is NOT proportional to the hero: the overlay is 78.5/96 (ratio
// 1.22) where the hero is 68/76 (1.12), so the big title is deliberately more
// loosely leaded. An earlier estimate of 86px came from assuming that ratio
// held; it doesn't, and 86 overflows the 940 box by 29px.
// The build values below are TUNED, signed off 2026-09-06 from
// /lab/case-study-enter — not guesses. Notably charEase is back.out(1.4), so
// characters overshoot slightly past their resting line and settle back; the
// 96px leading over 78.5px type absorbs the overshoot inside the line's mask.
// charBlur only applies to the blur-fade reveal and is inert at the mask-up
// default; it's kept so switching reveal styles in the lab starts somewhere
// sensible.
export const ENTER_DEFAULTS: CaseStudyEnterConfig = {
  revealStyle: "mask-up",
  charDuration: 0.72,
  charStagger: 0.036,
  charEase: "back.out(1.4)",
  charShift: 85,
  charBlur: 8,
  hold: 0.3,
  pairing: "words",
  flipDuration: 0.72,
  flipEase: "power3.inOut",
  flipLead: 0.012,
  handoff: 0.1,
  fontSize: 78.5,
  lineHeight: 96,
  boxWidth: 940,
  stageDuration: 0.4,
  stageOffset: 0.06,
  stageShift: 8,
  stageEase: "power2.out",
};

interface CaseStudyEnterProps {
  /**
   * Overlay copy, one array of lines per breakpoint. Both are rendered and CSS
   * decides which is visible; the timeline animates whichever one that is.
   */
  lines: EnterTitleLines;
  /** The real <h1> the words land on. */
  targetSelector?: string;
  /** Blocks that stage in after the landing, grouped by attribute value. */
  stageSelector?: string;
  /**
   * The element that scrolls, when it isn't the document. The slide deck
   * scrolls an inner container, so locking the body there would lock nothing
   * and `window.scrollTo` would reset nothing.
   */
  scrollerSelector?: string;
  /** Change this to (re)play. 0 / falsy = idle. */
  active: number;
  config?: Partial<CaseStudyEnterConfig>;
  onFinish?: () => void;
  /**
   * Handed the timeline once it's built, and null when it's torn down. Exists
   * so the lab harness can scrub it; production passes nothing.
   */
  onTimeline?: (tl: gsap.core.Timeline | null) => void;
}

export default function CaseStudyEnter({
  lines,
  targetSelector = "[data-enter-title]",
  stageSelector = "[data-enter-stage]",
  scrollerSelector,
  active,
  config,
  onFinish,
  onTimeline,
}: CaseStudyEnterProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // `active` is the only dependency, deliberately: the effect closes over
  // whatever config and callbacks were current on the render that changed it.
  // A config change on its own therefore does NOT re-run this - which is the
  // behaviour we want twice over. Tearing down a running timeline because
  // someone dragged a slider would make the thing unjudgeable, and
  // re-rendering the overlay mid-animation would hand React a subtree that
  // SplitText currently owns. Changes land on the next play instead.
  //
  // (The latest-ref workaround for this is worse and React 19 lints against
  // it: writing a ref during render mutates state a discarded render should
  // not have touched.)
  useIsoLayoutEffect(() => {
    if (!active) return;

    const overlay = overlayRef.current;
    const target = document.querySelector<HTMLElement>(targetSelector);
    if (!overlay || !target) return;

    const cfg: CaseStudyEnterConfig = { ...ENTER_DEFAULTS, ...config };
    const stages = Array.from(
      document.querySelectorAll<HTMLElement>(stageSelector)
    );
    // Both breakpoint sets are in the DOM; only one has boxes. Animate that
    // one - `md` and `base` differ in where they break, so splitting the
    // display:none set would measure zeroes and fling every word to 0,0.
    const lineEls = Array.from(
      overlay.querySelectorAll<HTMLElement>("[data-enter-overlay-line]")
    ).filter((el) => el.getClientRects().length > 0);
    const box = overlay.querySelector<HTMLElement>("[data-enter-overlay-box]");
    if (!box || lineEls.length === 0) return;

    let cancelled = false;
    let tl: gsap.core.Timeline | null = null;
    let split: SplitText | null = null;

    // Scroll lock. Which element scrolls depends on the layout: the vertical
    // case study scrolls the document, the slide deck scrolls an inner
    // container. Locking the document only matters for the first - and only
    // there does it change the viewport width, by removing the scrollbar,
    // which would shift every centred element including the target the words
    // are flying at. Pad the document and the fixed overlay by what the
    // scrollbar was taking so nothing moves. 0 on macOS overlay scrollbars.
    // An inner scroller's own scrollbar is inside the viewport, so nothing
    // outside it moves and there is nothing to compensate for.
    const scroller = scrollerSelector
      ? document.querySelector<HTMLElement>(scrollerSelector)
      : null;
    const lockTarget = scroller ?? document.body;
    const scrollbar = scroller
      ? 0
      : window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = lockTarget.style.overflow;
    const prevPadding = lockTarget.style.paddingRight;

    const restore = () => {
      gsap.set(overlay, { autoAlpha: 0, clearProps: "paddingRight" });
      gsap.set([target, ...stages], { clearProps: "opacity,transform" });
      gsap.set(lineEls, { clearProps: "overflow,whiteSpace" });
      lockTarget.style.overflow = prevOverflow;
      lockTarget.style.paddingRight = prevPadding;
      split?.revert();
      split = null;
    };

    // Hide the landing state before anything paints.
    gsap.set([target, ...stages], { opacity: 0 });

    if (scroller) scroller.scrollTop = 0;
    else window.scrollTo(0, 0);
    lockTarget.style.overflow = "hidden";
    if (scrollbar > 0) {
      lockTarget.style.paddingRight = `${scrollbar}px`;
      gsap.set(overlay, { paddingRight: scrollbar });
    }

    // Reduced motion: hard cut. Same call as the deck's dissolve
    // (fastrouter-slides/page.tsx) - this is ornament over a navigation that
    // happens anyway, so there is no reduced form of it worth keeping.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      restore();
      onFinish?.();
      return;
    }

    const run = async () => {
      // Season Mix is display:swap and self-hosted. Measuring before it lands
      // would measure the fallback face and the words would fly to the wrong
      // boxes.
      try {
        await document.fonts.ready;
      } catch {
        /* older browsers - fall through and measure what's there */
      }
      if (cancelled) return;

      // ...and then wait for the page under us to stop moving. Fonts being
      // ready is not the same as the layout being final: the page this lands
      // on is still running its own mount effects, and any of them that change
      // layout move the target after we'd have measured it.
      //
      // This is not hypothetical. The slide deck initialises its header height
      // to a 64px fallback and then measures the real header at 74px, which
      // feeds a marginTop that pulls the whole deck up by the 10px difference.
      // Measuring before that landed sent every word exactly 10px too low.
      //
      // It only bit on the real navigation, which is worth remembering: a full
      // page load resolves fonts.ready LATE, after those effects, so the race
      // was already won. A card click is a client-side navigation with the
      // fonts cached, so fonts.ready resolves immediately and measurement got
      // there first. The lab, always entered by URL, never saw it.
      //
      // setTimeout rather than rAF so this still runs in a backgrounded tab,
      // where rAF is frozen and this would otherwise hang forever.
      const settled = await (async () => {
        let previous = target.getBoundingClientRect();
        const deadline = performance.now() + 400;
        while (performance.now() < deadline) {
          await new Promise((resolve) => setTimeout(resolve, 16));
          if (cancelled) return false;
          const next = target.getBoundingClientRect();
          if (
            Math.abs(next.top - previous.top) < 0.5 &&
            Math.abs(next.left - previous.left) < 0.5 &&
            Math.abs(next.width - previous.width) < 0.5
          ) {
            return true;
          }
          previous = next;
        }
        // Something is animating the target continuously. Measure anyway - a
        // slightly-off landing beats never playing.
        return true;
      })();
      if (!settled || cancelled) return;

      // Overlay type. Applied imperatively rather than as JSX style so that
      // config lives in a ref (see above) and the overlay never re-renders
      // while SplitText owns its children.
      //
      // The lines are nowrap and the font is then sized so the widest of them
      // fits the box - so the arrangement in caseStudyEnterLines.ts is what
      // renders, at every width, exactly. An earlier version scaled the font by
      // the box's own shrink with a 28px floor, which is not the same thing:
      // once the floor engaged the type stopped shrinking, the widest line no
      // longer fit, and it wrapped - putting "were" alone on its own line and
      // turning a designed three-line title into a ragged four.
      const boxWidth = Math.min(
        cfg.boxWidth,
        document.documentElement.clientWidth - 48
      );
      gsap.set(lineEls, { whiteSpace: "nowrap" });
      gsap.set(box, {
        width: "max-content",
        fontSize: cfg.fontSize,
        lineHeight: `${cfg.lineHeight}px`,
        letterSpacing: `${TRACKING_EM}em`,
      });
      // max-content first so each line reports its true unwrapped width.
      const widest = Math.max(
        ...lineEls.map((el) => el.getBoundingClientRect().width)
      );
      const fit = widest > 0 ? Math.min(1, boxWidth / widest) : 1;
      const fontSize = cfg.fontSize * fit;
      const lineHeight = cfg.lineHeight * fit;
      gsap.set(box, {
        width: boxWidth,
        fontSize,
        lineHeight: `${lineHeight}px`,
      });
      gsap.set(overlay, { autoAlpha: 1 });

      split = new SplitText(lineEls, {
        type: "words,chars",
        wordsClass: "enter-word",
        charsClass: "enter-char",
      });
      const words = split.words as HTMLElement[];
      const chars = split.chars as HTMLElement[];

      // Measure everything at rest, before a single tween exists - gsap.from()
      // applies its start values immediately, so any measurement taken after
      // the build is added would read a displaced position.
      const movers = cfg.pairing === "chars" ? chars : words;
      const spanBoxes = movers.map((el) => el.getBoundingClientRect());
      const glyphBoxes = movers.map(textRect);
      const toBoxes = measureText(target, cfg.pairing);

      // If the overlay copy and the hero copy ever drift apart, pairing by
      // index is meaningless - cut rather than fling words at wrong targets.
      if (movers.length !== toBoxes.length) {
        console.warn(
          `[CaseStudyEnter] overlay has ${movers.length} ${cfg.pairing} but the target has ${toBoxes.length}. Skipping the animation.`
        );
        restore();
        onFinish?.();
        return;
      }

      const finish = () => {
        restore();
        onFinish?.();
      };

      tl = gsap.timeline({ onComplete: finish });
      onTimeline?.(tl);

      // (a) the build
      if (cfg.revealStyle === "mask-up") {
        // Each line clips its own overflow so chars rise out of the baseline.
        // Cleared again at the snap, or it would clip the words in flight.
        gsap.set(lineEls, { overflow: "hidden" });
        tl.from(
          chars,
          {
            yPercent: cfg.charShift,
            duration: cfg.charDuration,
            ease: cfg.charEase,
            stagger: { each: cfg.charStagger, from: "start" },
          },
          0
        );
      } else if (cfg.revealStyle === "blur-fade") {
        tl.from(
          chars,
          {
            opacity: 0,
            yPercent: cfg.charShift * 0.25,
            filter: `blur(${cfg.charBlur}px)`,
            duration: cfg.charDuration,
            ease: cfg.charEase,
            stagger: { each: cfg.charStagger, from: "start" },
          },
          0
        );
      } else {
        tl.from(
          chars,
          {
            opacity: 0,
            yPercent: cfg.charShift * 0.25,
            duration: cfg.charDuration,
            ease: cfg.charEase,
            stagger: { each: cfg.charStagger, from: "start" },
          },
          0
        );
      }

      const buildEnd = tl.duration();
      // Don't leave blur(0px) on 50+ elements - that's 50+ composited layers
      // for no reason once the build has landed.
      tl.set(chars, { clearProps: "filter" }, buildEnd);

      // (b) hold, then (c) the snap
      const snapAt = buildEnd + cfg.hold;
      tl.set(lineEls, { overflow: "visible" }, snapAt);
      // Safe to re-origin here: at this point the transform is a pure
      // translation, which transform-origin doesn't affect.
      tl.set(movers, { transformOrigin: "0 0" }, snapAt);

      // One uniform scale has to serve every word, and no single value can be
      // exact: text drawn at 79px and then transform-scaled to 68px is not the
      // same shape as text drawn at 68px, because glyph advances and
      // letter-spacing round independently at each size. Measured here the
      // per-word ratio that would be exact ranges 0.833 to 0.861.
      //
      // So fit the scale to what's actually rendered - the median of the
      // per-word width ratios - rather than deriving it from the font sizes.
      // The font-size ratio looks more principled and is measurably worse:
      // glyph-box heights come back rounded to whole pixels (97 for a true
      // 97.57 here), which alone puts it 0.6% out, and it optimises height,
      // which nobody can see, at the expense of width, which shows as a ghost
      // along the trailing edge of the longest words. Median because the
      // outliers are single-glyph rounding artefacts, not signal.
      //
      // The residue is a few px at the end of the widest word, for the ~100ms
      // of the handoff crossfade. Landing positions themselves are exact.
      const ratios = glyphBoxes
        .map((glyph, i) => toBoxes[i].width / glyph.width)
        .filter((ratio) => Number.isFinite(ratio) && ratio > 0)
        .sort((a, b) => a - b);
      const scale = ratios.length
        ? ratios[Math.floor(ratios.length / 2)]
        : toBoxes[0].height / glyphBoxes[0].height;
      movers.forEach((el, i) => {
        // The element scales about its own top-left (transformOrigin 0 0), but
        // what has to land on the target is the glyph box inside it, which sits
        // at some offset within that element and scales along with it. Solve
        // for the translate that puts the glyph box where the target's is:
        //   glyphLands = span + translate + scale * (glyph - span)
        const span = spanBoxes[i];
        const glyph = glyphBoxes[i];
        const to = toBoxes[i];
        tl!.to(
          el,
          {
            x: to.left - span.left - scale * (glyph.left - span.left),
            y: to.top - span.top - scale * (glyph.top - span.top),
            scale,
            duration: cfg.flipDuration,
            ease: cfg.flipEase,
          },
          snapAt + i * cfg.flipLead
        );
      });

      // (d) handoff. The real title goes fully opaque the instant the words
      // land on it, then the whole overlay (including the plate hiding the
      // page) dissolves off the top of it. Two aligned copies of the same
      // glyphs crossfading reads as nothing at all - and if the landing is
      // even slightly off, this is what forgives it.
      const flipEnd =
        snapAt + cfg.flipDuration + (movers.length - 1) * cfg.flipLead;
      tl.set(target, { opacity: 1 }, flipEnd);
      tl.to(overlay, { autoAlpha: 0, duration: cfg.handoff }, flipEnd);

      // (e) the rest of the intro, grouped by data-enter-stage value.
      const groups = new Map<string, HTMLElement[]>();
      stages.forEach((el) => {
        const key = el.dataset.enterStage ?? "1";
        groups.set(key, [...(groups.get(key) ?? []), el]);
      });
      [...groups.keys()]
        .sort((a, b) => Number(a) - Number(b))
        .forEach((key, gi) => {
          tl!.fromTo(
            groups.get(key)!,
            { opacity: 0, y: cfg.stageShift },
            {
              opacity: 1,
              y: 0,
              duration: cfg.stageDuration,
              ease: cfg.stageEase,
            },
            flipEnd + cfg.handoff * 0.6 + gi * cfg.stageOffset
          );
        });
    };

    run();

    return () => {
      cancelled = true;
      tl?.kill();
      // Defensive kill before restore, matching SectionRail's convention - a
      // fast Replay must supersede the previous run, not fight it.
      gsap.killTweensOf(overlay.querySelectorAll("*"));
      restore();
      onTimeline?.(null);
    };
  }, [active, targetSelector, stageSelector, scrollerSelector]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      // Plain divs, not a heading: this is a duplicate of copy that already
      // exists in the page's real <h1>, and it should carry no SEO or a11y
      // weight. bg-bg-primary so it covers the hidden page in both themes.
      //
      // z-40 sits UNDER the Header (sticky z-50) on purpose - Figma frames 1-3
      // show the nav present for the whole build, and at z-50 this would win on
      // DOM order and cover it. Above SegmentedRail (z-20), which should stay
      // out of the way until the page has landed.
      className="fixed inset-0 z-40 flex items-center justify-center bg-bg-primary"
      style={{ visibility: "hidden", opacity: 0 }}
    >
      <div
        data-enter-overlay-box
        className="font-display text-text-primary"
      >
        {/* Both breakpoint sets render; CSS picks one, the effect animates
            whichever it finds boxes for. Duplicating the sentence costs
            nothing here - the whole layer is aria-hidden and the real <h1>
            carries the one copy that counts. */}
        <div className="md:hidden">
          {lines.base.map((line) => (
            <div key={line} data-enter-overlay-line>
              {line}
            </div>
          ))}
        </div>
        <div className="hidden md:block">
          {lines.md.map((line) => (
            <div key={line} data-enter-overlay-line>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
