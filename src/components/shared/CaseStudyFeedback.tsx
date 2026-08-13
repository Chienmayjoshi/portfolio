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

const buttonClass =
  "flex items-center justify-center px-24px py-12px rounded-md font-ui font-semibold text-[17px] leading-[28px] tracking-[0.085px] whitespace-nowrap";

const EMPTY_AGGREGATE: FeedbackAggregateData = {
  count: 0,
  q1Avg: null,
  q2Avg: null,
  q3Breakdown: {},
};

interface CaseStudyFeedbackProps {
  caseStudySlug: CaseStudySlug;
  singleSelectQuestion: SingleSelectQuestion;
}

export default function CaseStudyFeedback({
  caseStudySlug,
  singleSelectQuestion,
}: CaseStudyFeedbackProps) {
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
            <div className="flex flex-col sm:flex-row gap-16px items-start w-full">
              {stored ? (
                <button
                  type="button"
                  onClick={openWizard}
                  title="Edit feedback"
                  aria-label="Edit feedback"
                  className={`${buttonClass} group relative w-full sm:w-[234px] bg-text-accent border border-text-accent text-white`}
                >
                  <span className="group-hover:invisible">Feedback received</span>
                  <span className="invisible group-hover:visible absolute inset-0 flex items-center justify-center">
                    Edit feedback
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openWizard}
                  title="A couple of quick questions — 30 seconds, max."
                  className={`${buttonClass} w-full sm:w-[234px] bg-text-accent border border-text-accent text-white`}
                >
                  Give quick feedback
                </button>
              )}
              <a
                href="mailto:chinmay.joshi02@gmail.com"
                className={`${buttonClass} w-full sm:w-auto bg-bg-surface border border-text-muted text-text-primary`}
              >
                Let&rsquo;s talk →
              </a>
              <ShareButton
                iconOnly
                className="flex items-center justify-center size-[44px] shrink-0 rounded-md border border-border-default text-text-muted hover:text-text-primary transition-colors"
              />
            </div>
            {!stored && (
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
