import GridDepthLayer from "@/components/shared/GridDepthLayer";
import CaseStudyFeedback from "@/components/shared/CaseStudyFeedback";
import { feedbackQuestions } from "@/components/shared/feedbackQuestions";

// Thanks card for the UltraAI deck — the closing card, sequenced after
// Reflections and lighting the rail's "Closing" tick. It is
// fastrouter-slides' ThanksSlide (Figma node 7955:284372, which is the same
// frame as FastRouter's 7468:21634): same centred layout, same measurements
// and type (documented on that file), same copy — the frame's words are about
// the reader and the case study, not about FastRouter, so nothing here is
// new or adapted. The mobile treatment is that slide's too: left-aligned,
// lead 20/26, paragraph 14/20, the CTA row staying one row.
//
// FEEDBACK: the shared `CaseStudyFeedback` row in its centred variant (the
// same one FastRouter's deck closes with), with three UltraAI settings:
// `overlay` (the stepper opens as a right-side panel on desktop and a bottom
// sheet on mobile, instead of expanding the row in place), `collectContact`
// (an optional name + email on the last step) and the final button reading
// "Send it to Chinmay". UltraAI's third question and options live in
// feedbackQuestions.ts. It started out without this button because none of
// that existed yet.
//
// Two Figma notes carried over from that slide, still flagged not fixed: the
// lead line keeps its plain hyphen ("Most people don't - I mean that.") and
// the rail mock in the frame draws 8 ticks while the real rail has 10 — the
// rail's chapter table, not the mock, is the tick count.

export default function UltraAIThanksSlide() {
  return (
    <section
      id="thanks"
      className="relative flex h-full w-full flex-col overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:top-0 md:h-[800px]" />

      {/* Desktop centres the block on the TRUE viewport centre (my-auto, not
          justify-center) inside a scrollable box. The two are not
          interchangeable: the feedback CTA expands in place into the wizard
          and then the aggregate panel — several hundred px taller than the
          collapsed row — and a `justify-center` flex parent clips the TOP of
          an overflowing child, unreachable. `my-auto` centres the same way
          while still letting the box scroll when the expanded panel is
          taller than a short laptop viewport. Scrollbar hidden the same way
          the deck's own scroller hides its own; overscroll chaining is left
          ON so reaching the end of this box still advances the deck. */}
      <div className="relative z-10 flex w-full flex-col px-20px pt-32px pb-40px md:h-full md:overflow-y-auto md:px-80px md:py-40px md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-40px md:my-auto md:gap-16px">
          {/* Header */}
          <div className="flex flex-col items-start gap-24px md:items-center">
            <span className="text-left font-mono font-medium text-[13px] text-text-accent uppercase leading-[18px] tracking-[0.78px] md:text-center">
              Thanks for reading
            </span>
            <h1 className="w-full text-left font-display text-slide-title-sm text-text-primary md:text-center md:text-slide-title">
              That&rsquo;s the thinking, start to finish.
            </h1>
          </div>

          {/* Body. The lead line and the paragraph are grouped so they can
              sit 16px apart on mobile (Figma's `reveal rows` wrapper gap)
              while everything else in the body stays 40 — on desktop the
              group's gap matches the body's, so the three blocks read as
              one evenly-spaced stack there, which is what node 7468:22393
              specifies. */}
          <div className="flex flex-col gap-40px">
            <div className="flex flex-col gap-16px md:gap-40px">
              <p className="w-full text-left font-ui font-semibold text-[20px] text-text-primary leading-[26px] tracking-[-0.1px] md:text-center md:text-[17px] md:leading-[28px] md:tracking-[0.085px]">
                You read the whole thing. Most people don&rsquo;t - I mean that.
              </p>

              {/* Figma's two-line break is held with an md: block span (the
                  technique the hero headline uses), so the designed break
                  survives on desktop and the sentence reflows to the column
                  below md instead of breaking mid-thought on a phone. The
                  trailing space inside the span is what keeps the two halves
                  separated when they're inline. */}
              <p className="w-full text-left font-ui font-normal text-[14px] text-text-muted leading-[20px] tracking-[0.07px] md:text-center md:text-[16px] md:leading-[28px] md:tracking-[0.08px]">
                <span className="md:block">
                  If you want to dig into anything I skimmed over, process, edge
                  cases, the trade-offs that didn&rsquo;t fit on the page,{" "}
                </span>
                <span className="md:block">
                  reply by email or send this to a teammate.
                </span>
              </p>
            </div>

            {/* The centred feedback row (Figma 7468:22405-22410): "Let's talk"
                the filled primary, feedback and share accent-outlined, one
                row at every width. Feedback opens as a side panel / bottom
                sheet rather than expanding the row. */}
            <div className="mx-auto w-full max-w-[720px]">
              <CaseStudyFeedback
                caseStudySlug="ultraai"
                singleSelectQuestion={feedbackQuestions.ultraai}
                variant="centered"
                overlay
                collectContact
                submitLabel="Send it to Chinmay"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
