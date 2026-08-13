// Shared across all three case studies per CLAUDE.md — build once, don't
// fork per case study. Generic bezel/fade wrapper: takes arbitrary content
// (a single image, or a composited screenshot like FastRouter's
// chrome-header + video stack) and applies the shared frame treatment.
//
// Reconciled 2026-07-11, corrected again same day after sampling actual
// pixel data from both Figma renders (not just the simplified Tailwind
// conversion, which flattens gradients to a nearest-solid approximation):
// - border: the FastRouter "Five Decisions" asset capsules (node
//   6764:3899 etc.) have a genuine gradient stroke — border-frame gray
//   near its origin corner, fading toward bg-primary. Reproduced here with
//   the standard CSS technique for a gradient border with border-radius: a
//   `padding` gap filled with the gradient, since (unlike DecisionAssetFrame)
//   this component needs an opaque fill behind it, not a see-through
//   middle — the simpler padding trick works, no mask-composite needed.
// - fill: solid white (bg-surface), not a gradient. Scroll 4's own Figma
//   instance (node 6676:89362) samples as flat #F5F5F5 with an invisible
//   border — this component follows the documented system spec (gradient
//   border, solid white fill) rather than that one instance, consistent
//   with the border-frame/radius-frame call already made here.
//
// The fade mask is applied to a wrapper around `children`, not the outer
// box — only the screenshot content should fade, not the frame itself.
//
// Responsive conversion (2026-07-12): `heightPx` was a literal pixel
// height, fine at a fixed 980px desktop width but wrong once the frame's
// own width goes fluid on smaller viewports (a fixed height would either
// add empty space or clip content as the box narrows). Replaced with
// `aspectRatio` (a CSS aspect-ratio string, e.g. "980/497") so height is
// always derived from the frame's actual rendered width — no mobile Figma
// frame exists to pixel-match here (per CLAUDE.md), so this is the fluid
// equivalent of the same fixed proportions, not a new breakpoint value.
interface ScreenshotFrameProps {
  children: React.ReactNode;
  aspectRatio: string;
  className?: string;
}

const BORDER_GRADIENT =
  "linear-gradient(147deg, var(--color-border-frame) 0%, var(--color-bg-primary) 100%)";

export default function ScreenshotFrame({
  children,
  aspectRatio,
  className,
}: ScreenshotFrameProps) {
  return (
    <div
      className={`relative w-full shrink-0 overflow-hidden rounded-frame p-2px ${className ?? ""}`}
      style={{ aspectRatio, backgroundImage: BORDER_GRADIENT }}
    >
      <div className="relative size-full overflow-hidden rounded-[28px] bg-bg-surface">
        <div
          className="relative size-full overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 82%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 82%, transparent 100%)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
