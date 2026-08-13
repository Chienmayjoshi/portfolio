import DecisionAssetFrame from "@/components/shared/DecisionAssetFrame";
import ThemeSwap from "@/components/shared/ThemeSwap";
import ThemeAwareVideo from "@/components/shared/ThemeAwareVideo";

// Source of truth: Figma node 6368:53785 (FastRouter file, per CLAUDE.md).
// Figma has a 5th decision authored twice (two hidden variants, node
// 6368:53897 / 6368:53922) but both are hidden — only 4 decisions are
// actually visible in the file, so only 4 are built here. The on-page
// eyebrow label originally read "FIVE DECISIONS" (matching Figma's own
// text, which was never updated after the 5th was hidden) — corrected
// 2026-07-17 to "FOUR DECISIONS" to match what's actually shown; the
// component/file name is unchanged, just the visible copy.
//
// "decision-title" is bound to DM Sans in Figma — already a documented
// known gap in CLAUDE.md; using Google Sans Flex.
//
// The faint "0N" numeral color (#D9D9D9 in Figma) reads as a deliberate
// legibility choice here (large background-ish numbering), not the
// wrong-mode-token slip flagged elsewhere in this file — but there's no
// exact semantic token for it. border-frame (#D5D5D5) is 4 units off and
// already wired, so using that instead of a new hardcoded hex.
interface Decision {
  number: string;
  title: string;
  decision: string;
  gaveUp: string;
  why: string;
  quote?: string;
  asset: React.ReactNode;
}

const decisions: Decision[] = [
  {
    number: "01",
    title: "Verdict-first layout",
    decision:
      "Final verdict at the top. Arguments and peer rankings stacked below.",
    gaveUp:
      "Chronological order — Arguments → Peer Rankings → Verdict. The narrative journey the team expected.",
    why: "If users read arguments first they form an opinion before the verdict arrives. Showing the verdict cold preserves its objectivity as an independent signal.",
    quote: "“The team pushed back. I held the position.”",
    asset: (
      /* eslint-disable-next-line @next/next/no-img-element -- fixed decorative
         capsule content, sized to fill; see ProductBrowserMockup.tsx for the
         same Tailwind-preflight/next-image sizing conflict this avoids. */
      <ThemeSwap
        light={
          <img
            src="/images/fastrouter/fr-decision-01-verdict-first.png"
            alt="Council UI showing the Final Verdict at the top of the page, with Peer Rankings and Initial Discussions collapsed below it"
            className="block size-full object-cover object-top"
          />
        }
        dark={
          <img
            src="/images/fastrouter/fr-decision-01-verdict-first-dark.png"
            alt="Council UI showing the Final Verdict at the top of the page, with Peer Rankings and Initial Discussions collapsed below it"
            className="block size-full object-cover object-top"
          />
        }
      />
    ),
  },
  {
    number: "02",
    title: "Progressive step visibility — Arguments → Peer Review → Verdict",
    decision:
      "Each stage of deliberation is visible as it runs. Sticky status bar tracks the active stage.",
    gaveUp: "Loading spinner → result. Less complexity, faster implementation.",
    why: "Without visible stages the verdict is a black box. The three-stage visibility manages the wait and teaches users how Council works just by watching it run. Process visibility is proof of rigour.",
    asset: (
      <ThemeAwareVideo
        className="block size-full object-cover object-top"
        lightSrc="/images/fastrouter/fr-decision-02-progressive-steps.mp4"
        darkSrc="/images/fastrouter/fr-decision-02-progressive-steps-dark.mp4"
        aria-label="Council UI stepping through Stage 1 of 3 (Initial Discussions) while deliberation runs"
      />
    ),
  },
  {
    number: "03",
    title: "Presets as onboarding strategy",
    decision:
      "A curated preset library is the first thing users see — predefined councils for specific use cases, ready to run immediately.",
    gaveUp: "Blank canvas with a Create Council button.",
    why: "Council is a genuinely novel concept. A blank canvas fails when the concept itself is unfamiliar. Presets let users experience what Council does before they configure it. Post-launch: more presets were requested — the strategy worked.",
    asset: (
      /* eslint-disable-next-line @next/next/no-img-element */
      <ThemeSwap
        light={
          <img
            src="/images/fastrouter/fr-decision-03-presets.png"
            alt="Multi-Model Council preset gallery, showing a grid of predefined council cards like Job Interview Preparation and College Admissions Strategy"
            className="block size-full object-cover object-top"
          />
        }
        dark={
          <img
            src="/images/fastrouter/fr-decision-03-presets-dark.png"
            alt="Multi-Model Council preset gallery, showing a grid of predefined council cards like Job Interview Preparation and College Admissions Strategy"
            className="block size-full object-cover object-top"
          />
        }
      />
    ),
  },
  {
    number: "04",
    title: "Tabs over cards + persistent member strip",
    decision:
      "Each council member as a tab. Persistent strip shows all members, visible even when the config panel is collapsed.",
    gaveUp:
      "Card grid showing all models at once — mirrors the Playground layout.",
    why: "Cards signal parallel comparison. In peer review you're reading each member's independent evaluation sequentially. Tabs signal that correctly. The strip removes mid-session anxiety about which models are active.",
    asset: (
      <ThemeAwareVideo
        className="block size-full object-cover object-top"
        lightSrc="/images/fastrouter/fr-decision-04-persistent-strip.mp4"
        darkSrc="/images/fastrouter/fr-decision-04-persistent-strip-dark.mp4"
        aria-label="Council UI with a persistent member-avatar strip visible above the Peer Rankings stage"
      />
    ),
  },
];

// Mobile reading order (2026-07-12, explicit request): title -> asset ->
// decision/gave-up/why, vs. desktop's title-and-body-stacked-in-one-column
// beside the asset.
//
// Corrected 2026-07-12: the first version used CSS Grid with breakpoint-
// specific `grid-template-areas`, spanning the asset across the title+body
// rows. That created a real bug — when the asset's intrinsic height (tall
// videos/screenshots) exceeds title+body's combined natural height, Grid's
// row-track sizing algorithm inflates the `auto` rows to fit the spanning
// item, and does so disproportionately (mostly onto the short title row),
// then `items-center` centers content inside the now-oversized track —
// producing a large, asset-height-dependent gap under the title. Confirmed
// via screenshot: worse asset height -> worse gap, every row, exactly the
// spanning-track inflation signature.
//
// Fixed with plain flexbox instead, which has no row/column-track concept
// to inflate: the text wrapper is `contents` on mobile (removes its own
// box so title and body become direct flex children of the row, orderable
// independently) and a real `flex flex-col` box on desktop (regrouping
// title+body into one column, sized purely by their own content). `order`
// then places title/asset/body in the requested mobile sequence.
function DecisionRow({
  decision,
  isLast,
}: {
  decision: Decision;
  isLast: boolean;
}) {
  return (
    <div
      className={`flex flex-col md:flex-row gap-32px md:gap-40px items-start md:items-center pt-40px md:pt-80px w-full ${
        isLast ? "" : "pb-40px md:pb-80px border-b border-border-default"
      }`}
    >
      <div className="contents md:flex md:flex-col md:w-[440px] md:shrink-0 md:items-start">
        <div className="order-1 md:order-none flex items-center w-full">
          <span
            className="flex flex-col w-[100px] shrink-0 font-display font-bold text-[48px] leading-[56px] tracking-[-0.48px] text-border-frame"
          >
            {decision.number}
          </span>
          <span className="font-ui font-semibold text-text-primary text-[20px] leading-[26px] flex-1">
            {decision.title}
          </span>
        </div>

        <div className="order-3 md:order-none flex flex-col items-start w-full md:pt-20px">
          <div className="flex flex-col gap-12px items-start w-full">
            <div className="flex items-start w-full">
              <span className="block w-[80px] md:w-[100px] shrink-0 py-4px font-ui font-medium text-text-muted text-[14px] leading-[20px] tracking-[0.07px]">
                DECISION
              </span>
              <p className="flex-1 font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
                {decision.decision}
              </p>
            </div>
            <div className="hidden items-start w-full">
              <span className="block w-[80px] md:w-[100px] shrink-0 py-4px font-ui font-medium text-text-muted text-[14px] leading-[20px] tracking-[0.07px]">
                GAVE UP
              </span>
              <p className="flex-1 font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
                {decision.gaveUp}
              </p>
            </div>
            <div className="flex items-start w-full">
              <span className="block w-[80px] md:w-[100px] shrink-0 py-4px font-ui font-medium text-text-muted text-[14px] leading-[20px] tracking-[0.07px]">
                WHY
              </span>
              <p className="flex-1 font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
                {decision.why}
              </p>
            </div>
          </div>

          {decision.quote && (
            <div className="pt-24px pl-[40px] md:pl-[90px] w-full">
              <p className="font-display font-semibold text-text-primary text-[20px] leading-[32px]">
                {decision.quote}
              </p>
            </div>
          )}
        </div>
      </div>

      <DecisionAssetFrame className="order-2 md:order-none md:w-[500px] md:shrink-0">
        {decision.asset}
      </DecisionAssetFrame>
    </div>
  );
}

export default function FiveDecisions() {
  return (
    <section className="w-full py-80px flex flex-col items-center">
      <div className="max-w-[var(--width-content)] mx-auto px-[var(--edge-padding)] md:px-40px flex flex-col w-full">
        <div className="flex flex-col gap-24px items-start pb-32px border-b border-border-default w-full">
          <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
            FOUR DECISIONS
          </span>
          <h2
            className="max-w-[680px] font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]"
          >
            Where the decisions were made — and why.
          </h2>
        </div>

        <div className="flex flex-col items-start w-full">
          {decisions.map((decision, i) => (
            <DecisionRow
              key={decision.number}
              decision={decision}
              isLast={i === decisions.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
