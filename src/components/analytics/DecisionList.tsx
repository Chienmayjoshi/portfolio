import DecisionAssetFrame from "@/components/shared/DecisionAssetFrame";

// Local to analytics/ — a shared row renderer for the numbered DECISION/
// GAVE UP/WHY pattern used across all four Analytics features (varying
// from 1 to 3 items per feature), reusing fastrouter/FiveDecisions.tsx's
// exact DecisionRow markup/spacing (including its mobile `contents`+
// `order` reflow technique and the GAVE UP row staying present in data but
// `hidden` in the rendered output, matching that file's own convention)
// rather than re-deriving it per feature file four times.
//
// `asset` (2026-07-27): was `assetLabel: string` (always rendered via
// AssetPlaceholder). Switched to a `React.ReactNode`, matching
// fastrouter/FiveDecisions.tsx's own Decision type — real assets are
// starting to land per-decision, and DecisionAssetFrame needs to render
// whichever a given decision has (still-placeholder or real media)
// without the row template knowing which. Decisions without a real asset
// yet just pass `<AssetPlaceholder label="..." />` directly.
export interface Decision {
  number: string;
  title: string;
  decision: string;
  gaveUp: string;
  why: string;
  asset: React.ReactNode;
}

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
          <span className="flex flex-col w-[90px] shrink-0 font-display font-bold text-[48px] leading-[56px] tracking-[-0.48px] text-border-frame">
            {decision.number}
          </span>
          <span className="font-ui font-semibold text-text-primary text-[20px] leading-[26px] flex-1">
            {decision.title}
          </span>
        </div>

        <div className="order-3 md:order-none flex flex-col gap-12px items-start w-full md:pt-20px">
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
      </div>

      <DecisionAssetFrame className="order-2 md:order-none md:w-[500px] md:shrink-0">
        {decision.asset}
      </DecisionAssetFrame>
    </div>
  );
}

export default function DecisionList({ decisions }: { decisions: Decision[] }) {
  return (
    <div className="flex flex-col items-start w-full">
      {decisions.map((decision, i) => (
        <DecisionRow
          key={decision.number}
          decision={decision}
          isLast={i === decisions.length - 1}
        />
      ))}
    </div>
  );
}
