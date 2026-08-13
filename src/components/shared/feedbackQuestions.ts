// Not sourced from Figma — the Case Study Feedback Section is authored in
// code from a direct feature spec, not a Figma frame. Single source of
// truth for the three case-specific Q3 configs (copied verbatim from that
// spec's table — never invent replacement copy) plus the shared types.
// Imported by all three case-study page.tsx files AND by
// src/app/api/feedback/route.ts, so client-rendered options and
// server-side validation can never drift apart.
export type CaseStudySlug = "fastrouter" | "analytics" | "extensions";

export const caseStudySlugs: CaseStudySlug[] = [
  "fastrouter",
  "analytics",
  "extensions",
];

export interface SingleSelectQuestion {
  question: string;
  options: string[];
}

export const feedbackQuestions: Record<CaseStudySlug, SingleSelectQuestion> = {
  fastrouter: {
    question: "Which Council call would you have pushed back on?",
    options: [
      "Verdict-first",
      "Presets-as-onboarding",
      "Tabs-over-cards",
      "None",
    ],
  },
  analytics: {
    question: "Which decision surprised you most?",
    options: [
      "Depth-first metric creation",
      "Faulty metrics surfaced",
      "Loader-as-recommendation",
    ],
  },
  extensions: {
    question: "Which constraint would you have handled differently?",
    options: ["ATF-as-product", "Mobile gesture seam", "Always-visible panel"],
  },
};

export interface FeedbackAggregateData {
  count: number;
  q1Avg: number | null;
  q2Avg: number | null;
  /** option -> percent (0-100); only options with at least one response are present */
  q3Breakdown: Record<string, number>;
}

/** The four answerable fields, shared by the wizard's local state, the
 *  localStorage record, and the API payload — all optional, since nothing
 *  gates submission on a complete set of answers. */
export interface FeedbackAnswers {
  q1?: number;
  q2?: number;
  q3?: string;
  comment?: string;
}

export interface FeedbackSubmission extends FeedbackAnswers {
  caseStudySlug: CaseStudySlug;
  /** Stable per-visitor id (crypto.randomUUID(), generated once at first
   *  submit and reused on every edit) — lets the server tell a first-time
   *  create apart from an edit of an existing response, and compute
   *  delta-correct aggregate adjustments on edit (see route.ts). */
  responseId: string;
}
