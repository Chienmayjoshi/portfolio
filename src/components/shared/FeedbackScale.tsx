"use client";

import { motion } from "motion/react";

// Not sourced from Figma — see CaseStudyFeedback.tsx for the feature's
// provenance note. Reusable 5-point segmented scale used twice per
// CaseStudyFeedback instance (Q1, Q2) — a real segmented control (single
// sliding fill behind the active segment via Motion's `layout` prop), not
// raw radio buttons, per the feature spec's Motion notes.
//
// `layoutId` is derived from `question` so the two simultaneously-mounted
// instances (Q1 + Q2) never cross-animate into each other's indicator —
// Motion matches layoutId within the whole page's layout tree, not just
// within one component instance.
const POINTS = [1, 2, 3, 4, 5];

interface FeedbackScaleProps {
  question: string;
  leftLabel: string;
  rightLabel: string;
  value: number | undefined;
  onChange: (value: number) => void;
}

export default function FeedbackScale({
  question,
  leftLabel,
  rightLabel,
  value,
  onChange,
}: FeedbackScaleProps) {
  return (
    <div className="flex flex-col gap-12px w-full">
      <p className="font-ui font-normal text-text-primary text-[16px] leading-[24px]">
        {question}
      </p>
      <div
        role="radiogroup"
        aria-label={question}
        className="flex items-stretch gap-4px p-4px rounded-md bg-bg-light w-full"
      >
        {POINTS.map((point) => {
          const selected = value === point;
          return (
            <button
              key={point}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(point)}
              className="relative flex-1 py-8px font-ui font-medium text-[14px] leading-[20px] rounded-[4px]"
            >
              {selected && (
                <motion.div
                  layoutId={`feedback-scale-fill-${question}`}
                  className="absolute inset-0 bg-bg-surface rounded-[4px] shadow-sm"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span
                className={`relative z-10 ${selected ? "text-text-primary" : "text-text-muted"}`}
              >
                {point}
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between">
        <span className="font-ui font-normal text-text-muted text-[13px] leading-[18px]">
          {leftLabel}
        </span>
        <span className="font-ui font-normal text-text-muted text-[13px] leading-[18px]">
          {rightLabel}
        </span>
      </div>
    </div>
  );
}
