// Source of truth: Figma node 6379:57067 (Analytics file, node
// 6379:57064, per CLAUDE.md — Figma canonical for this case study's
// content, superseding the older "/content docs canonical" note for
// Analytics/Extensions). Same structure/spacing/typography as
// fastrouter/Hero.tsx, per direct instruction to reuse the FastRouter
// template unmodified — only the breadcrumb's first segment differs: no
// Analytics logomark asset exists, so it renders as plain text instead of
// FastRouterLogomark's inline SVG.
//
// No mobile Figma frame exists for this headline (matches FastRouter's own
// documented gap) — unlike FastRouter's forced 3-line break, this headline
// has no Figma-specified line breaks captured during content extraction,
// so it reflows naturally at every width rather than reproducing arbitrary
// breaks that weren't actually in the source.
//
// `id` (SectionRail.tsx anchor): optional prop, page.tsx owns the
// id-to-label mapping, same pattern as fastrouter/Hero.tsx.
interface HeroProps {
  id?: string;
}

export default function Hero({ id }: HeroProps) {
  return (
    <section id={id} className="w-full pt-80px">
      <div className="max-w-[var(--width-content)] mx-auto flex flex-col gap-32px items-start px-[var(--edge-padding)] md:px-40px">
        <div className="flex flex-wrap gap-12px items-center w-full">
          <span className="font-ui font-medium text-text-primary text-[13px] uppercase tracking-[0.78px]">
            Analytics
          </span>
          <span className="font-ui text-text-muted text-[13px] uppercase tracking-[0.78px]">
            ·
          </span>
          <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
            B2B internal tool
          </span>
          <span className="font-ui text-text-muted text-[13px] uppercase tracking-[0.78px]">
            ·
          </span>
          <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
            contextual advertising analytics
          </span>
        </div>

        <div className="flex flex-col gap-32px items-start w-full">
          <h1 className="font-display font-bold text-text-primary text-[36px] leading-[42px] tracking-[-0.5px] md:text-[68px] md:leading-[76px] md:tracking-[-1.2px]">
            Friction that compounds across analysts, PMs, and stakeholders
            isn&rsquo;t a minor inconvenience.
          </h1>

          <div className="border-t border-border-default pr-0 md:pr-80px py-24px md:py-40px w-full">
            <p className="font-ui font-semibold text-text-primary text-[17px] leading-[28px] tracking-[0.085px]">
              An internal analytics platform used by PMs, analysts, and
              stakeholders to make performance decisions every day. As the
              product scaled, the interface hadn&rsquo;t — the gaps
              compounded on every user, every session. I designed across
              four modules to close them.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
