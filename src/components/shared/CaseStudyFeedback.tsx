"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ShareButton from "@/components/shared/ShareButton";
import FeedbackContainer from "@/components/shared/FeedbackContainer";
import FeedbackWizard from "@/components/shared/FeedbackWizard";
import FeedbackAggregate from "@/components/shared/FeedbackAggregate";
import type {
  CaseStudySlug,
  FeedbackAnswers,
  FeedbackAggregateData,
  SingleSelectQuestion,
} from "@/components/shared/feedbackQuestions";

// Not sourced from Figma — this feature has no Figma frames at all,
// authored directly from a feature spec. Replaces the two equal-weight
// buttons (`Let's talk` + `Share this case study`) that used to close out
// every case study's ThanksForReading.tsx with a primary quick-feedback
// flow, `Let's talk` demoted to secondary, and Share reduced to an icon.
//
// Deliberately one component holding the whole row-to-wizard-to-aggregate
// unit (not split into "CaseStudyFeedback + sibling Let's talk + sibling
// ShareButton") — the spec's own acceptance criterion ("identical
// component renders on all three pages, differing only by two props") and
// the "the CTA row collapses as one unit" requirement both require the
// whole row to live in one place so it can collapse/expand together.
//
// Revision 2 (per direct request, superseding revision 1's "don't ask
// twice, drop the button entirely" behavior — that was an explicit,
// intentional out-of-scope call in the original spec that's now reversed):
// a submitted response is editable. The primary button never disappears —
// it relabels to "Feedback received" (hover: "Edit feedback"), and
// clicking it reopens the wizard pre-filled with the visitor's own prior
// answers. Resubmitting is a real edit (see api/feedback/route.ts's
// delta-based aggregate math), not a second phantom respondent.
//
// localStorage now stores the visitor's actual answers plus a stable
// responseId (crypto.randomUUID(), generated once, reused on every edit)
// under `feedback-response:{slug}` — supersedes revision 1's boolean-only
// `feedback-submitted:{slug}` flag (that old key's value is simply
// ignored going forward; no migration needed at this scale/traffic).
// Same context-free, mount-gated read pattern already established by
// ThemeProvider.tsx/ThemeToggle.tsx for client-only state that must avoid
// a hydration mismatch: render the default (no stored answers) collapsed
// state on the server, correct after mount if a record exists.
//
// `motion`/`AnimatePresence` here (not GSAP): this is pure mount/unmount
// React state, never scroll-tied — exactly the case CLAUDE.md's animation
// split reserves for Motion. The stage swap is wrapped in
// FeedbackContainer (ResizeObserver-driven height animation) rather than
// a `<motion.div layout>` — see that file's comment for why `layout`
// visibly stretched the CTA buttons during a stage swap in revision 1.
type Stage = "collapsed" | "expanded" | "submitted";

interface StoredFeedback extends FeedbackAnswers {
  responseId: string;
}

// Shared button geometry/type for both variants. Radius is the one thing
// that differs: the vertical case studies' row is `rounded-md` (8px, the
// spec this feature was authored from), the deck slide's frame specifies
// 12px (`rounded-lg`) — Figma node 7468:22405-22409.
// Horizontal padding is the other: the stacked row is 24px at every width,
// the centred variant tightens to 16px below `md` so its three buttons fit
// one 350px row (Figma node 7494:28289 — 147 + 129 + 50 with 12px gaps).
const buttonBase =
  "flex items-center justify-center py-12px font-ui font-semibold text-[17px] leading-[28px] tracking-[0.085px] whitespace-nowrap";

const EMPTY_AGGREGATE: FeedbackAggregateData = {
  count: 0,
  q1Avg: null,
  q2Avg: null,
  q3Breakdown: {},
};

interface CaseStudyFeedbackProps {
  caseStudySlug: CaseStudySlug;
  singleSelectQuestion: SingleSelectQuestion;
  /**
   * Presentation only — every variant runs the identical flow, storage,
   * API calls and stage machine below.
   *
   * "stacked" (default): the vertical case studies' ThanksForReading row —
   * left-aligned, quick-feedback promoted to the filled primary, "Let's
   * talk" secondary on a surface, share as a 44px icon in a neutral border,
   * plus the "30 seconds max" caption. Authored from the feature spec; no
   * Figma frame exists for it.
   *
   * "centered": the slide deck's closing card (Figma node 7468:22404) —
   * the row centres, "Let's talk" is the filled primary and quick-feedback
   * and share are accent-outlined siblings at 12px radius, and the caption
   * is dropped because the frame doesn't carry it (the button's own title
   * tooltip still says it).
   *
   * It does NOT stack below `md` — the mobile frame (node 7494:28289) keeps
   * all three buttons on one row: "Let's talk" takes the remaining width,
   * quick-feedback shrinks to wrap a short "+ Feedback" label, share stays
   * its fixed 50px. That short label, the 12px gap and the 16px horizontal
   * padding are what make 350px enough for three buttons; without them the
   * row would have had to stack, which is why the derived pass this
   * supersedes did.
   *
   * The row's three widths add up to exactly 350 at Figma's 390 frame, and
   * to less than that below ~351px of viewport — so it is `flex-wrap`, and
   * "Let's talk" deliberately keeps flexbox's automatic minimum size (no
   * `min-w-0`) rather than being allowed to squeeze. Its content width IS
   * the floor, so on a 320px phone the share button drops to a second line
   * instead of the primary label overflowing its own pill.
   *
   * A variant rather than a second component so the wizard, the aggregate
   * fetch, the editable-response record and the collapse timer keep living
   * in exactly one place — the same reason this file holds the whole row in
   * the first place (see the note above).
   */
  variant?: "stacked" | "centered";
}

export default function CaseStudyFeedback({
  caseStudySlug,
  singleSelectQuestion,
  variant = "stacked",
}: CaseStudyFeedbackProps) {
  const centered = variant === "centered";
  const buttonClass = `${buttonBase} ${
    centered ? "rounded-lg px-16px md:px-24px" : "rounded-md px-24px"
  }`;
  const [stage, setStage] = useState<Stage>("collapsed");
  const [stored, setStored] = useState<StoredFeedback | null>(null);
  const [aggregate, setAggregate] = useState<FeedbackAggregateData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Bumped every time the wizard opens, passed as its `key` — forces a
  // genuinely fresh mount (step back to 0, answers back to initialAnswers)
  // every time, rather than relying on AnimatePresence's exit-animation
  // window to have already unmounted the previous instance. Without this,
  // Cancel-then-reopen inside that ~200ms window could resume the SAME
  // still-mounted FeedbackWizard at whatever step it was left on.
  const [wizardKey, setWizardKey] = useState(0);
  // Holds the auto-collapse timer scheduled after a submission lands on
  // "submitted" (see handleSubmit) — a ref, not state, since it's write-
  // only bookkeeping for cleanup, not something that should trigger a
  // render itself.
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(collapseTimer.current), []);

  const openWizard = () => {
    clearTimeout(collapseTimer.current);
    setWizardKey((k) => k + 1);
    setStage("expanded");
  };

  const storageKey = `feedback-response:${caseStudySlug}`;

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      setStored(JSON.parse(raw));
    } catch {
      // malformed/stale value — treat as never submitted
    }
  }, [storageKey]);

  const handleSubmit = async (answers: FeedbackAnswers) => {
    setSubmitting(true);
    const responseId = stored?.responseId ?? crypto.randomUUID();

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseStudySlug, responseId, ...answers }),
      });
    } catch {
      // network failure — still record locally and show the aggregate
      // view; under-count beats retry-spam, same precedent as the
      // like-button design this feature's data layer follows.
    }

    const next: StoredFeedback = { responseId, ...answers };
    localStorage.setItem(storageKey, JSON.stringify(next));
    setStored(next);

    let data: FeedbackAggregateData = EMPTY_AGGREGATE;
    try {
      const res = await fetch(`/api/feedback?slug=${caseStudySlug}`);
      if (res.ok) data = await res.json();
    } catch {
      // graceful degradation — FeedbackAggregate's own count < 3 fallback covers this.
    }
    setAggregate(data);
    setSubmitting(false);
    setStage("submitted");

    // Per direct feedback: the confirmation panel is a brief flash, not a
    // destination — hold it for ~2s (long enough to actually read "Thanks
    // — ...") then auto-return to the collapsed row, which now shows
    // "Feedback received" since `stored` is already set above. The
    // container's own height animation (FeedbackContainer) makes this
    // read as one continuous accordion motion, the same mechanism Cancel
    // already uses, not a special case.
    clearTimeout(collapseTimer.current);
    collapseTimer.current = setTimeout(() => setStage("collapsed"), 2000);
  };

  const handleCancel = () => setStage("collapsed");

  // Presentation-only, per variant. "centered" promotes "Let's talk" to the
  // filled primary and demotes quick-feedback to an accent outline; "stacked"
  // keeps the spec's original emphasis (quick-feedback filled, "Let's talk"
  // secondary on a surface).
  const feedbackButtonClass = centered
    ? "shrink-0 border border-text-accent text-text-accent"
    : "w-full sm:w-[234px] bg-text-accent border border-text-accent text-white";

  const letsTalk = (
    <a
      href="mailto:chinmay.joshi02@gmail.com"
      className={`${buttonClass} ${
        centered
          ? "flex-1 md:w-[234px] md:flex-none bg-text-accent border border-text-accent text-white"
          : "w-full sm:w-auto bg-bg-surface border border-text-muted text-text-primary"
      }`}
    >
      Let&rsquo;s talk{centered ? "" : " →"}
    </a>
  );

  // Mobile short forms for the centred variant, per Figma node 7494:28293
  // ("+ Feedback"). The frame only specifies the un-submitted state; the
  // received state's "✓ Feedback" is the same abbreviation applied to the
  // label it swaps to, so the row keeps its measured widths in both states.
  // Both are markup rather than string state so the desktop label stays the
  // canonical one and nothing re-renders on resize.
  const shortLabel = (short: string, full: string) =>
    centered ? (
      <>
        <span className="md:hidden">{short}</span>
        <span className="hidden md:inline">{full}</span>
      </>
    ) : (
      full
    );

  return (
    <FeedbackContainer>
      <AnimatePresence mode="popLayout" initial={false}>
        {stage === "collapsed" && (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-8px w-full"
          >
            {/* Order and emphasis differ by variant, so the three buttons
                are built once and arranged below rather than duplicating
                the row (and with it the stored/not-stored branch) per
                variant. The frame drops the arrow from "Let's talk" that
                the vertical row carries — copy is canonical, so the
                centred variant drops it too. */}
            <div
              className={
                centered
                  ? "flex w-full flex-row flex-wrap items-center gap-12px md:flex-nowrap md:justify-center md:gap-16px"
                  : "flex flex-col sm:flex-row gap-16px items-start w-full"
              }
            >
              {centered && letsTalk}
              {stored ? (
                <button
                  type="button"
                  onClick={openWizard}
                  title="Edit feedback"
                  aria-label="Edit feedback"
                  className={`${buttonClass} group relative ${feedbackButtonClass}`}
                >
                  <span className="group-hover:invisible">
                    {shortLabel("✓ Feedback", "Feedback received")}
                  </span>
                  <span className="invisible group-hover:visible absolute inset-0 flex items-center justify-center">
                    Edit feedback
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openWizard}
                  title="A couple of quick questions — 30 seconds, max."
                  className={`${buttonClass} ${feedbackButtonClass}`}
                >
                  {shortLabel("+ Feedback", "Give quick feedback")}
                </button>
              )}
              {!centered && letsTalk}
              <ShareButton
                iconOnly
                iconClassName={centered ? "size-24px" : "size-[16px]"}
                className={
                  centered
                    ? "flex h-[54px] w-[50px] shrink-0 items-center justify-center rounded-lg border border-text-accent text-text-accent transition-colors hover:bg-text-accent hover:text-white"
                    : "flex items-center justify-center size-[44px] shrink-0 rounded-md border border-border-default text-text-muted hover:text-text-primary transition-colors"
                }
              />
            </div>
            {/* Caption is the stacked row's own affordance — the frame for
                the centred variant doesn't carry it, and the button's title
                tooltip still says the same thing. */}
            {!stored && !centered && (
              <span className="font-ui font-normal text-text-muted text-[13px] leading-[18px]">
                A couple of quick questions · 30 seconds max
              </span>
            )}
          </motion.div>
        )}

        {stage === "expanded" && (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <FeedbackWizard
              key={wizardKey}
              singleSelectQuestion={singleSelectQuestion}
              initialAnswers={stored ?? undefined}
              submitting={submitting}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
            />
          </motion.div>
        )}

        {stage === "submitted" && aggregate && (
          <motion.div
            key="submitted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-24px w-full p-24px rounded-md border border-border-default bg-bg-surface"
          >
            <FeedbackAggregate data={aggregate} singleSelectQuestion={singleSelectQuestion} />
          </motion.div>
        )}
      </AnimatePresence>
    </FeedbackContainer>
  );
}
