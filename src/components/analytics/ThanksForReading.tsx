import CaseStudyFeedback from "@/components/shared/CaseStudyFeedback";
import { feedbackQuestions } from "@/components/shared/feedbackQuestions";

// Source of truth: Figma node 6379:57813 (Analytics file, per CLAUDE.md).
// Copy here is verbatim-identical to fastrouter/ThanksForReading.tsx's —
// same closing block across case studies, headline/body untouched. Bottom
// CTA row replaced with <CaseStudyFeedback> per the Case Study Feedback
// Section spec — see fastrouter/ThanksForReading.tsx's comment.

export default function ThanksForReading() {
  return (
    <section className="w-full py-80px flex justify-center">
      <div className="max-w-[var(--width-content)] w-full px-[var(--edge-padding)] md:px-40px flex flex-col gap-32px">
        <div className="pb-32px border-b border-border-default flex flex-col gap-32px w-full">
          <span className="font-ui font-medium text-text-accent text-[13px] uppercase tracking-[0.78px]">
            Thanks for reading
          </span>
          <h2 className="max-w-[680px] capitalize font-display font-bold text-text-primary text-[26px] leading-[34px] tracking-[0.3px] md:text-[32px] md:leading-[44px] md:tracking-[0.5px]">
            That&rsquo;s the thinking, start to finish.
          </h2>
        </div>

        <div className="pb-32px border-b border-border-default flex flex-col gap-32px w-full">
          <p className="font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
            <span className="block">
              If you want to dig into anything I skimmed over, process,
              edge cases, the trade-offs that didn&rsquo;t fit on the page,
            </span>
            <span className="block">
              reply by email or send this to a teammate.
            </span>
          </p>

          <CaseStudyFeedback
            caseStudySlug="analytics"
            singleSelectQuestion={feedbackQuestions.analytics}
          />
        </div>
      </div>
    </section>
  );
}
