"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import GridDepthLayer from "@/components/shared/GridDepthLayer";
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
  // (d2) the decorations: dot field, three bots, the eye
  burstStart: number; // fraction of the build to start drifting at
  burstDistance: number; // px of outward drift, at the 78.5px reference scale
  burstSpin: number; // deg added to each element's rest rotation over the drift
  burstEase: string;
  blink: number; // seconds for the eye's one blink
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
  burstStart: 0.5,
  burstDistance: 90,
  burstSpin: 6,
  burstEase: "power1.out",
  blink: 0.26,
  stageDuration: 0.4,
  stageOffset: 0.06,
  stageShift: 8,
  stageEase: "power2.out",
};

// Decorations, from Figma node 7485:26879 — the entrance's updated frame: a
// dot field behind everything, three "claudecode" bots scattered around the
// title, and the eye sitting at the end of the last line.
//
// Positions are element CENTRES as a fraction of the 1440x900 frame, so they
// hold their place in the composition at any viewport. Sizes and rotations are
// the nodes' own, recovered from their axis-aligned bounding boxes: a w x h box
// rotated by θ measures (w·cosθ + h·sinθ) wide, which solves to one θ and one
// scale per instance. All three tilt anticlockwise, hence the negative CSS
// rotation.
//
// The bots are one glyph at two sizes (Figma exports them as 72x61 and 47x40
// SVGs of the same path), so it is inlined once below rather than downloaded
// three times — the convention every other icon in this shell follows.
const ENTER_BOTS = [
  { left: 245.66 / 1440, top: 273.74 / 900, w: 72, h: 61, rotation: -12.3 },
  { left: 1239.37 / 1440, top: 366.45 / 900, w: 46.8, h: 39.6, rotation: -15.8 },
  { left: 639.92 / 1440, top: 640.94 / 900, w: 46.8, h: 39.6, rotation: -14.8 },
];

// The eye is placed against the TEXT, not the frame: 123.36 x 78.86 at the
// reference 78.5px type, set just past the end of the last line and centred on
// that line's em box. Anchoring it to the frame would leave it floating away
// from the sentence as soon as the box shrinks, and anchoring it to the line
// BOX (rather than the glyphs) would tie it to a line-height that is 96 here
// against Figma's 84. The 0.32em gap is solved from the frame: it puts the
// eye's centre at x=899.7 in a 1440 frame, which is where the node sits. The
// 0.273em drop is the same solve vertically: the frame puts the eye 21.4px
// below the last line's centre at 78.5px type, so it rides low against the
// baseline rather than sitting level with the x-height. Expressed against the
// GLYPHS, not the line box, so it survives this build's 96px leading where
// Figma's frame has 84.
//
// It renders as a MASK painted with `text-primary`, not as an <img>. The
// source is line art that shipped on an opaque white ground; the checked-in
// PNG is that art keyed to alpha (white -> transparent, ink -> black with the
// darkness as alpha, so the antialiased edges survive). Masking it means the
// eye takes the same colour as the headline it sits in — light art on the dark
// page, dark art on the light one — instead of carrying a white plate into
// dark mode.
const ENTER_EYE = { w: 123.36, h: 78.86, gapEm: 0.32, dropEm: 0.273 };

const EYE_MASK = "url(/images/fastrouter/fr-enter-eye.png)";

// Fixed, not tunable: the decorations are simply present in Figma's frames, and
// the fade only exists so they don't pop in on frame one.
const DECO_FADE = 0.5;

// One path, from Figma's own export (node 7485:27695), with its baked #F1F1F1
// swapped for currentColor. The fill token is `bg-light`, the nearest thing in
// the palette to that grey: it is what keeps these as a barely-there tint in
// BOTH themes, where a literal #F1F1F1 would glare on a dark page.
function EnterBotGlyph() {
  return (
    <svg
      viewBox="0 0 72 61"
      fill="currentColor"
      className="block h-full w-full"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M65.9933 30.4967H72V40.8367H66V50.93H61.0433V60.6667H56V50.93H51.0433V60.6667H46V50.93H26V60.6667H20.96V50.93H16V60.6667H10.9567V50.93H6V40.8333H0V30.5H6V0.666668H65.9933V30.4967ZM16 30.4967H20.96V21.0067H16V30.4967ZM51.0333 30.4967H56V21.0067H51.0333V30.4967Z"
      />
    </svg>
  );
}

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
    const findTarget = () =>
      document.querySelector<HTMLElement>(targetSelector);
    const findStages = () =>
      Array.from(document.querySelectorAll<HTMLElement>(stageSelector));

    // Everything found here is re-resolved once the layout settles (see
    // below). The page being landed on can replace this DOM wholesale after
    // mount - the deck swaps its entire slide structure for a touch-specific
    // one the moment it detects a coarse pointer - and a detached node
    // measures as all zeroes without erroring.
    let target = findTarget();
    if (!overlay || !target) return;

    const cfg: CaseStudyEnterConfig = { ...ENTER_DEFAULTS, ...config };
    let stages = findStages();
    // Both breakpoint sets are in the DOM; only one has boxes. Animate that
    // one - `md` and `base` differ in where they break, so splitting the
    // display:none set would measure zeroes and fling every word to 0,0.
    const lineEls = Array.from(
      overlay.querySelectorAll<HTMLElement>("[data-enter-overlay-line]")
    ).filter((el) => el.getClientRects().length > 0);
    const box = overlay.querySelector<HTMLElement>("[data-enter-overlay-box]");
    if (!box || lineEls.length === 0) return;

    const bots = Array.from(
      overlay.querySelectorAll<HTMLElement>("[data-enter-bot]")
    );
    const eye = overlay.querySelector<HTMLElement>("[data-enter-eye]");
    const decorations = [...bots, ...(eye ? [eye] : [])];

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
    let lockTarget: HTMLElement | null = null;
    let prevOverflow = "";
    let prevPadding = "";

    const unlock = () => {
      if (!lockTarget) return;
      lockTarget.style.overflow = prevOverflow;
      lockTarget.style.paddingRight = prevPadding;
      lockTarget = null;
    };

    /** Reset to the top and hold it there, on whatever currently scrolls. */
    const lock = () => {
      const scroller = scrollerSelector
        ? document.querySelector<HTMLElement>(scrollerSelector)
        : null;
      const next = scroller ?? document.body;
      if (next === lockTarget) return;
      unlock();
      lockTarget = next;
      prevOverflow = next.style.overflow;
      prevPadding = next.style.paddingRight;
      if (scroller) scroller.scrollTop = 0;
      else window.scrollTo(0, 0);
      next.style.overflow = "hidden";
      // Locking the document removes its scrollbar, which widens the viewport
      // and would shift every centred element - including the target the words
      // are flying at. Pad the document and the fixed overlay by what the
      // scrollbar was taking so nothing moves. 0 on macOS overlay scrollbars,
      // and 0 for an inner scroller, whose scrollbar is inside the viewport so
      // nothing outside it moves.
      const scrollbar = scroller
        ? 0
        : window.innerWidth - document.documentElement.clientWidth;
      if (scrollbar > 0) {
        next.style.paddingRight = `${scrollbar}px`;
        gsap.set(overlay, { paddingRight: scrollbar });
      }
    };

    /** Hide the landing state, on whichever nodes are currently mounted. */
    const hideLandingState = () => {
      gsap.set([target, ...stages].filter(Boolean), { opacity: 0 });
    };

    const restore = () => {
      gsap.set(overlay, { autoAlpha: 0, clearProps: "paddingRight" });
      gsap.set(box, { clearProps: "visibility,opacity" });
      gsap.set([target, ...stages].filter(Boolean), {
        clearProps: "opacity,transform",
      });
      gsap.set(lineEls, { clearProps: "overflow,whiteSpace" });
      // Decorations are positioned and sized imperatively, so a replay has to
      // start from nothing rather than from wherever the last run left them.
      if (decorations.length) {
        // Not `left`/`top`: the bots carry theirs from the JSX style prop, and
        // clearing an inline style React set but will not re-render would drop
        // them into the corner on the next play. The eye's are rewritten every
        // run anyway.
        gsap.set(decorations, {
          clearProps: "transform,width,height",
          opacity: 0,
        });
      }
      unlock();
      split?.revert();
      split = null;
    };

    // Before anything paints: hide the landing state, take the scroll, and put
    // the overlay's plate up. The plate goes up NOW rather than after
    // measuring, so that whatever the page does to itself while we wait for it
    // to settle happens behind a cover. Its text stays hidden until it has
    // been sized and split.
    hideLandingState();
    lock();
    gsap.set(box, { autoAlpha: 0 });
    gsap.set(overlay, { autoAlpha: 1 });

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
      // It re-queries the selector each pass rather than watching the node it
      // started with, and requires the SAME node to hold still. That is what
      // catches a swap: a detached element reports all zeroes rather than
      // throwing, so watching one would look perfectly "settled" while the
      // real target lives somewhere else entirely.
      const settledTarget = await (async () => {
        let node = target;
        let previous = node!.getBoundingClientRect();
        const deadline = performance.now() + 600;
        while (performance.now() < deadline) {
          await new Promise((resolve) => setTimeout(resolve, 16));
          if (cancelled) return null;
          const current = findTarget();
          if (!current) continue; // mid-swap; look again next pass
          const next = current.getBoundingClientRect();
          if (
            current === node &&
            Math.abs(next.top - previous.top) < 0.5 &&
            Math.abs(next.left - previous.left) < 0.5 &&
            Math.abs(next.width - previous.width) < 0.5
          ) {
            return current;
          }
          node = current;
          previous = next;
        }
        // Something is moving the target continuously. Measure anyway - a
        // slightly-off landing beats never playing.
        return findTarget();
      })();
      if (!settledTarget || cancelled) return;

      // Re-bind to whatever survived, and re-apply to it. The nodes hidden and
      // the scroller locked before the wait may both be detached by now; the
      // ones on screen are these.
      target = settledTarget;
      stages = findStages();
      hideLandingState();
      lock();

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

      // Decorations, sized and placed at rest. `decoScale` is the same shrink
      // the type just took, so the whole composition scales as one thing rather
      // than the bots staying 72px wide next to a 40px headline on a phone.
      // Sizes go on width/height rather than a transform scale, which leaves
      // GSAP's transform channel free for the drift, the rest rotation, and the
      // eye's blink (a `scale` set here would fight the blink's `scaleY`).
      const decoScale = fontSize / ENTER_DEFAULTS.fontSize;
      const overlayRect = overlay.getBoundingClientRect();
      bots.forEach((el, i) => {
        const bot = ENTER_BOTS[i];
        gsap.set(el, {
          width: bot.w * decoScale,
          height: bot.h * decoScale,
          xPercent: -50,
          yPercent: -50,
          rotation: bot.rotation,
          x: 0,
          y: 0,
          opacity: 0,
        });
      });
      if (eye) {
        const lastLine = textRect(lineEls[lineEls.length - 1]);
        const eyeWidth = ENTER_EYE.w * decoScale;
        // Clamped to stay on screen. The frame is 1440 wide and there is no
        // mobile one for these decorations; at 390 the last line very nearly
        // fills the column, so the eye's natural place — just past the end of
        // it — lands off the right edge and the deco layer's overflow clips it.
        // The clamp also leaves the drift room to happen in: it is the one
        // decoration that has to stay legible for its whole run, since the
        // blink is the beat this frame was updated for, and without that
        // margin the eye simply drifts out of frame on a phone.
        const eyeCentre = Math.min(
          lastLine.right -
            overlayRect.left +
            ENTER_EYE.gapEm * fontSize +
            eyeWidth / 2,
          overlayRect.width -
            eyeWidth / 2 -
            12 -
            cfg.burstDistance * decoScale
        );
        gsap.set(eye, {
          width: eyeWidth,
          height: ENTER_EYE.h * decoScale,
          left: eyeCentre,
          top:
            (lastLine.top + lastLine.bottom) / 2 -
            overlayRect.top +
            ENTER_EYE.dropEm * fontSize,
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 0,
          scaleY: 1,
          opacity: 0,
        });
      }

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

      // (d2) the decorations. They fade up with the first characters, drift
      // outward from half way through the build, and the eye blinks once as the
      // build lands — then the whole layer leaves with the overlay.
      //
      // The drift's DURATION is not tunable and its distance is: it always runs
      // from its start to the exact frame the overlay dissolves. A tunable
      // duration would either end early (leaving the bots parked while the
      // words are still flying) or outlive the overlay — and this timeline's
      // onComplete is what unlocks the page's scroll, so a 6-second drift
      // hanging off the end would hold the reader still long after the
      // entrance had visibly finished. Distance over that fixed window is what
      // "very slow" actually means here.
      const overlayGone = flipEnd + cfg.handoff;
      if (decorations.length) {
        tl.to(
          decorations,
          { opacity: 1, duration: DECO_FADE, ease: "power1.out" },
          0
        );
        const burstAt = buildEnd * cfg.burstStart;
        const burstDuration = Math.max(0.1, overlayGone - burstAt);
        decorations.forEach((el) => {
          // Outward from the centre of the overlay, along the vector to this
          // element's own centre — so the four of them scatter rather than all
          // sliding the same way.
          const rect = el.getBoundingClientRect();
          const dx =
            rect.left + rect.width / 2 - (overlayRect.left + overlayRect.width / 2);
          const dy =
            rect.top + rect.height / 2 - (overlayRect.top + overlayRect.height / 2);
          const length = Math.hypot(dx, dy) || 1;
          tl!.to(
            el,
            {
              x: (dx / length) * cfg.burstDistance * decoScale,
              y: (dy / length) * cfg.burstDistance * decoScale,
              rotation: `-=${cfg.burstSpin}`,
              duration: burstDuration,
              ease: cfg.burstEase,
            },
            burstAt
          );
        });
      }
      if (eye) {
        // One blink, on the beat the build finishes and before the snap — the
        // hold is what it happens inside. A squash of the whole drawing rather
        // than a lid closing over it: the asset is a single still, so this is
        // the honest version of a blink until a real one exists.
        const shut = cfg.blink * 0.45;
        tl.to(eye, { scaleY: 0.06, duration: shut, ease: "power2.in" }, buildEnd)
          .to(
            eye,
            { scaleY: 1, duration: cfg.blink - shut, ease: "power2.out" },
            buildEnd + shut
          );
      }

      // Safe to show the text now: every from() above has already applied its
      // start state, so the characters are sitting below their masks rather
      // than spelling the sentence out in full.
      gsap.set(box, { autoAlpha: 1 });

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
      {/* Decorations, behind the type. `overflow-hidden` on this layer, not on
          the overlay, so a bot drifting off the edge is clipped without also
          clipping the words in flight during the snap. */}
      <div
        data-enter-deco
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Figma's band is 1600x800 offset (-80, 50) in a 1440x900 frame —
            slightly wider than the frame and pushed down. Rendered edge to edge
            instead: the band is only meaningful because of the fade over it,
            the fade is expressed in percentages, and a hardcoded 800px-tall
            strip would be wrong on every viewport that isn't 900 tall. */}
        <GridDepthLayer variant="dots" className="absolute inset-0" />
        {ENTER_BOTS.map((bot) => (
          <div
            key={`${bot.left}-${bot.top}`}
            data-enter-bot
            className="absolute text-bg-light"
            style={{
              left: `${bot.left * 100}%`,
              top: `${bot.top * 100}%`,
              opacity: 0,
            }}
          >
            <EnterBotGlyph />
          </div>
        ))}
        <div
          data-enter-eye
          className="absolute bg-text-primary"
          style={{
            opacity: 0,
            maskImage: EYE_MASK,
            WebkitMaskImage: EYE_MASK,
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        />
      </div>

      <div
        data-enter-overlay-box
        className="relative font-display text-text-primary"
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
