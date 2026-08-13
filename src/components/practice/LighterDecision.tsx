// Not sourced from Figma — /practice has no Figma frames (see posts.ts).
// The decision block of the Lighter Format detail template: three
// label/paragraph rows (DECISION / TRADEOFF / WHY), reusing the inner-row
// markup of extensions/DecisionList.tsx's DecisionRow (100px label
// column, same type ramp) minus the number, asset frame, and array
// mapping. Local to practice/ — per-folder duplication of this row shape
// is the codebase's established convention (fastrouter, analytics, and
// extensions already hold independent copies).
//
// Scalar props, not a Decision[] — this is the Lighter Format's
// structural scope cap: one decision per build post, by design (spec: a
// writeup that wants multiple decisions is scope creep toward a 4th case
// study). Don't turn these into an array.
interface LighterDecisionProps {
  decision: string;
  tradeoff: string;
  reason: string;
}

const rows = [
  { label: "DECISION", key: "decision" },
  { label: "TRADEOFF", key: "tradeoff" },
  { label: "WHY", key: "reason" },
] as const;

export default function LighterDecision(props: LighterDecisionProps) {
  return (
    <div className="flex flex-col gap-12px items-start w-full pt-20px">
      {rows.map((row) => (
        <div key={row.key} className="flex items-start w-full">
          <span className="block w-[80px] md:w-[100px] shrink-0 py-4px font-ui font-medium text-text-muted text-[14px] leading-[20px] tracking-[0.07px]">
            {row.label}
          </span>
          <p className="flex-1 font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
            {props[row.key]}
          </p>
        </div>
      ))}
    </div>
  );
}
