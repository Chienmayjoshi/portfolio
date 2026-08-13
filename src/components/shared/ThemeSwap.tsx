// CSS-only light/dark asset swap — no JS, no ThemeProvider dependency.
// Resolves at first paint via the `dark` class the FOUC-avoiding blocking
// script in layout.tsx already sets on <html> before hydration, so
// there's zero flash (unlike ThemeAwareVideo.tsx's context-based swap,
// which has to wait for React to mount). Cost: both children are always
// present in the DOM, so both assets get fetched — fine for images given
// everything in this project is well under 250KB; NOT used for video for
// exactly that reason (would double-load and potentially double-autoplay
// two video files) — see ThemeAwareVideo.tsx instead.
//
// `contents` display on both wrappers means neither one adds a box to
// the layout — same technique already used for the mobile decision-row
// reordering work (FiveDecisions.tsx, ObservabilityIntro.tsx,
// EvaluationsFeature.tsx).
interface ThemeSwapProps {
  light: React.ReactNode;
  dark: React.ReactNode;
}

export default function ThemeSwap({ light, dark }: ThemeSwapProps) {
  return (
    <>
      <span className="contents dark:hidden">{light}</span>
      <span className="hidden dark:contents">{dark}</span>
    </>
  );
}
