"use client";

import { useEffect } from "react";

// Not sourced from Figma — /practice has no Figma frames (see posts.ts).
// Mobile mandatory scroll snap (per direct decision) must live on the
// document's own scroll container — a nested overflow-y-auto feed would
// trap scroll on mobile and fight the sticky TempHeader/Footer. Tailwind
// classes can't be put on <html> per-route, so this component stamps a
// scope class on the root element for exactly as long as the practice
// feed is mounted; the actual snap rules live in globals.css under a
// max-width media query, so desktop is entirely unaffected.
export default function SnapScope() {
  useEffect(() => {
    document.documentElement.classList.add("practice-snap");
    return () => document.documentElement.classList.remove("practice-snap");
  }, []);

  return null;
}
