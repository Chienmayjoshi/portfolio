"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  type MotionValue,
} from "motion/react";
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
//
// A tenth tick, "Closing", was added 2026-09-07 by direct instruction when the
// deck's thanks-for-reading card (Figma 7468:21634) was built: it is neither a
// reflection nor an outcome, and folding it into either would have mislabelled
// whichever tick it borrowed. Unnumbered like the other two bookends. The
// frame's own decorative rail mock draws 8 ticks — this table, not that mock,
// is the tick count.
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
  { id: "closing", label: "Closing", number: null },
];

const BUILT_CHAPTER_IDS = new Set([
  "hero",
  "problem",
  "product",
  "features",
  "council",
  "observability",
  "evaluations",
  "reflections",
  "closing",
]);

// Every icon here is an inline SVG rather than an icon-package import — this
// repo has no icon dependency at all (see Header.tsx's note:
// @phosphor-icons/react was wanted but is registry-blocked), so every icon in
// the portfolio shell is hand-inlined. Paths lifted straight from the Figma
// nodes (7399:29688 close, 7515:29439 caret) with any baked fill swapped for
// currentColor / the muted constant below rather than pinning one scheme.
//
// The 24px map icon that used to open the collapsed pill (node 7400:30215) is
// gone, replaced by ProgressRing — Figma marks that node, and the divider
// beside it (7400:30192), `hidden` in the current frame, so this is a
// replacement rather than an addition. The path lives in that hidden node if
// it is ever wanted back.

// Figma's #6B6B6B (design-tokens neutral.500 / --color-text-muted) for the
// collapsed pill's ring track and caret. Stays literal on BOTH pill tones
// rather than becoming an alpha of pillText: it is a mid gray, so it reads as
// a step down from the label against the white pill and the black one alike.
// Figma only drew the dark-pill variant.
const PILL_GLYPH_MUTED = "#6B6B6B";

// How far through the whole page the reader is, as the collapsed pill's left
// glyph. Replaces a static icon, per direct instruction — Figma's own Status
// node (7515:29455) is a borrowed SPINNER (a fixed 75% arc rotating -1080 -> 0
// on a 2s infinite loop, starting at 3 o'clock), which is not what this is
// for. Three deliberate departures from that node, all confirmed:
// - Arc length is driven by scroll progress, not fixed at 75%.
// - No rotation. The ring is a readout, not a busy indicator.
// - Starts at 12 o'clock (`rotate(-90 10 10)`) and fills clockwise. Figma's
//   3 o'clock start only meant anything while the ring was spinning.
// Figma wants updating on all three.
//
// Geometry matches the node otherwise: r 9 + a 2px stroke puts the ring's
// outer edge exactly on the 20px box, which is what Figma's Status frame does
// inside its own 20px parent. `overflow-visible` keeps that boundary from
// being shaved by antialiasing.
//
// `pathLength` is Motion's first-class progress prop — it normalises the
// dasharray/dashoffset itself, so there is no circumference constant to keep
// in sync with the radius. Driven by a MotionValue, so scrolling repaints the
// arc without re-rendering React.
function ProgressRing({ progress }: { progress: MotionValue<number> }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="size-20px overflow-visible"
      aria-hidden="true"
    >
      <circle
        cx="10"
        cy="10"
        r="9"
        stroke={PILL_GLYPH_MUTED}
        strokeWidth="2"
      />
      {/* currentColor, so the arc inverts with RAIL_COLORS[theme] exactly like
          the label beside it. Figma draws it at #F5F5F5 against the dark pill;
          pillText is #FFFFFF there — a 4-unit difference on a 2px stroke,
          taken in exchange for the arc flipping correctly on the light pill,
          which Figma never drew. */}
      <motion.circle
        cx="10"
        cy="10"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        transform="rotate(-90 10 10)"
        style={{ pathLength: progress }}
      />
    </svg>
  );
}

// Right-hand glyph of the collapsed pill, newly added in the same frame — the
// first thing that says out loud that the pill opens. Pinned to the muted tone
// rather than currentColor: Figma has it at #6B6B6B, a step below the label,
// not level with it.
function CaretDownIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill={PILL_GLYPH_MUTED}
      className="size-20px"
      aria-hidden="true"
    >
      <path d="M16.6922 7.94219L10.4422 14.1922C10.3841 14.2503 10.3152 14.2964 10.2393 14.3279C10.1635 14.3593 10.0821 14.3755 10 14.3755C9.91787 14.3755 9.83654 14.3593 9.76066 14.3279C9.68479 14.2964 9.61586 14.2503 9.55781 14.1922L3.30781 7.94219C3.19054 7.82491 3.12465 7.66585 3.12465 7.5C3.12465 7.33415 3.19054 7.17509 3.30781 7.05781C3.42509 6.94054 3.58415 6.87465 3.75 6.87465C3.91585 6.87465 4.07491 6.94054 4.19219 7.05781L10 12.8664L15.8078 7.05781C15.8659 6.99974 15.9348 6.95368 16.0107 6.92225C16.0866 6.89083 16.1679 6.87465 16.25 6.87465C16.3321 6.87465 16.4134 6.89083 16.4893 6.92225C16.5652 6.95368 16.6341 6.99974 16.6922 7.05781C16.7503 7.11588 16.7963 7.18482 16.8277 7.26069C16.8592 7.33656 16.8753 7.41788 16.8753 7.5C16.8753 7.58212 16.8592 7.66344 16.8277 7.73931C16.7963 7.81518 16.7503 7.88412 16.6922 7.94219Z" />
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
  /** How much of the ACTIVE chapter has been read, 0-1. The rail draws one
   * tick per chapter, but a chapter can be nine slides long, so without this
   * the Council tick would read as complete from its first slide to its last
   * and the reader would get no sense of moving inside it.
   *
   * Stepped per slide, not scrubbed against scroll position: a chapter is k/n
   * filled on its k-th slide, so a one-slide chapter is always exactly 1 (a
   * section you are standing in and have nothing left to read reads as read),
   * and every chapter is already full by the time the reader leaves its last
   * slide — no tick creeps up to full behind them. The step itself is animated
   * by the segment's own CSS transition. Defaults to 1, the value every
   * chapter had before chapters could hold more than one slide. */
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
  const [lastHoveredIndex, setLastHoveredIndex] = useState(0);
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
  // 0-1 through the whole document, for the collapsed pill's ProgressRing.
  // The pill only ever renders on touch, where the deck is plain document flow
  // (page.tsx's stacked branch) — so the window IS the scroller and useScroll's
  // default target is right. Called unconditionally per the hooks rule: on the
  // pointer/"rail" branch an inner container scrolls instead, so this sits at 0
  // there, and nothing reads it.
  //
  // Motion rather than GSAP even though this is scroll-scrubbed. CLAUDE.md's
  // real constraint is that the two engines must never share an element's
  // timeline; here only Motion touches this one, and this route runs no GSAP at
  // all. Returns a MotionValue, so the arc repaints without a React render per
  // scroll tick — the same useMotionValue-drives-a-progress-visual shape
  // ReadNextSlide.tsx already uses.
  const { scrollYProgress } = useScroll();

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

  // The pill is always mounted and shows/hides by opacity, so `hoveredIndex`
  // going null can't leave it with nothing to render mid-fade. It keeps the
  // last chapter the pointer was over until the pointer picks a new one.
  const pillChapter = CHAPTERS[lastHoveredIndex];

  return (
    <>
    {variant === "rail" && (
    <nav
      aria-label="Case study chapters"
      className="group fixed bottom-32px left-1/2 z-20 -translate-x-1/2"
      style={{ width: "min(760px, calc(100% - 160px))" }}
    >
      {/* onMouseLeave lives HERE, on the row, not on each tick. Per-tick
          mouseleave was what made the pill jump rather than glide: crossing
          the 6px gap between two ticks fired the first tick's mouseleave, the
          pill unmounted, and the next tick's mouseenter mounted a brand-new
          element at the new offset — a fresh node has no previous transform to
          transition from, so every move between ticks was an instant teleport
          and transition-transform never got a chance to run. The gaps belong
          to this row, so leaving a tick for its neighbour no longer counts as
          leaving at all, and the one persistent pill just slides. */}
      <div
        className="relative flex w-full justify-center gap-6px"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {/* Always mounted, shown/hidden by opacity — see above. Content-width,
            not fixed: one label at a time, so there's no scroll-driven
            label-flicker to guard against (unlike the mobile pill, which pins
            its width). It shrink-wraps its label; whitespace-nowrap keeps that
            label on one line as the pill re-centres over each hovered tick. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-[calc(100%+8px)] left-0 z-10 flex items-center whitespace-nowrap rounded-full px-16px py-8px font-ui text-[13px] shadow-lg transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${colors.pillBg} ${colors.pillText}`}
          style={{
            transform: `translateX(calc(${pillOffset}px - 50%))`,
            opacity: hoveredIndex !== null ? 1 : 0,
          }}
        >
          {pillChapter.number && (
            <>
              <span className="font-mono font-medium text-[11px] uppercase tracking-[0.78px] opacity-60">
                {pillChapter.number}
              </span>
              {/* Symmetric 8px either side of the divider. Was 16/4, which
                  read as the divider crowding the label; equal spacing was
                  asked for directly against a screenshot. A single flex `gap`
                  would also work now, but the spacing stays on the divider so
                  it's obvious both sides are the same value. */}
              <span
                className={`mx-8px h-12px w-px ${colors.pillDivider}`}
              />
            </>
          )}
          <span>{pillChapter.label}</span>
        </div>

        {CHAPTERS.map((chapter, index) => {
          const isBuilt = BUILT_CHAPTER_IDS.has(chapter.id);
          // Chapters before the active one are read (full), after it unread
          // (empty), and the active one fills by `fill` — so a chapter holding
          // nine slides advances a ninth per slide rather than reading as
          // complete the moment it opens.
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
                setLastHoveredIndex(index);
                setPillOffset(
                  e.currentTarget.offsetLeft + e.currentTarget.offsetWidth / 2
                );
              }}
              onClick={() => onNavigate(chapter.id)}
              className={`relative flex h-16px max-w-60px flex-1 items-center ${
                isBuilt ? "cursor-pointer" : "cursor-default"
              }`}
            >
              {/* Thickness is scaleY on a bar that is ALWAYS 5px tall, not an
                  animated height. Two things were wrong with animating height:
                  it ran on the layout thread every frame, and — the visible
                  one — the track animated over 300ms with the default ease
                  while the fill animated over 500ms ease-out, so the two bars
                  grew at different rates and the line thickened in two stages.
                  Both now carry an identical transform transition, so they
                  cannot fall out of step, and scaleY composites instead of
                  relaying out. 5px x 0.4 = the same 2px resting line. */}
              <span
                className={`block h-[5px] w-full origin-center scale-y-[0.4] rounded-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100 ${colors.track} ${colors.halo}`}
              />
              {/* The fill carries TWO independent transforms — read-so-far
                  progress and hover thickness — on two elements rather than
                  one, so each keeps its own timing (progress stays the slower
                  500ms) and the thickness half can share the track's exact
                  class string. Composing both into a single inline transform
                  would have forced the hover state through JS instead, and the
                  CSS `group` is the <nav>, which is wider than this row:
                  hovering the nav's own padding fires :hover but no tick's
                  mouseenter, so the two sources would disagree at the edges. */}
              <span
                className="absolute inset-y-0 left-0 my-auto block h-[5px] w-full transition-transform duration-500 ease-out"
                style={{
                  transform: `scaleX(${segmentFill})`,
                  transformOrigin: "0 50%",
                }}
              >
                <span
                  className={`block size-full origin-center scale-y-[0.4] rounded-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100 ${colors.fill} ${colors.halo}`}
                />
              </span>
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

          The collapsed state's two glyphs — a scroll-progress ring on the left
          and a caret on the right — come from the current version of node
          7400:30189, which hides the old map icon (7400:30215) and its divider
          (7400:30192) rather than keeping them alongside. The ring departs from
          that node in three confirmed ways (progress-driven, not spinning; no
          rotation; 12 o'clock start, not 3) — see ProgressRing's own note.
          Only the collapsed state changes: open, the pill is byte-for-byte what
          it was, close icon and empty balancing box included.

          Five deliberate deviations from the Figma frame, all confirmed:
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
          - Both icon slots stay 24px with the 20px glyphs centred inside,
            rather than shrinking to the frame's 20px. Load-bearing, not
            laziness: the open state keeps its 24px close icon, so 20px slots
            would make the pill 44px tall collapsed and 48px open and it would
            visibly resize on every tap. At 24px the geometry is identical in
            both states and only the glyphs change.

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
                    key={panelOpen ? "close" : "progress"}
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
                    {panelOpen ? (
                      <CloseIcon />
                    ) : (
                      <ProgressRing progress={scrollYProgress} />
                    )}
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

              {/* Started as Figma's own centring trick (node 7400:30194 — a
                  second icon at opacity 0): a 24px box balancing the real icon
                  on the left so the label reads optically centred in the pill
                  rather than centred in the space left over beside the icon.
                  It now holds the caret while collapsed, but it still has that
                  job — the box stays even once the caret fades out on open, or
                  the label would shunt right every time the panel opened. */}
              <span
                aria-hidden="true"
                className="grid size-24px shrink-0 place-items-center"
              >
                <AnimatePresence initial={false}>
                  {!panelOpen && (
                    <motion.span
                      key="caret"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: reduceMotion ? 0.1 : 0.22,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="col-start-1 row-start-1 flex"
                    >
                      <CaretDownIcon />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </button>
          </div>
        </>
      )}
    </>
  );
}
