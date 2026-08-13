import ScreenshotFrame from "@/components/shared/ScreenshotFrame";
import AssetPlaceholder from "@/components/shared/AssetPlaceholder";
import ThemeAwareVideo from "@/components/shared/ThemeAwareVideo";
import ThemeSwap from "@/components/shared/ThemeSwap";
import RejectedDirectionCard from "@/components/analytics/RejectedDirectionCard";
import DecisionList, { type Decision } from "@/components/analytics/DecisionList";

// Source of truth: Figma nodes 6379:57168 (feature intro), 6379:57188
// (rejected direction), 6379:57232 (three DECISIONS) — Analytics file,
// per CLAUDE.md. Same section rhythm/typography as
// fastrouter/CouncilIntro.tsx + fastrouter/FiveDecisions.tsx.
const decisions: Decision[] = [
  {
    number: "01",
    title: "Depth-first inline creation",
    decision:
      "Inline creation triggered directly from the formula builder's autocomplete. When a user types @ and the metric doesn't exist, they create it without leaving the current popup. The new metric is fully saved before they return to the parent formula — preserved exactly where they left it.",
    gaveUp: "The top-down flow. Intuitive on paper, unworkable in practice.",
    why: "Depth-first mirrors how the mental model actually works. Users think: I need A, which needs B, which needs C. Create C. Create B using C. Create A using B. The interface now follows that logic rather than demanding the reverse.",
    // Dark variant added 2026-07-27 — switched from a plain <video> (used
    // while only the light capture existed) to ThemeAwareVideo, matching
    // fastrouter/FiveDecisions.tsx's own light/dark video decisions.
    asset: (
      <ThemeAwareVideo
        className="block size-full object-cover object-top"
        lightSrc="/images/analytics/an-depth-first-inline-creation.mp4"
        darkSrc="/images/analytics/an-depth-first-inline-creation-dark.mp4"
        aria-label="Inline metric creation triggered from the formula builder's autocomplete"
      />
    ),
  },
  {
    number: "02",
    title: "Breadcrumb trail as location system",
    decision:
      "A persistent breadcrumb at the top of every popup showing the full creation chain at any depth.",
    gaveUp: "A cleaner popup surface without navigation chrome.",
    why: "Deep chains are real — three or four levels is not unusual. Without a location system, users lose track of where they are. The breadcrumb makes the full dependency structure legible while building it.",
    // Dark variant added 2026-07-27 — switched from a plain <img> (used
    // while only the light capture existed) to ThemeSwap, matching
    // fastrouter/FiveDecisions.tsx's own light/dark image decisions.
    asset: (
      /* eslint-disable-next-line @next/next/no-img-element -- fixed
         decorative capsule content, sized to fill; see
         ProductBrowserMockup.tsx for the same Tailwind-preflight/
         next-image sizing conflict this avoids. */
      <ThemeSwap
        light={
          <img
            src="/images/analytics/an-breadcrumb-trail-as-location-system.png"
            alt="Persistent breadcrumb at the top of a metric-creation popup, showing the full creation chain"
            className="block size-full object-cover object-top"
          />
        }
        dark={
          <img
            src="/images/analytics/an-breadcrumb-trail-as-location-system-dark.png"
            alt="Persistent breadcrumb at the top of a metric-creation popup, showing the full creation chain"
            className="block size-full object-cover object-top"
          />
        }
      />
    ),
  },
  {
    number: "03",
    title: "Flow state protection at every exit point",
    decision:
      "Cancel and X both trigger a confirmation step before dismissing. Edit mode re-entry for an on-the-fly created metric without abandoning the parent formula. Edit permissions from the model respected inline.",
    gaveUp: "Conventional close behaviour — close is close.",
    why: "Flow state protection that stops at the primary flow and ignores exit conditions is incomplete. A partially built dependency chain has value worth protecting. The confirmation is acknowledgment that context built mid-formula matters.",
    // Light + dark both landed together (2026-07-27) — straight to
    // ThemeAwareVideo, no interim plain-<video> step needed.
    asset: (
      <ThemeAwareVideo
        className="block size-full object-cover object-top"
        lightSrc="/images/analytics/an-flow-state-protection-at-every-exit-point.mp4"
        darkSrc="/images/analytics/an-flow-state-protection-at-every-exit-point-dark.mp4"
        aria-label="Exit confirmation step on a partially built metric, protecting in-progress creation flow"
      />
    ),
  },
];

interface FeatureMetricCreationProps {
  id?: string;
}

export default function FeatureMetricCreation({ id }: FeatureMetricCreationProps) {
  return (
    <section id={id} className="w-full py-80px flex justify-center">
      <div className="max-w-[var(--width-content)] w-full flex flex-col px-[var(--edge-padding)] md:px-40px">
        <div className="w-full flex flex-col gap-32px">
          <div className="flex gap-12px items-center">
            <span className="font-ui font-medium text-text-accent text-[13px] uppercase tracking-[0.78px]">
              FEATURE 01
            </span>
            <span className="font-ui text-text-muted text-[13px] uppercase tracking-[0.78px]">
              ·
            </span>
            <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
              ON-THE-FLY METRIC CREATION
            </span>
          </div>

          <div className="pb-32px border-b border-border-default w-full">
            <h2 className="max-w-[680px] font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]">
              Mid-formula, users hit a wall the interface wasn&rsquo;t built
              to handle.
            </h2>
          </div>

          <p className="font-ui">
            <span className="font-semibold text-text-primary text-[17px] leading-[28px] tracking-[0.085px]">
              Problem:{" "}
            </span>
            <span className="font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
              Metrics in this system are built from other metrics — a
              calculated metric might reference a filtered metric, which
              references a base metric. Chains of dependencies, sometimes
              several levels deep.
            </span>
          </p>

          <p className="font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
            Mid-formula, users would hit a missing dependency. A metric
            their calculation needed hadn&rsquo;t been created yet. Old
            flow: abandon the formula in progress, navigate to metric
            management, create the missing metric, return, reconstruct
            context. For a two or three level chain, this happened
            multiple times before a single formula was complete.
          </p>

          <p className="font-display font-semibold text-text-primary text-[20px] leading-[32px]">
            The mental model was moving forward. The interface kept forcing
            it backward.
          </p>

          <ScreenshotFrame aspectRatio="980/500" className="max-w-[980px]">
            <AssetPlaceholder label="[ Screenshot — on-the-fly metric creation ]" />
          </ScreenshotFrame>

          <RejectedDirectionCard
            title="Top-down creation flow"
            tag="analytics"
            description="Build the primary metric first, name its dependencies, create each in sequence. Navigation between metrics in the chain was provided."
            whyTitle="Technical reality, not design merit"
            whyDescription="A metric must exist at the backend before it can be referenced in another formula. Preserving partial state across multiple unsaved forms simultaneously wasn't feasible. The most natural design solution failed on technical reality, not design merit."
          />
        </div>

        <div className="w-full flex flex-col pt-64px">
          <div className="flex flex-col gap-24px items-start pb-32px border-b border-border-default w-full">
            <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
              three DECISIONS
            </span>
            <h3 className="max-w-[680px] font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]">
              Where the decisions were made — and why.
            </h3>
          </div>

          <DecisionList decisions={decisions} />
        </div>
      </div>
    </section>
  );
}
