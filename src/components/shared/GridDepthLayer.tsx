// Subtle grid depth decoration — Figma node 7239:5686 ("grid"), file
// 2aoIFdaJMyNBEWeQESBEzG, inspected directly (metadata + screenshot).
// Explicitly meant for reuse across multiple case-study pages, not just
// the one it was first added to — kept generic (placement/size controlled
// by the caller via `className`) rather than hardcoding any one slide's
// dimensions in here.
//
// What's actually in Figma: a dense tiling of ~400+ individual 44.44px
// square vectors (a repeating grid-line pattern, not a raster image),
// layered with an 800x400 ellipse positioned roughly top-center that
// reads as a radial fade — crisp grid near center-top, fading out toward
// the edges. Reproduced as pure CSS (two repeating-linear-gradient
// hairline layers + a radial-gradient mask) rather than downloading/
// tracing the vector grid — same visual result, no image asset needed.
// 44.44px rounded to 44px: a decorative tiling unit, not a value tied to
// this project's 8px content-spacing rhythm, so it doesn't get the same
// "correct to nearest token" treatment as an off-grid layout spacing
// value would.
//
// Line color is the existing `border-default` token (`var(--color-border-
// default)`), not a new one-off value — this codebase's established
// semantic token for subtle hairline decoration.
interface GridDepthLayerProps {
  className?: string;
}

export default function GridDepthLayer({ className }: GridDepthLayerProps) {
  const line = "var(--color-border-default)";
  // Grid tiling unit is a CSS variable so a caller can vary it per
  // breakpoint (inline style can't hold media queries). Defaults to 44px —
  // Figma's 44.44px cell, the value Hero/Problem were verified against — when
  // no `--grid-cell` is set. Override responsively from className, e.g.
  // `[--grid-cell:24px] md:[--grid-cell:40px]` (Product does exactly this).
  const cell = "var(--grid-cell, 44px)";
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none ${className ?? ""}`}
      style={{
        backgroundImage: `repeating-linear-gradient(to right, ${line} 0, ${line} 1px, transparent 1px, transparent ${cell}), repeating-linear-gradient(to bottom, ${line} 0, ${line} 1px, transparent 1px, transparent ${cell})`,
        backgroundSize: `${cell} ${cell}`,
        maskImage:
          "radial-gradient(ellipse 50% 45% at 50% 30%, black, transparent)",
        WebkitMaskImage:
          "radial-gradient(ellipse 50% 45% at 50% 30%, black, transparent)",
      }}
    />
  );
}
