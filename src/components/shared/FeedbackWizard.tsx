"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import FeedbackContainer from "@/components/shared/FeedbackContainer";
import FeedbackScale from "@/components/shared/FeedbackScale";
import type {
  FeedbackAnswers,
  SingleSelectQuestion,
} from "@/components/shared/feedbackQuestions";

// Not sourced from Figma — see CaseStudyFeedback.tsx for the feature's
// provenance note. Revision 2 (per direct request): replaces the earlier
// single long stacked panel (Q1 + Q2 + Q3 + comment all visible at once)
// with a one-question-at-a-time wizard — answer a question, it slides to
// the next, so a reader focuses on one thing.
//
// Auto-advance: selecting an option on Q1/Q2/Q3 highlights immediately,
// then after ~350ms slides to the next step — long enough to register the
// choice, short enough not to feel laggy. Re-selecting before the timer
// fires resets it; the timer is cleared on unmount (Cancel, or the parent
// collapsing this away) so it can never fire against gone state.
//
// The comment step (last) has no natural single-click "done" signal for
// free text — it originally paired "Submit feedback" with a "Skip"
// button that submitted with no comment. Removed per direct feedback: a
// user who hadn't touched Submit at all still ended up submitting real
// feedback, which read as an accidental side effect of dismissing the
// step. The field's own "(optional)" label already communicates that
// leaving it blank is fine; Submit feedback is now the only action here,
// sent with whatever's typed, including nothing. Cancel (chrome above the
// step AnimatePresence, present on every step) is the only way to leave
// without submitting — it abandons the whole flow and never touches the
// API, unlike a real Submit.
//
// The slide transition is Motion's standard direction-aware `custom` +
// AnimatePresence recipe. `direction` is always 1 here (no back button is
// in scope) but the variant fn still branches on it for whenever one is
// added.
//
// `pointerEvents: "none"` on the exit keyframe: `mode="popLayout"` takes
// the exiting step out of layout flow (position: absolute) but doesn't
// make it unclickable — for the ~250ms it's fading out, it's still sat
// there, still wired to its own (already-answered) onChange handlers.
// Without this, a fast click during that window can land on the old step
// instead of the new one. pointerEvents isn't something Motion tweens; it
// takes effect the instant this keyframe starts, closing the gap.
const slideVariants = {
  enter: (direction: 1 | -1) => ({ x: direction > 0 ? 32 : -32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: 1 | -1) => ({
    x: direction > 0 ? -32 : 32,
    opacity: 0,
    pointerEvents: "none" as const,
  }),
};

const AUTO_ADVANCE_DELAY = 350;

interface FeedbackWizardProps {
  singleSelectQuestion: SingleSelectQuestion;
  initialAnswers?: FeedbackAnswers;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (answers: FeedbackAnswers) => void;
}

function SingleSelectStep({
  question,
  value,
  onChange,
}: {
  question: SingleSelectQuestion;
  value: string | undefined;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-12px w-full">
      <p className="font-ui font-normal text-text-primary text-[16px] leading-[24px]">
        {question.question}
      </p>
      <div
        role="radiogroup"
        aria-label={question.question}
        className="flex flex-wrap gap-8px"
      >
        {question.options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option)}
              className={`rounded-full border px-16px py-8px font-ui font-medium text-[14px] leading-[20px] transition-colors ${
                selected
                  ? "border-text-accent bg-text-accent text-white"
                  : "border-border-default text-text-muted hover:text-text-primary"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CommentStep({
  value,
  onChange,
  submitting,
  onSubmitFeedback,
}: {
  value: string;
  onChange: (value: string) => void;
  submitting: boolean;
  onSubmitFeedback: () => void;
}) {
  const buttonClass =
    "flex items-center justify-center px-24px py-12px rounded-md font-ui font-semibold text-[17px] leading-[28px] tracking-[0.085px] whitespace-nowrap";
  return (
    <div className="flex flex-col gap-24px w-full">
      <div className="flex flex-col gap-8px w-full">
        <label className="font-ui font-normal text-text-primary text-[16px] leading-[24px]">
          One thing that would make this stronger?{" "}
          <span className="text-text-muted">(optional)</span>
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-16px py-12px rounded-md border border-border-default bg-bg-primary font-ui font-normal text-text-primary text-[15px] leading-[22px] outline-none focus:border-text-accent"
        />
      </div>
      {/* Skip removed (per direct feedback) — a dedicated Skip button next
          to Submit made an empty-comment submission feel like an
          unintended side effect of dismissing the step, since nothing
          the user clicked said "submit." The "(optional)" label above
          already tells them the field isn't required; Submit feedback is
          now the only action, sent with whatever's typed (including
          nothing). */}
      <div className="flex flex-col sm:flex-row gap-16px items-start w-full">
        <button
          type="button"
          onClick={onSubmitFeedback}
          disabled={submitting}
          className={`${buttonClass} w-full sm:w-[234px] bg-text-accent border border-text-accent text-white disabled:opacity-60`}
        >
          Submit feedback
        </button>
      </div>
    </div>
  );
}

export default function FeedbackWizard({
  singleSelectQuestion,
  initialAnswers,
  submitting,
  onCancel,
  onSubmit,
}: FeedbackWizardProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [q1, setQ1] = useState<number | undefined>(initialAnswers?.q1);
  const [q2, setQ2] = useState<number | undefined>(initialAnswers?.q2);
  const [q3, setQ3] = useState<string | undefined>(initialAnswers?.q3);
  const [comment, setComment] = useState(initialAnswers?.comment ?? "");
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  function selectAndAdvance<T>(
    setValue: (value: T) => void,
    value: T,
    nextStep: number
  ) {
    setValue(value);
    clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      setDirection(1);
      setStep(nextStep);
    }, AUTO_ADVANCE_DELAY);
  }

  return (
    <FeedbackContainer>
      <div className="flex flex-col gap-24px w-full p-24px rounded-md border border-border-default bg-bg-surface">
        <div className="flex items-center justify-end w-full">
          <button
            type="button"
            onClick={onCancel}
            className="font-ui font-normal text-text-muted text-[14px] leading-[20px] hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
        </div>

        <AnimatePresence custom={direction} mode="popLayout" initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {step === 0 && (
              <FeedbackScale
                question="How clear was the problem before you saw the solution?"
                leftLabel="Confusing"
                rightLabel="Crystal clear"
                value={q1}
                onChange={(v) => selectAndAdvance(setQ1, v, 1)}
              />
            )}
            {step === 1 && (
              <FeedbackScale
                question="Did the decisions feel earned or arbitrary?"
                leftLabel="Arbitrary"
                rightLabel="Convincing"
                value={q2}
                onChange={(v) => selectAndAdvance(setQ2, v, 2)}
              />
            )}
            {step === 2 && (
              <SingleSelectStep
                question={singleSelectQuestion}
                value={q3}
                onChange={(v) => selectAndAdvance(setQ3, v, 3)}
              />
            )}
            {step === 3 && (
              <CommentStep
                value={comment}
                onChange={setComment}
                submitting={submitting}
                onSubmitFeedback={() =>
                  onSubmit({ q1, q2, q3, comment: comment || undefined })
                }
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </FeedbackContainer>
  );
}
