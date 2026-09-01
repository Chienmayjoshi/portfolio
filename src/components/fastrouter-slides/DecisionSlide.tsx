import Image from "next/image";
import GridDepthLayer from "@/components/shared/GridDepthLayer";
import ThemeSwap from "@/components/shared/ThemeSwap";
import DecisionAssetFrame from "@/components/shared/DecisionAssetFrame";

// Reusable TEMPLATE for a single "decision" slide in the fastrouter-slides deck
// — Figma desktop node 7202:99233 / mobile 7295:1742, file
// 2aoIFdaJMyNBEWeQESBEzG. Every decision follows the same shape (a ghost
// number, a "DECISION · {chapter}" eyebrow, a headline, a Chose / Gave up /
// Why? rationale, a pull-quote, and a product-screenshot capsule), so this
// takes a `decision` prop and defaults to the first one built (LLM Council,
// "Verdict-first layout"). Add more by passing a different `decision`.
//
// Layout differs by breakpoint: desktop is two columns (text left 520px,
// capsule right), mobile stacks the capsule inline in the text column. Both
// vertically centred on desktop, a top-anchored stack on mobile.
//
// CAPSULE FRAMING: uses the shared DecisionAssetFrame — the exact gradient
// box + stroke ring + right-edge fade the vertical-scroll case study uses on
// its decision screenshots (FiveDecisions.tsx). The frame is token-driven
// (bg-surface / bg-primary / border-frame), so it adapts to the theme on its
// own; the screenshot inside is a plain light/dark pair swapped by ThemeSwap.
// This replaced an earlier approach that baked the frame into the light webp
// export (which had no dark twin) — using the shared frame gives one
// consistent, theme-correct treatment across both slide + vertical-scroll
// formats. Same 720×460 capsule proportion on mobile too (the frame is
// responsive), matching the vertical scroll rather than a bespoke mobile crop.
interface Decision {
  id: string;
  number: string;
  chapter: string;
  headline: string;
  chose: string;
  gaveUp: string;
  why: string;
  quote: string;
  assetLight: string;
  assetDark: string;
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
  // Plain screenshots (no baked frame) — the shared frame is drawn by
  // DecisionAssetFrame. Same light/dark pair the vertical-scroll decisions use.
  assetLight: "/images/fastrouter/fr-decision-01-verdict-first.png",
  assetDark: "/images/fastrouter/fr-decision-01-verdict-first-dark.png",
  assetAlt:
    "FastRouter Model Council — Final Verdict card above Peer Rankings",
};

// The framed, theme-aware screenshot capsule. DecisionAssetFrame supplies the
// gradient box + stroke ring + right fade; ThemeSwap picks the light/dark
// screenshot (CSS-only, no flash). `object-top` so the crop keeps the header +
// Final Verdict in view (same as FiveDecisions.tsx).
function DecisionCapsule({
  light,
  dark,
  alt,
  className,
}: {
  light: string;
  dark: string;
  alt: string;
  className?: string;
}) {
  return (
    <DecisionAssetFrame className={className}>
      <ThemeSwap
        light={
          <Image
            src={light}
            alt={alt}
            fill
            className="object-cover object-top"
            sizes="(max-width: 767px) 100vw, 720px"
          />
        }
        dark={
          <Image
            src={dark}
            alt={alt}
            fill
            className="object-cover object-top"
            sizes="(max-width: 767px) 100vw, 720px"
          />
        }
      />
    </DecisionAssetFrame>
  );
}

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
      <div className="relative z-10 w-full px-20px pt-32px md:flex md:h-full md:items-center md:px-80px md:pt-0">
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

            {/* Mobile capsule — inline (hidden on desktop, which shows it as
                the right column instead). */}
            <DecisionCapsule
              light={decision.assetLight}
              dark={decision.assetDark}
              alt={decision.assetAlt}
              className="md:hidden"
            />

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
            <DecisionCapsule
              light={decision.assetLight}
              dark={decision.assetDark}
              alt={decision.assetAlt}
              className="md:w-[720px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
