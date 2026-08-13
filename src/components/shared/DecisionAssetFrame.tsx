// Source of truth: Figma node 6764:3899 / 3919 / 3932 / 3940 (the four
// visible decision-asset capsules under node 6368:53785, FastRouter file,
// per CLAUDE.md). Structurally identical across all four — a shared
// component, per the user's own observation.
//
// Promoted from fastrouter/ to shared/ (2026-07-18) once Analytics and
// Extensions needed the same decision-capsule chrome — same "prove on one,
// reuse" pattern CLAUDE.md already documents for ScreenshotFrame. Pure
// move + import-path update, no behavioral change.
//
// Reconciled 2026-07-11: `shared/ScreenshotFrame` now uses the same
// gradient formula and border-frame/radius-frame treatment as this
// capsule (Scroll 4's product screenshot updated to match). Kept as its
// own component rather than merged into ScreenshotFrame — this capsule has
// a genuinely different structure Scroll 4's node doesn't (an inset
// bordered "stroke" ring separate from the outer gradient box, plus the
// rounded-tl-only outer treatment), not just a styling variant. Forcing
// both into one component would mean prop-driven structural branching for
// a two-instance pattern — not worth it yet.
//
// Corrected 2026-07-11 after checking the actual Figma render (not just
// the raw layer tree — the two disagree). Screenshotting the full capsule
// and cropping all four corners showed:
// - top-left: a genuinely rounded corner with the gradient/border visible
// - a thin border line continuing most of the way down the left edge
// - top-right, bottom-right, bottom-left: content flush to the edge, no
//   border, no rounding at all
// - the bottom edge: no fade whatsoever — content is sharp right to the
//   crop line. The mask-fade in the previous version was wrong, invented
//   by assuming symmetry with Scroll 4's card rather than checking; the
//   RGBA alpha in the raw Figma asset exports is corner antialiasing, not
//   a gradient fade.
//
// This asymmetry comes from Figma's own geometry: the bordered "stroke"
// ring is offset 18px left / 16px top from the capsule, but is the SAME
// width/height as the capsule itself — so its right and bottom edges (and
// their corners) land outside the capsule and get clipped by its own
// overflow-hidden, leaving only the top-left corner and the adjoining
// stretch of the left edge visible. Reproduced here with the same trick
// (an oversized, offset ring, clipped by the parent) rather than manually
// drawing four different edge treatments.
//
// The ring's stroke itself is a gradient, not a solid border-frame fill —
// confirmed 2026-07-11 by sampling pixels along the actual Figma render
// (not just the simplified Tailwind conversion, which flattened it to
// #D5D5D5): the color measurably shifts from border-frame gray near the
// top-left corner to near bg-primary further along the ring. CSS can't do
// a gradient `border` with radius directly, so this uses the standard
// mask-composite technique: a padding-box mask subtracted from a
// border-box mask leaves only the ring itself, with the gradient as its
// background — transparent in the middle, so the content underneath still
// shows through (unlike Scroll 4's ScreenshotFrame, which needs an opaque
// fill; see that file).
//
// Rebuilt 2026-07-12 against an exact reference: the user shared Figma
// node 6780:62284, a corrected/annotated version of this exact capsule
// with the border and fade as separate, explicitly-named layers ("stroke",
// "gradient overlay on the asset") instead of the ambiguous raw export
// this was originally reverse-engineered from. Values below are taken
// directly from that node, not re-approximated:
// - "stroke": 700x444, inset left:18/top:15.53 from the 720x460 capsule,
//   rounded-tl-[25px] only (not all corners), p-2px, background
//   `linear-gradient(137.38deg, #D5D5D5 1.96%, #F9F9F7 41.2%)` — border-
//   frame fading to bg-primary by 41% along the gradient (adjusted
//   2026-07-12 from the raw export's #FFFFFF endpoint to bg-primary, per
//   direct instruction). This is a plain padding-trick gradient border
//   (opaque child fills the padding box), not the mask-composite technique
//   the previous version used — simpler, and matches Figma's actual layer
//   structure.
// - "gradient overlay on the asset": a separate opaque rectangle layered
//   ON TOP of the image (not a mask on the image itself), covering the
//   full content area:
//   `linear-gradient(to left, #F9F9F7 0%, rgba(249,249,247,0) 18.857%)`
//   — solid bg-primary at the right edge, fading to fully transparent by
//   ~19% of the width in. This is what creates the "image fades into the
//   background near the right" effect — an overlay tinted to match the
//   page background, not a mask revealing whatever sits behind.
interface DecisionAssetFrameProps {
  children: React.ReactNode;
  className?: string;
}

const OUTER_FILL_GRADIENT =
  "linear-gradient(147.16deg, var(--color-bg-surface) 1.98%, var(--color-bg-surface) 24.69%, var(--color-bg-primary) 50.18%, var(--color-bg-primary) 75.67%)";

const STROKE_GRADIENT =
  "linear-gradient(137.38deg, var(--color-border-frame) 1.96%, var(--color-bg-primary) 41.2%)";

const RIGHT_FADE_OVERLAY =
  "linear-gradient(to left, var(--color-bg-primary) 0%, transparent 18.857%)";

// Responsive conversion (2026-07-12): no mobile Figma frame exists for this
// capsule (per CLAUDE.md) — engineering judgment, not a pixel match. The
// fixed 720x460 box becomes `aspect-[720/460] w-full`, so height is derived
// to preserve Figma's exact proportions at any width. Callers restore the
// original fixed 720px desktop width via `md:w-[720px]` in their own
// className rather than hardcoding it here, so this stays a pure
// aspect-ratio box and each caller controls its own breakpoint behavior.
// The inner "stroke" ring's px offsets (18/15.53/700/444, all relative to
// the 720x460 box) become percentages of that box so they scale with it —
// the ring's own border width (p-2px) stays a fixed 2px on purpose, since a
// hairline border shouldn't shrink toward invisibility on small screens.
export default function DecisionAssetFrame({
  children,
  className,
}: DecisionAssetFrameProps) {
  return (
    <div
      className={`relative w-full aspect-[720/460] shrink-0 overflow-hidden rounded-tl-[32px] ${className ?? ""}`}
      style={{ backgroundImage: OUTER_FILL_GRADIENT }}
    >
      <div
        className="absolute overflow-hidden rounded-tl-[25px] p-2px"
        style={{
          left: "2.5%",
          top: "3.3766%",
          width: "97.2222%",
          height: "96.5217%",
          backgroundImage: STROKE_GRADIENT,
        }}
      >
        <div className="relative size-full overflow-hidden rounded-tl-[23px]">
          {children}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: RIGHT_FADE_OVERLAY }}
          />
        </div>
      </div>
    </div>
  );
}
