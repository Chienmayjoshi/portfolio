"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/shared/ThemeProvider";

// Square icon-button matching the reference screenshots: bordered rounded
// square, muted gray icon, thin-line (Feather-style) moon/sun glyphs. Not
// a Figma-sourced component — dark mode itself isn't in Figma yet, this is
// pure interaction plumbing. Colors come from the same tokens as
// everything else (border-border-default, bg-bg-surface, text-text-muted)
// rather than one-off hex values, per CLAUDE.md's token-first rule.
//
// Shows the icon for the mode a click will switch TO (moon while light,
// sun while dark) — the common convention (GitHub, Vercel, etc.), not the
// current mode.
//
// No next-themes dependency in this project — implemented directly, via
// ThemeProvider.tsx's context (toggles the `dark` class Tailwind's custom
// variant already watches for, see globals.css `@custom-variant dark`,
// and persists to localStorage). Refactored 2026-07-14 to consume that
// shared context instead of its own isolated useState/useEffect pair —
// ThemeAwareVideo.tsx now needs the same theme state, so a single source
// of truth replaced the duplicated local logic this component used to
// carry alone. The FOUC-avoiding read of the stored value on first paint
// still lives in layout.tsx as a `next/script` `beforeInteractive`
// snippet — this component (and the context) only reflect state after
// mount.
function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-20px"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-20px"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Same mounted-gate as before: ThemeProvider's isDark starts false on
  // both server and first client render (avoiding a hydration mismatch
  // on the icon shown), then corrects itself post-mount — this just
  // tracks when that correction has happened so the button doesn't
  // render a confidently-wrong icon/label before mount.
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        mounted
          ? isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
          : "Toggle theme"
      }
      className="flex items-center justify-center size-40px shrink-0 rounded-lg border border-border-default bg-bg-surface text-text-muted hover:text-text-primary hover:border-border-frame transition-colors"
    >
      {mounted && isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
