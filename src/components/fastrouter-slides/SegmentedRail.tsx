"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useHeaderCaseStudyPill,
  type CaseStudyPill,
} from "@/components/shared/HeaderProvider";

interface Chapter {
  id: string;
  label: string;
  /** null = bare/unnumbered (bookend chapters — Hero, Closing) */
  number: string | null;
}

// 8 chapters, matching the doc's bundling rule: Impact/Reflections/
// Key Takeaways/Close all fold into one "Closing" segment, same mechanism
// as Council's internal fill. hero/problem/product have real content —
// every other chapter is listed (so the rail always shows the full
// 8-chapter shape) but marked not-yet-built below.
//
// Numbering/labels come from the Figma "floating section pill" scheme
// (nodes 7255:7281 / 7249:6818 / 7275:427): sequential from Hero=01, reworded
// labels. The full nine-label list is now confirmed in one place — node
// 7400:30219's expanded mobile panel spells out every section, so this table
// no longer has to hold guessed copy for the sections that lacked a frame.
// Two changes came from it, both confirmed directly: "Council" -> "LLM
// Council", and the single bundled "Closing" chapter split into "Reflections"
// and "Outcomes" (both unnumbered bookends, same as Hero). That takes the
// desktop rail from 8 ticks to 9 — expected, and accepted rather than letting
// the mobile panel keep its own divergent label set (the two label sets were
// deliberately converged onto this table once already; splitting them again
// would undo that).
const CHAPTERS: Chapter[] = [
  { id: "hero", label: "Introduction", number: "01" },
  { id: "problem", label: "The Problem", number: "02" },
  { id: "product", label: "The Product", number: "03" },
  { id: "features", label: "Feature Overview", number: "04" },
  { id: "council", label: "LLM Council", number: "05" },
  { id: "observability", label: "Observability", number: "06" },
  { id: "evaluations", label: "Evaluations", number: "07" },
  { id: "reflections", label: "Reflections", number: null },
  { id: "outcomes", label: "Outcomes", number: null },
];

const BUILT_CHAPTER_IDS = new Set([
  "hero",
  "problem",
  "product",
  "features",
  "council",
  "observability",
]);

// Both icons are inline SVGs rather than an icon-package import — this repo
// has no icon dependency at all (see Header.tsx's note: @phosphor-icons/react
// was wanted but is registry-blocked), so every icon in the portfolio shell is
// hand-inlined. Paths lifted straight from the Figma nodes (7400:30215 map,
// 7399:29688 close) with the baked #F9F9F7 fill swapped for currentColor so
// they follow the pill's own adaptive text tone instead of pinning one scheme.
function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-24px" aria-hidden="true">
      <path d="M21.4612 4.65844C21.3714 4.58843 21.2668 4.53981 21.1554 4.51626C21.0439 4.4927 20.9286 4.49484 20.8181 4.5225L15.0872 5.955L9.33563 3.07875C9.17537 2.99882 8.99181 2.97887 8.81812 3.0225L2.81812 4.5225C2.65587 4.56306 2.51183 4.65668 2.40889 4.7885C2.30595 4.92031 2.25003 5.08275 2.25 5.25V18.75C2.25002 18.864 2.27601 18.9764 2.32599 19.0788C2.37598 19.1813 2.44864 19.2709 2.53847 19.3411C2.62831 19.4112 2.73294 19.4599 2.84442 19.4836C2.95591 19.5072 3.07131 19.5051 3.18187 19.4775L8.91281 18.045L14.6644 20.9213C14.7688 20.9727 14.8836 20.9997 15 21C15.0613 21 15.1224 20.9924 15.1819 20.9775L21.1819 19.4775C21.3441 19.4369 21.4882 19.3433 21.5911 19.2115C21.694 19.0797 21.75 18.9172 21.75 18.75V5.25C21.75 5.13593 21.724 5.02336 21.674 4.92085C21.624 4.81834 21.5512 4.72859 21.4612 4.65844ZM9.75 4.96312L14.25 7.21312V19.0369L9.75 16.7869V4.96312ZM3.75 5.83594L8.25 4.71094V16.6641L3.75 17.7891V5.83594ZM20.25 18.1641L15.75 19.2891V7.33594L20.25 6.21094V18.1641Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-24px" aria-hidden="true">
      <path d="M19.2806 18.2194C19.3503 18.2891 19.4056 18.3718 19.4433 18.4628C19.481 18.5539 19.5004 18.6515 19.5004 18.75C19.5004 18.8485 19.481 18.9461 19.4433 19.0372C19.4056 19.1282 19.3503 19.2109 19.2806 19.2806C19.2109 19.3503 19.1282 19.4056 19.0372 19.4433C18.9461 19.481 18.8485 19.5004 18.75 19.5004C18.6515 19.5004 18.5539 19.481 18.4628 19.4433C18.3718 19.4056 18.2891 19.3503 18.2194 19.2806L12 13.0603L5.78063 19.2806C5.63989 19.4214 5.44902 19.5004 5.25 19.5004C5.05098 19.5004 4.86011 19.4214 4.71938 19.2806C4.57864 19.1399 4.49958 18.949 4.49958 18.75C4.49958 18.551 4.57864 18.3601 4.71938 18.2194L10.9397 12L4.71938 5.78063C4.57864 5.63989 4.49958 5.44902 4.49958 5.25C4.49958 5.05098 4.57864 4.86011 4.71938 4.71938C4.86011 4.57864 5.05098 4.49958 5.25 4.49958C5.44902 4.49958 5.63989 4.57864 5.78063 4.71938L12 10.9397L18.2194 4.71938C18.3601 4.57864 18.551 4.49958 18.75 4.49958C18.949 4.49958 19.1399 4.57864 19.2806 4.71938C19.4214 4.86011 19.5004 5.05098 19.5004 5.25C19.5004 5.44902 19.4214 5.63989 19.2806 5.78063L13.0603 12L19.2806 18.2194Z" />
    </svg>
  );
}

// Every string the collapsed/expanded pill can ever show. Rendered all at once
// as invisible sizers inside the pill's label slot (see the pill markup), which
// is what gives the pill ONE intrinsic width: the longest label wins, and the
// pill can't resize as the reader scrolls between sections or opens the panel.
// Derived from CHAPTERS rather than hardcoded, so another case study with
// longer labels gets a correspondingly wider pill for free — Figma's 186px is
// FastRouter's measurement, not a universal constant (see the pill notes).
const PILL_LABEL_SLOTS = [...CHAPTERS.map((c) => c.label), "Close"];

// Panel rows fade/rise in sequence rather than all at once, so the list reads
// as unrolling out from behind the pill rather than appearing whole. Exit
// staggers bottom-to-top (staggerDirection: -1) so it retracts the way it came
// — the same in/out asymmetry SectionRail.tsx uses for the desktop rail.
const PANEL_LIST_VARIANTS = {
  closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
  open: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } },
};
const PANEL_ROW_VARIANTS = {
  closed: { opacity: 0, y: 6 },
  open: { opacity: 1, y: 0 },
};

// Rail color adapts to whatever's behind it — confirmed directly against
// zainabkabira.com's own pager, which sets `.on-dark`/default (light) via
// CSS custom properties per the ACTIVE band, not a fixed scheme: on a
// dark/busy background the line+pill read light, on a light background
// they read dark, with the halo shadow always in the *opposite* tone from
// the line for contrast either way. Each slide reports which variant it
// needs (Hero's busy illustration -> "on-dark", Problem's flat light
// background -> "on-light") — the rail has no way to know its own
// background on its own, so this is a prop, not internal state.
type RailTheme = "on-dark" | "on-light";

const RAIL_COLORS: Record<
  RailTheme,
  {
    track: string;
    fill: string;
    halo: string;
    pillBg: string;
    pillText: string;
    /** Inactive-but-reachable panel row. */
    pillTextMuted: string;
    /** Panel row for a chapter that has no slides yet. */
    pillTextDisabled: string;
    pillDivider: string;
  }
> = {
  "on-dark": {
    track: "bg-white/25",
    fill: "bg-white",
    halo: "shadow-[0_0_7px_rgba(0,0,0,0.4)]",
    pillBg: "bg-white",
    pillText: "text-[#0D0D0D]",
    pillTextMuted: "text-[#0D0D0D]/60",
    pillTextDisabled: "text-[#0D0D0D]/30",
    pillDivider: "bg-[#0D0D0D]/30",
  },
  "on-light": {
    track: "bg-[#0D0D0D]/20",
    fill: "bg-[#0D0D0D]",
    halo: "shadow-[0_0_10px_rgba(255,255,255,0.8)]",
    pillBg: "bg-[#0D0D0D]",
    pillText: "text-white",
    pillTextMuted: "text-white/60",
    pillTextDisabled: "text-white/30",
    pillDivider: "bg-white/30",
  },
};

interface SegmentedRailProps {
  activeId: string;
  /** Progress (0-1) through the active chapter's own slides. Defaults to 1
   * (fully filled) since every chapter built so far is a single slide. */
  fill?: number;
  /** Case-study identity shown in Header.tsx's center pill once activeId
   * moves past "hero". In practice this stays inert until a second
   * chapter exists — expected, not a bug. */
  pillContext: CaseStudyPill;
  /** Called with a chapter's ID when a built segment is clicked — the page
   * owns the actual slide-stage transform (translateX), this just reports
   * intent. Replaces an earlier scrollIntoView-based click handler, which
   * stopped making sense once slides moved from document flow into a
   * horizontally-translated stage.
   *
   * Reports the chapter ID, not its index. It used to pass the index, which
   * the page fed straight to its slide-index navigation — correct only while
   * every chapter was exactly one slide, so chapter N *was* slide N. That
   * stopped being true the moment the Council chapter grew to eight slides:
   * chapter 5 (Observability) would have scrolled to slide 5 (council-brief).
   * The page resolves the ID to the chapter's FIRST slide instead, which is
   * right regardless of how many slides a chapter holds. */
  onNavigate: (chapterId: string) => void;
  /** Which color variant to render — see RailTheme above. Defaults to
   * "on-dark" (the rail's original, only-ever-tested treatment). */
  theme?: RailTheme;
  /** Which navigation surface to show: the hover-aware tick "rail" (pointer
   * devices, paired with the horizontal slide stage) or the passive status
   * "pill" (touch devices, paired with the vertical scroll stack). The page
   * decides this from the SAME touch signal that picks the stage, so the two
   * can't disagree — a rail rendered over the vertical stack would be nav
   * that navigates nothing. Previously this was a CSS `md:` width toggle
   * baked into this component; it moved out to a prop once the split became
   * input-type-based (a wide landscape phone is touch but >=768px). Defaults
   * to "rail" (the original desktop-only treatment). */
  variant?: "rail" | "pill";
}

// Bottom nav — mechanic confirmed directly from zainabkabira.com's own
// case-study pager (.cs-pager / .cs-pg-t / .cs-pg-f / .cs-pg-pill),
// reproduced rather than copied byte-for-byte:
// - Each chapter is a small fixed-height hit target (h-16px) — several
//   times taller than the 2px line it draws, so the bar stays hairline-
//   thin without being fiddly to click.
// - flex-1 from a zero basis (not a % width), capped at max-w-60px, so one
//   rectangle reads the same length on every case study regardless of
//   chapter count, and gaps don't push the row past 100%.
// - Read-so-far fill is `scaleX`, not `width` — chapters before the active
//   one render fully filled, the active one fills to `fill`, everything
//   after stays empty. Reads as a progress bar and a map at once.
// - "The whole bar wakes together": `group` lives on <nav>, not per-button
//   — hovering any tick thickens every line (2px -> 5px), so the rail
//   reads as one object rather than a row of independent buttons.
// - ONE shared floating pill (not one per tick) glides between ticks via
//   translateX — a per-tick pill would be clipped by its own small box and
//   couldn't animate smoothly between positions. Centered on the hovered
//   tick, not left-aligned to it: `pillOffset` is the tick's own center
//   (`offsetLeft + offsetWidth / 2`), and the pill's `transform:
//   translateX(calc(Npx - 50%))` combines that pixel offset with the
//   standard self-centering `-50%` trick (centers on the pill's own
//   width, whatever it happens to be for that label, no separate
//   measurement of the pill itself needed). Originally just `left-0 +
//   translateX(offsetLeft)`, which pinned the pill's own left edge to the
//   tick's left edge — since the pill is much wider than a 60px tick,
//   that read as offset to the right rather than centered; flagged
//   directly against a screenshot.
// - Pill's number/divider/label gap and the divider's own height used to
//   be `gap-11px`/`h-11px` — 11px isn't a defined value in this project's
//   spacing scale (`globals.css`'s `--spacing-*px` set jumps 10px straight
//   to 12px), so both were silently no-op utilities: zero gap, zero-height
//   (invisible) divider. Same "undefined spacing token" bug already caught
//   twice elsewhere this session. Fixed to `gap-16px` (a bit more than the
//   nearest valid token, 12px, since more breathing room was explicitly
//   asked for) and `h-12px` (the divider's actual nearest valid height).
// - Bookend chapters (Hero, Closing) drop the number, same as this
//   reference's Overview/Closing/Read-next.
// - Track/fill/halo/pill colors come from RAIL_COLORS, keyed by the
//   `theme` prop ("on-dark"/"on-light") — the rail floats over whatever
//   the active slide is painting, not a flat surface, so it needs its own
//   fixed contrast per background rather than a token tied to the page's
//   light/dark toggle. Same on-dark/on-light adaptive pairing the
//   reference uses (line + halo always in opposite tones), reproduced
//   with this project's own values, added once a second slide with a
//   different background (Problem's flat light bg vs. Hero's busy
//   illustration) made a single fixed scheme actually break down.
// - Centered via `left-1/2 + -translate-x-1/2` with an explicit `width`
//   (`min(760px, calc(100% - 160px))`) rather than `inset-x-0 +
//   justify-center` on a `w-full max-w-[760px]` child — the reference's
//   own proven centering technique (`left:50%; transform:translateX(-50%)`
//   + `width:min()`), adopted directly after the justify-center approach
//   read as off-center. That fixed the <nav>'s own position but missed a
//   second bug one layer in: the inner row (the actual ticks) had no
//   `justify-content`, so once all 8 ticks hit their `max-w-60px` cap
//   (~522px total, well under the 760px container) they packed to the
//   left instead of centering within it — `justify-center` added to fix
//   that. Verified with real pixel measurements (headless Chrome + sharp),
//   not just code review, after the first fix alone turned out insufficient.
//
// Segments for chapters that don't exist yet still render (so the rail's
// shape doesn't change as content is added) but are inert: no click,
// pill still shows on hover so a hovering reader knows what's coming.
export default function SegmentedRail({
  activeId,
  fill = 1,
  pillContext,
  onNavigate,
  theme = "on-dark",
  variant = "rail",
}: SegmentedRailProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [pillOffset, setPillOffset] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  // A 2-in-1 switching from touch to a mouse flips `variant` to "rail"
  // mid-session, which would strand an open panel as invisible state behind a
  // rail that has no way to close it. Reset during render (React's documented
  // "adjust state when a prop changes" pattern) rather than in an effect, so
  // there's no extra pass where the stale value is still live.
  const [renderedVariant, setRenderedVariant] = useState(variant);
  if (renderedVariant !== variant) {
    setRenderedVariant(variant);
    setPanelOpen(false);
  }
  const { setCaseStudyPill } = useHeaderCaseStudyPill();
  const colors = RAIL_COLORS[theme];
  const panelId = useId();
  const pillButtonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  const activeIndex = CHAPTERS.findIndex((c) => c.id === activeId);
  const activeChapter = CHAPTERS[activeIndex];
  // Mobile status pill reads the same CHAPTERS copy as the desktop rail now
  // that the two label sets have converged (Figma reworded them to match).
  const activeLabel = activeChapter.label;
  // The one string the collapsed/expanded pill shows. All of PILL_LABEL_SLOTS
  // is rendered invisibly alongside it to hold the width steady.
  const pillLabel = panelOpen ? "Close" : activeLabel;

  // Chapter index is plain React state, not scroll position — no GSAP
  // needed here (unlike useCaseStudyIntroPill.ts, which does the same job
  // for the scroll-driven vertical case studies).
  useEffect(() => {
    setCaseStudyPill(activeId !== "hero" ? pillContext : null);
    return () => setCaseStudyPill(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  // Escape closes the panel and hands focus back to the pill that opened it.
  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setPanelOpen(false);
      pillButtonRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panelOpen]);

  const hovered = hoveredIndex !== null ? CHAPTERS[hoveredIndex] : null;

  return (
    <>
    {variant === "rail" && (
    <nav
      aria-label="Case study chapters"
      className="group fixed bottom-32px left-1/2 z-20 -translate-x-1/2"
      style={{ width: "min(760px, calc(100% - 160px))" }}
    >
      <div className="relative flex w-full justify-center gap-6px">
        {hovered && (
          // Content-width, not fixed: this pill only appears on hover, one
          // label at a time, so there's no scroll-driven label-flicker to
          // guard against (unlike the mobile status pill, which stays fixed
          // at 200px). It shrink-wraps its label; whitespace-nowrap keeps that
          // label on one line as the pill re-centers over each hovered tick.
          <div
            className={`pointer-events-none absolute bottom-[calc(100%+8px)] left-0 z-10 flex items-center gap-16px whitespace-nowrap rounded-full px-16px py-8px font-ui text-[13px] shadow-lg transition-transform duration-300 ease-out ${colors.pillBg} ${colors.pillText}`}
            style={{ transform: `translateX(calc(${pillOffset}px - 50%))` }}
          >
            {hovered.number && (
              <>
                <span className="font-mono font-medium text-[11px] uppercase tracking-[0.78px] opacity-60">
                  {hovered.number}
                </span>
                <span className={`h-12px w-px ${colors.pillDivider}`} />
              </>
            )}
            <span>{hovered.label}</span>
          </div>
        )}

        {CHAPTERS.map((chapter, index) => {
          const isBuilt = BUILT_CHAPTER_IDS.has(chapter.id);
          const segmentFill =
            index < activeIndex ? 1 : index === activeIndex ? fill : 0;

          return (
            <button
              key={chapter.id}
              type="button"
              disabled={!isBuilt}
              aria-label={chapter.label}
              aria-current={chapter.id === activeId ? "true" : undefined}
              onMouseEnter={(e) => {
                setHoveredIndex(index);
                setPillOffset(
                  e.currentTarget.offsetLeft + e.currentTarget.offsetWidth / 2
                );
              }}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => onNavigate(chapter.id)}
              className={`relative flex h-16px max-w-60px flex-1 items-center ${
                isBuilt ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <span
                className={`block h-[2px] w-full rounded-full transition-[height] duration-300 group-hover:h-[5px] ${colors.track} ${colors.halo}`}
              />
              <span
                className={`absolute inset-y-0 left-0 my-auto h-[2px] w-full rounded-full transition-[transform,height] duration-500 ease-out group-hover:h-[5px] ${colors.fill} ${colors.halo}`}
                style={{
                  transform: `scaleX(${segmentFill})`,
                  transformOrigin: "0 50%",
                }}
              />
            </button>
          );
        })}
      </div>
    </nav>
    )}

      {/* Touch — nodes 7400:30189 (collapsed) and 7399:29687 + 7399:29715
          (expanded) replace the whole rail with a bottom pill that is now a
          real disclosure control, not the passive status readout it started
          as. Node 7400:30219 is the frame holding both states.

          Shown for touch devices at any width (not just <768px): a landscape
          phone or tablet is wide but still wants this, not the hover rail —
          the page gates it via the `variant` prop rather than a CSS width
          class. This is the ONLY way to jump between sections on touch: the
          mobile stack is one long scroll with no rail over it, so before this
          the reader had no navigation at all, only a label telling them where
          they were.

          Colors come from RAIL_COLORS[theme] — the SAME source the desktop
          rail uses — not from global `dark:` overrides. The pill is an INVERSE
          surface (a dark pill on a light slide, a light pill on a dark one), so
          what it actually needs to track is "what tone is the slide behind me,"
          which is exactly what `theme` (on-dark / on-light) encodes. The page
          derives that from the active slide including the chapter-intro INVERT
          case, so this now flips correctly over an inverted slide too — the old
          `dark:` logic keyed off the global theme and so stayed dark over a
          dark inverted slide (the reported bug). The panel takes the same pair,
          so pill and panel always flip together; Figma only drew the dark
          variant of the panel, which would have stranded a black panel under a
          white pill on light slides.

          Four deliberate deviations from the Figma frame, all confirmed:
          - Width is derived, not the frame's fixed 186px. 186 is FastRouter's
            own longest-label measurement and predates the 24px map icon plus
            the 24px centring spacer, which together eat 64px of it — "Feature
            Overview" would clip. PILL_LABEL_SLOTS renders every possible label
            invisibly inside the label slot instead, so the pill's intrinsic
            width is longest-label-plus-chrome, holds steady as the label
            changes, and is automatically right for a case study with different
            labels rather than needing a new magic number per study.
          - The panel marks the current section (full text tone vs. muted). The
            frame draws all nine rows identically.
          - Chapters with no slides yet render at the disabled tone and are
            genuinely disabled, matching the desktop rail's existing "show the
            full shape, disable what isn't built" rule. The frame shows them as
            ordinary rows.
          - The collapsed pill drops the chapter number and its divider — that
            IS the frame, noted here only because the desktop hover pill keeps
            both, so the two intentionally differ now.

          Motion, not GSAP: this is a state-driven open/close, which CLAUDE.md
          puts squarely in Motion's lane (and this route runs no GSAP at all).
          Same easing/AnimatePresence shape as Header.tsx's mobile menu. The
          panel animates height 0 -> auto behind `overflow-hidden`, which is
          what reads as unrolling out from behind the pill rather than fading
          in place; padding lives on an inner element so height 0 is really 0
          and not 24px of leftover padding. */}
      {variant === "pill" && (
        <>
          {/* Transparent, not a scrim — the frame shows the page still fully
              visible behind the open panel. It exists to catch the
              tap-outside-to-close and, via touch-action, to stop the page
              scrolling underneath an open panel without resorting to a
              body-scroll lock (which iOS handles badly). */}
          <AnimatePresence>
            {panelOpen && (
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setPanelOpen(false)}
                aria-hidden="true"
                className="fixed inset-0 z-10"
                style={{ touchAction: "none" }}
              />
            )}
          </AnimatePresence>

          {/* w-max + items-stretch is the shared-width mechanism: the wrapper
              hugs its widest child (the pill), and the panel takes that width
              back via w-full, so the two surfaces can never disagree. */}
          <div className="fixed bottom-48px left-1/2 z-20 flex w-max -translate-x-1/2 flex-col items-stretch">
            <AnimatePresence initial={false}>
              {panelOpen && (
                <motion.nav
                  key="panel"
                  id={panelId}
                  aria-label="Case study sections"
                  initial={
                    reduceMotion
                      ? { opacity: 0 }
                      : { height: 0, opacity: 0, y: 8 }
                  }
                  animate={
                    reduceMotion
                      ? { opacity: 1 }
                      : { height: "auto", opacity: 1, y: 0 }
                  }
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : { height: 0, opacity: 0, y: 8 }
                  }
                  transition={{
                    duration: reduceMotion ? 0.12 : 0.28,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ transformOrigin: "bottom" }}
                  className={`mb-4px w-full overflow-hidden rounded-[24px] shadow-[0px_6px_20px_0px_rgba(0,0,0,0.2)] ${colors.pillBg}`}
                >
                  <motion.div
                    variants={reduceMotion ? undefined : PANEL_LIST_VARIANTS}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="flex flex-col py-12px"
                  >
                    {CHAPTERS.map((chapter) => {
                      const isBuilt = BUILT_CHAPTER_IDS.has(chapter.id);
                      const isActive = chapter.id === activeId;
                      return (
                        <motion.button
                          key={chapter.id}
                          type="button"
                          variants={
                            reduceMotion ? undefined : PANEL_ROW_VARIANTS
                          }
                          disabled={!isBuilt}
                          aria-current={isActive ? "true" : undefined}
                          onClick={() => {
                            setPanelOpen(false);
                            onNavigate(chapter.id);
                          }}
                          className={`whitespace-nowrap px-16px py-8px text-left font-ui font-medium text-[14px] leading-[20px] tracking-[0.07px] ${
                            !isBuilt
                              ? `cursor-default ${colors.pillTextDisabled}`
                              : isActive
                                ? colors.pillText
                                : colors.pillTextMuted
                          }`}
                        >
                          {chapter.label}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </motion.nav>
              )}
            </AnimatePresence>

            <button
              ref={pillButtonRef}
              type="button"
              onClick={() => setPanelOpen((open) => !open)}
              aria-expanded={panelOpen}
              aria-controls={panelId}
              aria-label={
                panelOpen
                  ? "Close section navigation"
                  : "Open section navigation"
              }
              className={`flex w-full items-center gap-8px rounded-[24px] px-16px py-12px shadow-[0px_6px_20px_0px_rgba(0,0,0,0.2)] transition-colors duration-300 ${colors.pillBg}`}
            >
              <span
                className={`relative grid size-24px shrink-0 place-items-center ${colors.pillText}`}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={panelOpen ? "close" : "map"}
                    initial={
                      reduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, rotate: -90, scale: 0.6 }
                    }
                    animate={
                      reduceMotion
                        ? { opacity: 1 }
                        : { opacity: 1, rotate: 0, scale: 1 }
                    }
                    exit={
                      reduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, rotate: 90, scale: 0.6 }
                    }
                    transition={{
                      duration: reduceMotion ? 0.1 : 0.22,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="col-start-1 row-start-1 flex"
                  >
                    {panelOpen ? <CloseIcon /> : <MapIcon />}
                  </motion.span>
                </AnimatePresence>
              </span>

              {/* Invisible sizers first (they establish the width), the live
                  label stacked on top of them in the same grid cell. */}
              <span className="relative grid flex-1 place-items-center">
                {PILL_LABEL_SLOTS.map((label) => (
                  <span
                    key={label}
                    aria-hidden="true"
                    className="invisible col-start-1 row-start-1 whitespace-nowrap font-ui font-medium text-[14px] leading-[20px] tracking-[0.07px]"
                  >
                    {label}
                  </span>
                ))}
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={pillLabel}
                    initial={
                      reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }
                    }
                    animate={
                      reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
                    }
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                    transition={{
                      duration: reduceMotion ? 0.1 : 0.2,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`col-start-1 row-start-1 whitespace-nowrap font-ui font-medium text-[14px] leading-[20px] tracking-[0.07px] ${colors.pillText}`}
                  >
                    {pillLabel}
                  </motion.span>
                </AnimatePresence>
              </span>

              {/* Figma's own centring trick (node 7400:30194 — a second icon
                  at opacity 0): a 24px box balancing the real icon on the left
                  so the label reads optically centred in the pill rather than
                  centred in the space left over beside the icon. Rendered as
                  an empty box rather than a duplicated icon; same result. */}
              <span aria-hidden="true" className="size-24px shrink-0" />
            </button>
          </div>
        </>
      )}
    </>
  );
}
