"use client";

import { useEffect, useState } from "react";
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
// Numbering/labels updated to the Figma "floating section pill" scheme
// (nodes 7255:7281 / 7249:6818 / 7275:427): sequential from Hero=01, and
// reworded labels. Confirmed in Figma only for the four sections that have a
// mobile frame — Introduction(01)/The Problem(02)/The Product(03)/Feature
// Overview(04). The rest (Council..Evaluations) are renumbered to stay
// sequential but keep their existing labels — no invented reworded copy for
// sections without a Figma frame (CLAUDE.md). Closing stays an unnumbered
// bookend. Both the desktop rail's hover label and the mobile status pill
// read straight from this one table now (they used to diverge — see the
// pill notes below).
const CHAPTERS: Chapter[] = [
  { id: "hero", label: "Introduction", number: "01" },
  { id: "problem", label: "The Problem", number: "02" },
  { id: "product", label: "The Product", number: "03" },
  { id: "features", label: "Feature Overview", number: "04" },
  { id: "council", label: "Council", number: "05" },
  { id: "observability", label: "Observability", number: "06" },
  { id: "evaluations", label: "Evaluations", number: "07" },
  { id: "closing", label: "Closing", number: null },
];

const BUILT_CHAPTER_IDS = new Set([
  "hero",
  "problem",
  "product",
  "features",
  "council",
]);

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
    pillDivider: string;
  }
> = {
  "on-dark": {
    track: "bg-white/25",
    fill: "bg-white",
    halo: "shadow-[0_0_7px_rgba(0,0,0,0.4)]",
    pillBg: "bg-white",
    pillText: "text-[#0D0D0D]",
    pillDivider: "bg-[#0D0D0D]/30",
  },
  "on-light": {
    track: "bg-[#0D0D0D]/20",
    fill: "bg-[#0D0D0D]",
    halo: "shadow-[0_0_10px_rgba(255,255,255,0.8)]",
    pillBg: "bg-[#0D0D0D]",
    pillText: "text-white",
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
  /** Called with a chapter's index when a built segment is clicked — the
   * page owns the actual slide-stage transform (translateX), this just
   * reports intent. Replaces an earlier scrollIntoView-based click
   * handler, which stopped making sense once slides moved from document
   * flow into a horizontally-translated stage. */
  onNavigate: (index: number) => void;
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
  const { setCaseStudyPill } = useHeaderCaseStudyPill();
  const colors = RAIL_COLORS[theme];

  const activeIndex = CHAPTERS.findIndex((c) => c.id === activeId);
  const activeChapter = CHAPTERS[activeIndex];
  // Mobile status pill reads the same CHAPTERS copy as the desktop rail now
  // that the two label sets have converged (Figma reworded them to match).
  const activeNumber = activeChapter.number;
  const activeLabel = activeChapter.label;

  // Chapter index is plain React state, not scroll position — no GSAP
  // needed here (unlike useCaseStudyIntroPill.ts, which does the same job
  // for the scroll-driven vertical case studies).
  useEffect(() => {
    setCaseStudyPill(activeId !== "hero" ? pillContext : null);
    return () => setCaseStudyPill(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

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
              onClick={() => onNavigate(index)}
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

      {/* Touch — node 7255:7281 replaces the whole rail with this single
          passive status pill (confirmed: not tappable, no click handler).
          Shown for touch devices at any width (not just <768px): a landscape
          phone or tablet is wide but still wants this, not the hover rail —
          the page gates it via the `variant` prop rather than a CSS width
          class.

          Colors come from RAIL_COLORS[theme] — the SAME source the desktop
          rail uses — not from global `dark:` overrides. The pill is an INVERSE
          surface (a dark pill on a light slide, a light pill on a dark one), so
          what it actually needs to track is "what tone is the slide behind me,"
          which is exactly what `theme` (on-dark / on-light) encodes. The page
          derives that from the active slide including the chapter-intro INVERT
          case, so this now flips correctly over an inverted slide too — the old
          `dark:` logic keyed off the global theme and so stayed dark over a
          dark inverted slide (the reported bug). on-light gives the dark pill
          (Figma node 7275:427 / 7284:837); on-dark the light pill. The number
          uses the pill's own text tone at 60% (same as the desktop hover
          pill), the divider its pillDivider tone. */}
      {variant === "pill" && (
      <div className={`fixed bottom-48px left-1/2 z-20 flex w-[200px] -translate-x-1/2 items-center gap-8px rounded-[24px] px-16px py-12px shadow-[0px_6px_20px_0px_rgba(0,0,0,0.2)] transition-colors duration-300 ${colors.pillBg}`}>
        {activeNumber && (
          <>
            <span className={`shrink-0 font-mono font-medium text-[13px] uppercase tracking-[0.78px] opacity-60 ${colors.pillText}`}>
              {activeNumber}
            </span>
            <span className={`h-[14px] w-px shrink-0 ${colors.pillDivider}`} />
          </>
        )}
        {/* flex-1 + text-center: the number/divider sit left, the label
            fills and centers in the remaining width. This is what makes the
            fixed 200px pill (Figma node 7275:427) hold its width steady as
            the label text changes between sections instead of the pill
            resizing per label — the point of pinning the width. */}
        <span className={`flex-1 text-center font-ui font-medium text-[14px] leading-[20px] tracking-[0.07px] ${colors.pillText}`}>
          {activeLabel}
        </span>
      </div>
      )}
    </>
  );
}
