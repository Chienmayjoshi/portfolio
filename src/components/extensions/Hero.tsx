// Source of truth: Figma node 6408:11 (Extensions file, node 6408:8, per
// CLAUDE.md — Figma canonical for this case study's content). Same
// structure/spacing/typography as fastrouter/Hero.tsx; no logomark asset
// exists for Extensions, so the breadcrumb's first segment is plain text.
interface HeroProps {
  id?: string;
}

export default function Hero({ id }: HeroProps) {
  return (
    <section id={id} className="w-full pt-80px">
      <div className="max-w-[var(--width-content)] mx-auto flex flex-col gap-32px items-start px-[var(--edge-padding)] md:px-40px">
        <div className="flex flex-wrap gap-12px items-center w-full">
          <span className="font-ui font-medium text-text-primary text-[13px] uppercase tracking-[0.78px]">
            Extensions
          </span>
          <span className="font-ui text-text-muted text-[13px] uppercase tracking-[0.78px]">
            ·
          </span>
          <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
            B2C
          </span>
          <span className="font-ui text-text-muted text-[13px] uppercase tracking-[0.78px]">
            ·
          </span>
          <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
            Browser Extensions
          </span>
        </div>

        <div className="flex flex-col gap-32px items-start w-full">
          <h1 className="font-display font-bold text-text-primary text-[36px] leading-[42px] tracking-[-0.5px] md:text-[68px] md:leading-[76px] md:tracking-[-1.2px]">
            Seven extensions designed to stay installed.
          </h1>

          <div className="border-t border-border-default pr-0 md:pr-80px py-24px md:py-40px w-full">
            <p className="font-ui font-semibold text-text-primary text-[17px] leading-[28px] tracking-[0.085px]">
              Seven browser extensions. Sole designer across all of them.
              Each one a new tab replacement — when users open a tab, the
              extension has half a second to justify itself before they
              type a URL and move on.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
