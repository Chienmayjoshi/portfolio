"use client";

import { useTheme } from "@/components/shared/ThemeProvider";

// Videos can't use ThemeSwap.tsx's CSS-only dual-render trick — two
// autoplaying <video> elements (one hidden) would both fetch and
// potentially both play simultaneously, wasting bandwidth on files far
// bigger than the image assets this problem also applies to. Instead:
// exactly one <video> element, src picked from ThemeProvider's context,
// so only the active theme's file is ever requested.
//
// Trade-off vs. ThemeSwap: this page is statically generated, and
// useTheme()'s value isn't known until after React hydrates — so for a
// dark-mode visitor, the server-rendered HTML briefly shows the
// light-mode src before hydration corrects it. Typically well under
// 100ms and not visually jarring for a muted autoplaying loop, but not
// literally zero like the CSS approach. suppressHydrationWarning silences
// the resulting one-time, expected mismatch on this element specifically
// — same fix already applied to <html> in layout.tsx for the identical
// underlying reason (a value only known client-side, after a blocking
// script/hydration has run).
interface ThemeAwareVideoProps {
  lightSrc: string;
  darkSrc: string;
  className?: string;
  "aria-label"?: string;
}

export default function ThemeAwareVideo({
  lightSrc,
  darkSrc,
  className,
  "aria-label": ariaLabel,
}: ThemeAwareVideoProps) {
  const { isDark } = useTheme();

  return (
    <video
      className={className}
      src={isDark ? darkSrc : lightSrc}
      autoPlay
      muted
      loop
      playsInline
      aria-label={ariaLabel}
      suppressHydrationWarning
    />
  );
}
