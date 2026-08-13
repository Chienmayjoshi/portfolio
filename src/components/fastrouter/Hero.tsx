import FastRouterLogomark from "@/components/fastrouter/FastRouterLogomark";

// Source of truth: Figma node 6368:53597 (FastRouter file, per CLAUDE.md).
// letterSpacing values below (0.78px / 0.085px) match design-tokens.json's
// label / body-semibold styles, corrected 2026-07-11 — see that file for
// why the previous 6px / 0.5px values were wrong.
//
// One remaining known deviation: the divider border color. Figma node uses
// color/text-on-dark (#D9D9D9) on this stroke, which doesn't match
// border-default (#E5E5E5) or border-frame (#D5D5D5) in the token file —
// likely a dark-mode style applied to a light-mode stroke by mistake in
// Figma. Using border-default as the closest semantic role.
//
// Responsive conversion (2026-07-12): no mobile Figma frame exists (per
// CLAUDE.md), so below is engineering judgment. The 68px headline was
// force-broken into 3 lines via `whitespace-nowrap` — each line ("Enterprise
// AI teams were" etc.) doesn't fit at any mobile size without either
// shrinking the type well past the desktop scale or overflowing, so mobile
// drops `whitespace-nowrap` and lets the smaller type reflow naturally
// instead of keeping Figma's specific 3-line break. `--edge-padding` (24px)
// is the one CSS var CLAUDE.md already flags as PROPOSED for exactly this —
// used here as the mobile side-padding pending real sign-off.
//
// `id` (2026-07-15): optional anchor target for SectionRail.tsx — the
// page assembling this component (page.tsx) owns the id-to-label mapping
// via its `sections` array and passes the matching id down, rather than
// this component hardcoding it, so the string lives in exactly one place.
interface HeroProps {
  id?: string;
}

export default function Hero({ id }: HeroProps) {
  return (
    <section id={id} className="w-full pt-80px">
      <div className="max-w-[var(--width-content)] mx-auto flex flex-col gap-32px items-start px-[var(--edge-padding)] md:px-40px">
        <div className="flex flex-wrap gap-12px items-center w-full">
          <FastRouterLogomark className="shrink-0" />
          <span className="font-ui text-text-muted text-[13px] uppercase tracking-[0.78px]">
            ·
          </span>
          <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
            B2B
          </span>
          <span className="font-ui text-text-muted text-[13px] uppercase tracking-[0.78px]">
            ·
          </span>
          <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
            AI Infrastructure
          </span>
        </div>

        <div className="flex flex-col gap-32px items-start w-full">
          <h1
            className="font-display font-bold text-text-primary text-[36px] leading-[42px] tracking-[-0.5px] md:text-[68px] md:leading-[76px] md:tracking-[-1.2px]"
          >
            <span className="block md:whitespace-nowrap">Enterprise AI teams were</span>
            <span className="block md:whitespace-nowrap">flying blind on every model</span>
            <span className="block md:whitespace-nowrap">decision.</span>
          </h1>

          <div className="border-t border-border-default pr-0 md:pr-80px py-24px md:py-40px w-full">
            <p className="font-ui font-semibold text-text-primary text-[17px] leading-[28px] tracking-[0.085px]">
              I designed three features for FastRouter that gave teams their
              first systematic way to monitor cost, validate model quality,
              and reach a trusted verdict.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
