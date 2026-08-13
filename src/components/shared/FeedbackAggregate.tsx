"use client";

import { useEffect, useState } from "react";
import { motion, animate } from "motion/react";
import type {
  FeedbackAggregateData,
  SingleSelectQuestion,
} from "@/components/shared/feedbackQuestions";

// Not sourced from Figma — see CaseStudyFeedback.tsx for the feature's
// provenance note. Pure presentational post-submit reveal — the fetch
// lives in CaseStudyFeedback (it already knows a submission just
// happened, so it does the GET once and hands the result down rather
// than this component re-fetching).
//
// `count < 3` is the mandatory no-pattern-yet fallback per spec — never
// seeded, never skipped. Count-up + bar-fill use Motion's imperative
// `animate()` against local number state, restrained per the spec's
// Motion notes (under 500ms, easeOut, no bounce/elastic — explicitly not
// a reward mechanic, just numbers settling).
function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const controls = animate(0, target, {
      duration: 0.5,
      ease: "easeOut",
      onUpdate: (latest) => setValue(latest),
    });
    return () => controls.stop();
  }, [target, active]);
  return value;
}

// Single reusable bar: a numeric target that counts up (formatted however
// the caller needs — "3.8 / 5" for the scale averages, "41%" for the
// breakdown rows) plus a left-to-right fill sized independently via
// `barPct` (0-100), since the two scale bars size their fill off a /5
// average while the breakdown rows size off a raw percent.
function CountUpBar({
  label,
  target,
  barPct,
  format,
  active,
}: {
  label: string;
  target: number;
  barPct: number;
  format: (value: number) => string;
  active: boolean;
}) {
  const displayed = useCountUp(target, active);
  return (
    <div className="flex flex-col gap-8px w-full">
      <div className="flex items-center justify-between">
        <span className="font-ui font-normal text-text-muted text-[13px] leading-[18px]">
          {label}
        </span>
        <span className="font-ui font-semibold text-text-primary text-[14px] leading-[20px]">
          {format(displayed)}
        </span>
      </div>
      <div className="h-[6px] rounded-full bg-bg-light overflow-hidden w-full">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: active ? `${barPct}%` : 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full rounded-full bg-text-accent"
        />
      </div>
    </div>
  );
}

interface FeedbackAggregateProps {
  data: FeedbackAggregateData;
  singleSelectQuestion: SingleSelectQuestion;
}

export default function FeedbackAggregate({
  data,
  singleSelectQuestion,
}: FeedbackAggregateProps) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    setActive(true);
  }, []);

  if (data.count < 3) {
    return (
      <p className="font-ui font-normal text-text-primary text-[16px] leading-[28px]">
        Thanks — not enough responses yet to show a pattern. Check back soon.
      </p>
    );
  }

  // Breakdown rendered as a generic labeled-bar list (same treatment as
  // Q1/Q2) rather than a single natural-language sentence — the spec's
  // "41% would've pushed back on Verdict-first too" is an illustration of
  // FastRouter's specific question wording, not a template that scans for
  // Analytics ("surprised you most") or Extensions ("handled differently")
  // too. CaseStudyFeedback has no case-study-specific copy hardcoded, so
  // this stays option-label + percent, ordered by the question's own
  // option order (not sorted by percent) so it reads as a stable list
  // across repeat visits rather than reshuffling.
  const breakdownEntries = singleSelectQuestion.options
    .filter((option) => data.q3Breakdown[option] !== undefined)
    .map((option) => [option, data.q3Breakdown[option]] as const);

  return (
    <div className="flex flex-col gap-24px w-full">
      <p className="font-ui font-semibold text-text-primary text-[16px] leading-[24px]">
        Thanks — here&rsquo;s what readers are saying.
      </p>
      {data.q1Avg !== null && (
        <CountUpBar
          label="How clear was the problem before the solution?"
          target={data.q1Avg}
          barPct={(data.q1Avg / 5) * 100}
          format={(n) => `${n.toFixed(1)} / 5`}
          active={active}
        />
      )}
      {data.q2Avg !== null && (
        <CountUpBar
          label="Did the decisions feel earned or arbitrary?"
          target={data.q2Avg}
          barPct={(data.q2Avg / 5) * 100}
          format={(n) => `${n.toFixed(1)} / 5`}
          active={active}
        />
      )}
      {breakdownEntries.length > 0 && (
        <div className="flex flex-col gap-12px w-full">
          <span className="font-ui font-normal text-text-muted text-[13px] leading-[18px]">
            {singleSelectQuestion.question}
          </span>
          {breakdownEntries.map(([option, pct]) => (
            <CountUpBar
              key={option}
              label={option}
              target={pct}
              barPct={pct}
              format={(n) => `${Math.round(n)}%`}
              active={active}
            />
          ))}
        </div>
      )}
    </div>
  );
}
