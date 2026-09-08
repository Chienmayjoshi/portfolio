import CaseStudyFeedback from "@/components/shared/CaseStudyFeedback";
import GridDepthLayer from "@/components/shared/GridDepthLayer";
import { feedbackQuestions } from "@/components/shared/feedbackQuestions";

// Source of truth: Figma node 7468:21634 ("thanks"), file
// 2aoIFdaJMyNBEWeQESBEzG — the deck's closing card, sequenced right after
// ReflectionsSlide and lighting the rail's new "Closing" tick (per direct
// instruction; see SegmentedRail's CHAPTERS table).
//
// Desktop measurements, per node rather than assumed (content node
// 7468:22393, 1280 wide at x80/y284 in the 900 frame): content gap-16
// between the header group and the body group; header gap-24; body gap-40
// between the lead line, the paragraph and the CTA row; CTA row gap-16,
// centred. Everything is centre-aligned, unlike every other slide in the
// deck.
//
// Type, per node: eyebrow Geist Mono Medium 13/18/+0.78 uppercase in
// text-accent; headline Season Mix 48/56/-0.48 (exactly the
// `text-slide-title` token); lead line Google Sans Flex SemiBold
// 17/28/+0.085 in text-primary; paragraph GSF Regular 16/28/+0.08 in
// text-muted, broken onto two lines in the frame.
//
// Vertical placement is the full frame's centre (content 284–616 in a 900
// frame, centre 450), NOT the below-header remainder that Reflections
// centres in — so no `--fr-header-h` padding here. At 284px down, the
// content clears the ~74px transparent header at any realistic viewport.
//
// Two Figma notes, flagged not silently fixed:
// - The lead line reads "Most people don't - I mean that." with a plain
//   hyphen where the sentence wants a dash. Copy is canonical, so the
//   hyphen is kept verbatim; only the apostrophes are rendered as proper
//   ’ (which is what the frame's own second paragraph uses in "didn’t").
// - The frame's rail mock draws 8 ticks; the real rail has 10 now. The
//   mock is decorative in this frame, not a rail spec — SegmentedRail's
//   CHAPTERS table is the source of truth for tick count.
//
// Mobile IS Figma-locked as of 2026-09-08: node 7494:27824 (named
// "reflections - mobile" — stale name, duplicated from that frame; its
// content is this slide), content node 7494:28213. It supersedes the
// derived mobile pass this file shipped with on 2026-09-07, and it
// confirms that pass's two judgement calls — 20px page padding and the
// whole block LEFT-aligned rather than inheriting the desktop frame's
// centring. Centring stays a desktop-only treatment, returning at `md`.
//
// What the frame CHANGES from the derived pass, all of it mobile-only:
// - Rhythm. Figma's stack is outer gap-24 / header gap-24 / body gap-24,
//   with the lead+paragraph pair sitting inside a `reveal rows` wrapper
//   carrying py-16 and gap-16. That wrapper is animation scaffolding, not
//   a box — flattened here to the visual result it produces: header→body
//   40 (24 + 16), eyebrow→headline 24, lead→paragraph 16,
//   paragraph→CTA 40 (16 + 24).
// - Body type. The lead line steps UP to the `decision-title` style
//   (20/26/-0.1) and the paragraph steps DOWN to `caption-regular`
//   (14/20/+0.07). The old comment here argued body type deliberately
//   does not shrink on mobile, reasoning from the Council/Evaluations
//   intro frames; that was a derivation, and a real frame for this slide
//   now outranks it. Figma binds the lead line to DM Sans via
//   `decision-title` — stale, per CLAUDE.md's known-gaps list; Google
//   Sans Flex is correct and is what renders.
// - The CTA row stays a horizontal 3-up row instead of stacking to
//   full-width buttons, with a short "+ Feedback" label. That lives in
//   `CaseStudyFeedback`'s centred variant, not here.
//
// Clearance for the floating section pill (which was covering the share
// button when this was the last slide, reported directly) is NOT here:
// it lives as bottom padding on the touch stack itself in
// fastrouter-slides/page.tsx, since the thing the pill can cover is the
// END of the stack, not this particular card. ReadNextSlide now follows
// this one anyway.
export default function ThanksSlide() {
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

            {/* Behaviour is untouched — same component, same wiring, as the
                vertical case studies' ThanksForReading: "Let's talk" is the
                mailto, "Give quick feedback" opens the same wizard against
                the same aggregate API and localStorage record, share is the
                same Web Share / clipboard-copy button. Only the
                presentation is this frame's: centred row, "Let's talk"
                promoted to the filled primary, feedback and share as
                accent-outlined siblings (`variant="centered"`).
                Width-capped so the expanded wizard/aggregate panel doesn't
                stretch across the full 1280px content column. */}
            <div className="mx-auto w-full max-w-[720px]">
              <CaseStudyFeedback
                caseStudySlug="fastrouter"
                singleSelectQuestion={feedbackQuestions.fastrouter}
                variant="centered"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
