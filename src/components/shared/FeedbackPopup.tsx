"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import FeedbackContainer from "@/components/shared/FeedbackContainer";
import type {
  FeedbackAnswers,
  SingleSelectQuestion,
} from "@/components/shared/feedbackQuestions";

// The feedback stepper drawn as Figma's "feedback popup" — file
// 2aoIFdaJMyNBEWeQESBEzG, frames 8118:28852 (scale), 8125:791 (pills) and
// 8125:1623 (take + contact), all inside node 8129:29734. Same data and API as
// FeedbackWizard (q1, q2, q3, comment, + name/email); this is the presentation
// the overlay uses. FeedbackWizard is untouched and still drives the in-place
// rows on the other case studies.
//
// The card chrome (surface, 20px radius, shadow, 40px padding) belongs to
// FeedbackOverlay, the shell this sits in. Here: logo tile, the
// "Your Opinion Matter" row with Cancel, a 28px heading, the step body, and a
// footer of "n of N" + Back / Next.
//
// DIFFERENCES FROM THE FRAME, flagged:
// - Figma draws 3 steps (scale, pills, take). The flow here keeps the second
//   scale ("Did the decisions feel earned or arbitrary?") so it is 4: its
//   answers feed the same aggregates the other case studies use. Drop it from
//   this array if the design is meant to be 3.
// - Figma's pills are multi-select and name FastRouter-ish parts. The API
//   stores one q3 string, so the pills are single-select (tap again to clear)
//   in the frame's look, with the case study's own options.
// - The primary on the last step reads `submitLabel`, not the frame's "Send",
//   and Name carries "(optional)" like Email — both per direct instruction.
// - Figma shows an explicit Next on every step, so there is no auto-advance.
// - The scale is a draggable track with a gradient fill, from node 8120:79
//   (see `Scale`), not the segmented control the in-place stepper uses.
//
// "Skip" sits on the last step only, as drawn: it sends what is answered so
// far, without the take or the contact.
const SCALES = [
  {
    question: "How clear was the problem before you saw the solution?",
    left: "Confusing",
    right: "Crystal clear",
  },
  {
    question: "Did the decisions feel earned or arbitrary?",
    left: "Arbitrary",
    right: "Convincing",
  },
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const slide = {
  enter: { x: 24, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -24, opacity: 0, pointerEvents: "none" as const },
};

const heading =
  "w-full font-ui font-semibold text-[22px] leading-[30px] tracking-[-0.1px] text-text-primary md:text-[28px] md:leading-[40px]";
const fieldLabel =
  "font-ui font-medium text-[14px] leading-[normal] text-text-primary";
const input =
  "w-full rounded-[12px] bg-bg-light px-16px font-ui font-normal text-[16px] text-text-primary outline-none placeholder:text-text-muted focus:ring-1 focus:ring-text-accent";
const footerButton =
  "flex h-[48px] items-center justify-center rounded-[10px] px-8px py-[14px] font-ui font-medium text-[16px] text-text-muted";

interface FeedbackPopupProps {
  singleSelectQuestion: SingleSelectQuestion;
  initialAnswers?: FeedbackAnswers;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (answers: FeedbackAnswers) => void;
  /** Name + email on the last step. */
  collectContact?: boolean;
  /** Label of the final primary button. */
  submitLabel?: string;
}

// The rating track and its fill — Figma node 8120:79 ("feedback rating dark",
// dragging 3 / rated 5). The fill is a left-to-right gradient, olive to green,
// reaching the selected number; short of 5 its right end fades out ("range
// fill": #8f7f2c -> #4c9a2b at 60% -> transparent), at 5 it runs solid to the
// end. Numbers inside the fill go semibold and light, the rest stay muted.
// The track is draggable (pointer capture, so the drag keeps working off the
// bar) and a tap sets a value too; it is also a keyboard slider (arrows,
// Home/End). Only the dark frame is drawn: the light theme reuses the same
// gradient, with white numbers on it, which is the one assumption here. The two
// colours are Figma's own, not in design-tokens.json — a proposed pair.
const FILL_FADE =
  "linear-gradient(to right, #8f7f2c 0%, #4c9a2b 60%, rgba(76,154,43,0) 100%)";
const FILL_SOLID = "linear-gradient(to right, #8f7f2c, #4c9a2b)";

function Scale({
  index,
  value,
  onChange,
}: {
  index: 0 | 1;
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  const s = SCALES[index];
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const fromPointer = (clientX: number) => {
    const r = trackRef.current?.getBoundingClientRect();
    if (!r || r.width === 0) return;
    const n = Math.ceil(((clientX - r.left) / r.width) * 5);
    onChange(Math.min(5, Math.max(1, n)));
  };

  const fillWidth = `${((value ?? 0) / 5) * 100}%`;
  const spring = { type: "spring", stiffness: 380, damping: 36 } as const;

  return (
    <>
      <h2 className={heading}>{s.question}</h2>
      <div className="flex w-full flex-col gap-16px">
        <div
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-label={s.question}
          aria-valuemin={1}
          aria-valuemax={5}
          aria-valuenow={value}
          aria-valuetext={value ? `${value} of 5` : "not rated"}
          onPointerDown={(e) => {
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            fromPointer(e.clientX);
          }}
          onPointerMove={(e) => {
            if (dragging.current) fromPointer(e.clientX);
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
          onKeyDown={(e) => {
            const v = value ?? 0;
            const next =
              e.key === "ArrowRight" || e.key === "ArrowUp"
                ? Math.min(5, v + 1)
                : e.key === "ArrowLeft" || e.key === "ArrowDown"
                  ? Math.max(1, v - 1)
                  : e.key === "Home"
                    ? 1
                    : e.key === "End"
                      ? 5
                      : null;
            if (next !== null) {
              e.preventDefault();
              onChange(next);
            }
          }}
          className="relative h-[44px] w-full cursor-pointer touch-pan-y select-none overflow-hidden rounded-[12px] bg-bg-light outline-none focus-visible:ring-1 focus-visible:ring-text-accent"
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 rounded-[12px]"
            style={{ backgroundImage: FILL_FADE }}
            initial={false}
            animate={{ width: fillWidth, opacity: value === 5 ? 0 : 1 }}
            transition={spring}
          />
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 rounded-[12px]"
            style={{ backgroundImage: FILL_SOLID }}
            initial={false}
            animate={{ width: fillWidth, opacity: value === 5 ? 1 : 0 }}
            transition={spring}
          />
          <div className="absolute inset-0 flex items-center">
            {[1, 2, 3, 4, 5].map((n) => {
              const inFill = value !== undefined && n <= value;
              return (
                <span
                  key={n}
                  className={`flex h-full flex-1 items-center justify-center font-ui text-[16px] transition-colors duration-200 ${
                    inFill ? "font-semibold text-white" : "font-normal text-text-muted"
                  }`}
                >
                  {n}
                </span>
              );
            })}
          </div>
        </div>
        <div className="flex justify-between font-ui font-medium text-[14px] leading-[20px] tracking-[0.07px]">
          <span className="text-text-error">{s.left}</span>
          <span className="text-text-success">{s.right}</span>
        </div>
      </div>
    </>
  );
}

function Pills({
  question,
  value,
  onChange,
}: {
  question: SingleSelectQuestion;
  value: string | undefined;
  onChange: (v: string | undefined) => void;
}) {
  return (
    <>
      <h2 className={heading}>{question.question}</h2>
      <div
        role="group"
        aria-label={question.question}
        className="flex w-full flex-wrap gap-12px"
      >
        {question.options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? undefined : option)}
              className={`flex items-center gap-8px rounded-full border py-10px pr-16px pl-[14px] font-ui font-medium text-[16px] transition-colors ${
                selected
                  ? "border-text-accent bg-text-accent/[0.08] text-text-accent"
                  : "border-border-default bg-bg-surface text-text-primary hover:border-text-muted"
              }`}
            >
              {selected ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/images/feedback/fb-check.svg" alt="" width={16} height={16} />
              ) : (
                <span aria-hidden="true" className="text-[15px] text-text-muted">
                  +
                </span>
              )}
              {option}
            </button>
          );
        })}
      </div>
    </>
  );
}

export default function FeedbackPopup({
  singleSelectQuestion,
  initialAnswers,
  submitting,
  onCancel,
  onSubmit,
  collectContact = false,
  submitLabel = "Send",
}: FeedbackPopupProps) {
  const [step, setStep] = useState(0);
  const [q1, setQ1] = useState(initialAnswers?.q1);
  const [q2, setQ2] = useState(initialAnswers?.q2);
  const [q3, setQ3] = useState(initialAnswers?.q3);
  const [comment, setComment] = useState(initialAnswers?.comment ?? "");
  const [name, setName] = useState(initialAnswers?.name ?? "");
  const [email, setEmail] = useState(initialAnswers?.email ?? "");
  const [tried, setTried] = useState(false);

  const last = 3;
  const total = last + 1;
  const emailTrim = email.trim();
  const emailInvalid =
    collectContact && tried && emailTrim !== "" && !EMAIL_RE.test(emailTrim);

  // Every step change clears a stale "fix your email" state.
  const go = (to: number) => {
    setTried(false);
    setStep(to);
  };

  const send = (withText: boolean) => {
    if (withText && collectContact && emailTrim !== "" && !EMAIL_RE.test(emailTrim)) {
      setTried(true);
      return;
    }
    onSubmit({
      q1,
      q2,
      q3,
      ...(withText && {
        comment: comment.trim() || undefined,
        ...(collectContact && {
          name: name.trim() || undefined,
          email: emailTrim || undefined,
        }),
      }),
    });
  };

  return (
    <div className="flex w-full flex-col gap-24px md:gap-32px">
      <div className="flex flex-col gap-24px md:gap-32px">
        {/* Logo tile: the exported frame is 56px (it carries its own shadow),
            drawn in a 48px box turned -4deg, as in Figma. */}
        <div className="flex size-[51.231px] items-center justify-center">
          <div className="relative size-[48px] -rotate-4">
            <div className="absolute inset-[0_-8.33%_-16.67%_-8.33%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/feedback/fb-logo.svg" alt="" className="block size-full max-w-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-24px">
          <div className="flex items-center justify-between">
            <span className="font-mono font-medium text-[13px] text-text-primary uppercase leading-[18px] tracking-[0.78px]">
              Your Opinion Matter
            </span>
            <button
              type="button"
              onClick={onCancel}
              className="font-ui font-medium text-[14px] text-text-muted leading-[20px] tracking-[0.07px] transition-colors hover:text-text-primary"
            >
              Cancel
            </button>
          </div>

          <FeedbackContainer>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={step}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex flex-col gap-24px"
              >
                {step === 0 && <Scale index={0} value={q1} onChange={setQ1} />}
                {step === 1 && <Scale index={1} value={q2} onChange={setQ2} />}
                {step === 2 && (
                  <Pills question={singleSelectQuestion} value={q3} onChange={setQ3} />
                )}
                {step === 3 && (
                  <>
                    <h2 className={heading}>Tell me how you would have solved it.</h2>
                    <div className="flex flex-col gap-8px">
                      <label htmlFor="fb-take" className={fieldLabel}>
                        Your take
                      </label>
                      <textarea
                        id="fb-take"
                        rows={3}
                        maxLength={1000}
                        placeholder="I would have..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className={`${input} h-[80px] resize-none py-[14px]`}
                      />
                    </div>
                    {collectContact && (
                      <div className="grid grid-cols-1 gap-16px sm:grid-cols-2">
                        <div className="flex flex-col gap-8px">
                          <label htmlFor="fb-name" className={fieldLabel}>
                            Name (optional)
                          </label>
                          <input
                            id="fb-name"
                            type="text"
                            autoComplete="name"
                            maxLength={80}
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`${input} h-[48px]`}
                          />
                        </div>
                        <div className="flex flex-col gap-8px">
                          <label htmlFor="fb-email" className={fieldLabel}>
                            Email (optional)
                          </label>
                          <input
                            id="fb-email"
                            type="email"
                            autoComplete="email"
                            maxLength={120}
                            placeholder="you@email.com"
                            value={email}
                            aria-invalid={emailInvalid}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") send(true);
                            }}
                            className={`${input} h-[48px] ${emailInvalid ? "ring-1 ring-text-error" : ""}`}
                          />
                          {emailInvalid && (
                            <span className="font-ui text-[13px] text-text-error leading-[18px]">
                              That email doesn&rsquo;t look right. Fix it or clear it.
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </FeedbackContainer>
        </div>
      </div>

      {/* Footer. Desktop: counter (+ Skip on the last step) left, buttons
          right, one row. Phone: the buttons first and full-width, the counter
          under them — "Send it to Chinmay" will not share a 310px row with
          Back, the counter and Skip. */}
      <div className="flex flex-col-reverse gap-8px sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-8px">
          <span className="px-8px py-[14px] font-ui font-normal text-[14px] text-text-muted">
            {step + 1} of {total}
          </span>
          {step === last && (
            <>
              <span aria-hidden="true" className="size-[6px] rounded-full bg-text-muted" />
              <button
                type="button"
                disabled={submitting}
                onClick={() => send(false)}
                className={`${footerButton} transition-colors hover:text-text-primary disabled:opacity-60`}
              >
                Skip
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-12px sm:gap-16px">
          <button
            type="button"
            onClick={() => go(Math.max(0, step - 1))}
            aria-hidden={step === 0}
            tabIndex={step === 0 ? -1 : 0}
            className={`${footerButton} w-[92px] shrink-0 border border-border-default transition-colors hover:text-text-primary ${
              step === 0 ? "pointer-events-none opacity-0" : ""
            }`}
          >
            Back
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => (step === last ? send(true) : go(step + 1))}
            className="flex h-[48px] flex-1 items-center justify-center whitespace-nowrap rounded-[10px] bg-text-accent px-[28px] py-[14px] font-ui font-medium text-[16px] text-white disabled:opacity-60 sm:flex-none"
          >
            {step === last ? submitLabel : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
