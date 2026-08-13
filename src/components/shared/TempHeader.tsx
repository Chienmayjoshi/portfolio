import ThemeToggle from "@/components/shared/ThemeToggle";

// TEMPORARY — not sourced from Figma, not part of any case study.
// Dark mode has no home in the real page chrome yet (no header exists in
// FastRouter's Figma frames at all — the case study starts straight at
// Hero). This is scaffolding to preview/toggle dark mode site-wide while
// it's being built out, per direct request. Remove once dark mode has a
// real home (or gets dropped) — don't let this quietly become permanent
// chrome that Figma never asked for.
export default function TempHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-bg-surface/80 backdrop-blur border-b border-border-default flex items-center justify-between px-24px py-12px">
      <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
        preview
      </span>
      <ThemeToggle />
    </header>
  );
}
