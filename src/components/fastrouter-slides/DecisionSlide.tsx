import Image from "next/image";
import GridDepthLayer from "@/components/shared/GridDepthLayer";

// Reusable TEMPLATE for a single "decision" slide in the fastrouter-slides deck
// — Figma desktop node 7202:99233 / mobile 7295:1742, file
// 2aoIFdaJMyNBEWeQESBEzG. Every decision follows the same shape (a ghost
// number, a "DECISION · {chapter}" eyebrow, a headline, a Chose / Gave up /
// Why? rationale, a pull-quote, and a product-screenshot capsule), so this
// takes a `decision` prop and defaults to the first one built (LLM Council,
// "Verdict-first layout"). Add more by passing a different `decision`.
//
// Layout differs by breakpoint, straight from the two Figma frames:
//   - Desktop: two columns — the text on the left (520px), the screenshot
//     capsule on the right (720×460), vertically centred.
//   - Mobile: everything stacked in one column, and the capsule is a MODIFIED
//     frame (flagged in the request) — full-width, a taller crop that also
//     shows the chat input, so it's a separate asset (fr-verdict-first-mobile)
//     rather than the desktop crop.
// Both capsule images are composited exports from Figma (the frame's border /
// rounded corner / mask baked in) — the real, verified product screenshot for
// this decision, not a placeholder.
interface Decision {
  id: string;
  number: string;
  chapter: string;
  headline: string;
  chose: string;
  gaveUp: string;
  why: string;
  quote: string;
  assetDesktop: string;
  assetMobile: string;
  assetAlt: string;
}

const COUNCIL_VERDICT_FIRST: Decision = {
  id: "council",
  number: "01",
  chapter: "LLM COUNCIL",
  headline: "Verdict-first layout",
  chose: "Final verdict at the top. Arguments and peer review stacked below.",
  gaveUp: "Chronological order — the narrative journey the team expected.",
  why: "If users read arguments first they form an opinion before the verdict arrives. Showing the verdict cold preserves its objectivity as an independent signal.",
  quote: "“The team pushed back. I held the position.”",
  assetDesktop: "/images/fastrouter/fr-verdict-first.webp",
  assetMobile: "/images/fastrouter/fr-verdict-first-mobile.webp",
  assetAlt:
    "FastRouter Model Council — Final Verdict card above Peer Rankings",
};

// One "Chose / Gave up / Why?" block: a mono label over a body paragraph.
function Rationale({ label, children }: { label: string; children: string }) {
  return (
    <div className="flex flex-col gap-8px">
      <span className="font-mono font-medium text-[13px] text-text-muted uppercase tracking-[0.78px]">
        {label}
      </span>
      <p className="font-ui font-normal text-[16px] text-text-primary leading-[28px] tracking-[0.08px]">
        {children}
      </p>
    </div>
  );
}

export default function DecisionSlide({
  decision = COUNCIL_VERDICT_FIRST,
}: {
  decision?: Decision;
}) {
  return (
    <section
      id={decision.id}
      className="relative flex h-full w-full flex-col overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:top-0 md:h-[800px]" />

      {/* Desktop centres the two-column row vertically; mobile is a normal
          top-anchored stack. */}
      <div className="relative z-10 w-full px-20px pt-32px md:flex md:h-full md:items-center md:px-80px md:pt-0 md:pb-[var(--fr-header-h,0px)]">
        <div className="w-full md:mx-auto md:flex md:max-w-[1280px] md:items-center md:gap-40px">
          {/* Main column: text (+ the mobile capsule inline). 24px rhythm on
              mobile, 56px on desktop — the inline mobile capsule drops out on
              desktop (md:hidden), so the desktop gaps land between the three
              text groups only. */}
          <div className="flex w-full flex-col gap-24px md:w-[520px] md:shrink-0 md:gap-[56px]">
            {/* Number + eyebrow + headline */}
            <div className="flex flex-col gap-24px">
              <div className="flex flex-col gap-4px">
                {/* Ghost number, cropped to a 40px band (the "peeking numeral"
                    Figma frame). border-frame token → adapts to dark mode. */}
                <div className="flex h-40px w-fit items-start justify-center overflow-hidden px-4px">
                  <span className="font-display text-[48px] text-border-frame leading-[56px] tracking-[-0.48px]">
                    {decision.number}
                  </span>
                </div>
                <span className="font-mono font-medium text-[13px] text-text-accent uppercase tracking-[0.78px]">
                  DECISION · {decision.chapter}
                </span>
              </div>
              <h1 className="font-display text-[32px] text-text-primary leading-[40px] tracking-[-0.32px] md:text-[56px] md:leading-[64px] md:tracking-[-0.56px]">
                {decision.headline}
              </h1>
            </div>

            {/* Mobile capsule — inline, modified full-width crop. Hidden on
                desktop (shown as the right column instead). rounded-tl-[30px]
                per Figma (only the top-left corner is rounded; the frame bleeds
                off the other edges). */}
            <div className="relative aspect-[700/660] w-full overflow-hidden rounded-tl-[30px] md:hidden">
              <Image
                src={decision.assetMobile}
                alt={decision.assetAlt}
                fill
                className="object-cover object-left-top"
                sizes="100vw"
              />
            </div>

            {/* Chose / Gave up / Why? */}
            <div className="flex flex-col gap-24px">
              <Rationale label="Chose">{decision.chose}</Rationale>
              <Rationale label="Gave up">{decision.gaveUp}</Rationale>
              <Rationale label="Why?">{decision.why}</Rationale>
            </div>

            {/* Pull-quote — 3px accent left border. */}
            <blockquote className="border-text-accent border-l-[3px] pl-20px">
              <p className="font-ui font-semibold text-[17px] text-text-primary leading-[28px] tracking-[0.085px] md:text-[28px] md:leading-[40px] md:tracking-[-0.1px]">
                {decision.quote}
              </p>
            </blockquote>
          </div>

          {/* Desktop capsule — right column. */}
          <div className="hidden md:block md:min-w-0 md:flex-1">
            <div className="relative aspect-[720/460] w-full max-w-[720px] overflow-hidden rounded-tl-[30px]">
              <Image
                src={decision.assetDesktop}
                alt={decision.assetAlt}
                fill
                className="object-cover object-left-top"
                sizes="720px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
