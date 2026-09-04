import Image from "next/image";
import GridDepthLayer from "@/components/shared/GridDepthLayer";
import ThemeSwap from "@/components/shared/ThemeSwap";

// "Shipped version" slide for the Evaluations chapter — Figma desktop node
// 7421:42301 / mobile 7421:43093, file 2aoIFdaJMyNBEWeQESBEzG. The answer to
// TwoRejectedAttemptsSlide, which it follows directly: one unified form instead
// of either stepper, with three thumbs-up reasons and a closing pull-quote that
// concedes what the unified form still didn't solve.
//
// THIRD SLIDE OF THIS SHAPE, and still not extracted into a shared component
// with RejectedVsShippedSlide / TwoRejectedAttemptsSlide — see the note on the
// latter, which said a third one would be the moment to reconsider. It isn't,
// because this one breaks the shape rather than repeating it: ONE full-width
// card instead of two half-width ones, no column title at all (Figma's title
// row 7421:43069 is hidden in both frames), reason rows at gap-16 instead of
// gap-12, and a closing pull-quote the other two don't have. What the three
// share is a header block and a reason row — both a handful of classes. The
// composition, which is what a shared component would own, differs every time.
//
// ASSET — `fr-evals-shipped-body[-dark].png`, already in the repo. 1160x706,
// aspect 1.6431, which is exactly Figma's 613x373 card: the image is at its
// natural ratio, no crop on desktop. Figma's separate chrome image (`image 56`)
// is HIDDEN in both frames because this PNG already contains the full app
// chrome — verified by opening the file, and the same arrangement as both
// sibling slides.
//
// NOTE for whoever touches the long-form route next: fastrouter/Evaluations-
// Feature.tsx stacks `fr-evals-shipped-chrome.png` ON TOP of this same body
// image, which double-draws the chrome the body already has. Not fixed here —
// different route, different component, and out of this slide's scope — but
// it's a real duplication, not a difference of composition.
//
// Desktop values, verified per-node: content block y164 h655 in the 900 frame;
// header block (7421:43062) gap-24 with the headline + paragraph grouped at
// gap-16; headline Season Mix 48/56/-0.48 in two explicit lines; eyebrow Geist
// Mono 13/18/+0.78 in text-success (not text-accent — this is the shipped
// slide); header to the columns 56 apart; two 612 columns 56 apart; reason rows
// py-16 / gap-16 / 16px icon / 14-20 body; reasons to pull-quote 40 apart;
// pull-quote Google Sans Flex SemiBold 17/28.
//
// Mobile (7421:43483) as usual is not a pure md: step-down: headline 32/40 over
// four lines, header block a flat gap-24 with no inner grouping, header to the
// block 24 apart, card to reasons 8 apart, and reasons to pull-quote 24 rather
// than 40.
//
// BOTH LINE BREAKS ARE UNCONDITIONAL, unlike the sibling slides' md:-only ones.
// Figma's mobile frame keeps them: the headline's 160px box is four 40px lines
// with "Unified form." alone on the first, and the paragraph's 112px box is
// four 28px lines with line two ending short at "workspace;". Both are sentence
// boundaries, so they hold at every width rather than needing to be dropped on
// a narrow screen.
//
// The reason-row body is bound to Brand/Dark (#1E2B14) here too — the same
// copy-paste artifact already identified on both sibling slides (it's the
// tweet embed's brand colour). Uses text-primary, as they do.
//
// MOBILE CARD — ONE DELIBERATE DEVIATION FROM FIGMA, flagged rather than
// silently taken. The screenshot is landscape (1.64), so scaling it to a 350px
// mobile column would render it 213px tall and completely illegible. Figma's
// answer is to keep the image at its DESKTOP pixel size (613px wide) inside the
// 350px column, so the left config panel — the thing the slide is about — stays
// readable and the data preview runs off the right. That decision is kept here.
// What isn't kept is that in Figma the overflow bleeds past the card's own edge
// out to the frame boundary, leaving the card with no right border. Here the
// card clips its own content instead, so the border and 8px radius close on all
// four sides like every other card in the deck. Net difference: about 20px less
// image and a drawn right edge. Flip `overflow-hidden` off and the Figma
// behaviour is back, if the bleed was intended.
const SHIPPED_REASONS = [
  "Full config visible in one scrollable left panel — name, dataset, models, metrics, API key",
  "Data preview persistent on the right — configure and validate simultaneously",
  "Run button always in view — no wizard gates, no forced sequence",
];

// Thumbs-up mark, the 24-viewBox path both sibling slides carry, so all three
// draw an identical glyph from an identical string. currentColor takes
// text-success from the wrapper.
const THUMB_UP =
  "M21.9375 7.51125C21.7263 7.27193 21.4666 7.08028 21.1757 6.94903C20.8847 6.81778 20.5692 6.74994 20.25 6.75H15V5.25C15 4.25544 14.6049 3.30161 13.9017 2.59835C13.1984 1.89509 12.2446 1.5 11.25 1.5C11.1107 1.4999 10.9741 1.53862 10.8555 1.61181C10.7369 1.685 10.6411 1.78977 10.5787 1.91437L7.03687 9H3C2.60218 9 2.22064 9.15804 1.93934 9.43934C1.65804 9.72064 1.5 10.1022 1.5 10.5V18.75C1.5 19.1478 1.65804 19.5294 1.93934 19.8107C2.22064 20.092 2.60218 20.25 3 20.25H19.125C19.6732 20.2502 20.2025 20.0503 20.6137 19.6878C21.0249 19.3253 21.2896 18.8251 21.3581 18.2812L22.4831 9.28125C22.523 8.9644 22.495 8.64268 22.4009 8.3375C22.3068 8.03232 22.1489 7.75066 21.9375 7.51125ZM3 10.5H6.75V18.75H3V10.5Z";

// Figma's "blur" layer (7421:43076) — a 56px band dissolving the screenshot's
// bottom edge into the page. Identical mechanic, and identical px-anchored
// stops, to TwoRejectedAttemptsSlide: a MASK on the card rather than a gradient
// overlay inside it, so the bottom border and its two corners dissolve with the
// image instead of staying crisply drawn behind the band.
//
// Figma's mobile frame stacks TWO overlapping blur layers here (7421:43498 at
// 612x56 and 7421:43512 at 372x35, offset from each other by 1.5px). That's
// leftover, not a two-stage ramp — the desktop frame has one. One band here.
const CARD_FADE =
  "linear-gradient(to bottom, #000 calc(100% - 56px), rgba(0,0,0,0.2) calc(100% - 30px), transparent calc(100% - 3px))";

function ThumbsUpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="size-16px shrink-0 text-text-success"
    >
      <path d={THUMB_UP} fill="currentColor" />
    </svg>
  );
}

const SHIPPED_ALT =
  "Shipped Evaluations form: a single scrollable page with Evaluation Name, Dataset, Models to Compare, and Evaluation Metrics in the left panel, a persistent Data preview on the right, and the Run button always in view";

export default function ShippedUnifiedFormSlide() {
  return (
    <section
      id="evaluations-shipped"
      className="relative flex h-full w-full flex-col overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:top-0 md:h-[800px]" />

      {/* Desktop centres the block in the BELOW-HEADER area (pt = header height
          + justify-center), which is where Figma puts it: content spans y164–819
          in a 900 frame, centred on 491 against the 489 centre of the 78–900
          region under the header. */}
      <div className="relative z-10 w-full px-20px pt-32px pb-40px md:flex md:h-full md:flex-col md:justify-center md:px-80px md:pb-0 md:pt-[var(--fr-header-h,0px)]">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-24px md:gap-[56px]">
          {/* Header. Mobile is a flat gap-24 stack; desktop groups the headline
              and paragraph at gap-16 under the same 24 from the eyebrow. */}
          <div className="flex flex-col gap-24px">
            <span className="font-mono font-medium text-[13px] text-text-success uppercase leading-[18px] tracking-[0.78px]">
              Shipped version
            </span>
            <div className="flex flex-col gap-24px md:gap-16px">
              <h1 className="font-display text-[32px] text-text-primary leading-[40px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]">
                Unified form.
                <br />
                Not a wizard. A workspace you return to.
              </h1>
              <p className="font-ui font-normal text-[16px] text-text-muted leading-[28px] tracking-[0.08px]">
                The stepper framing assumed a first-time setup. Evaluations is
                closer to a workspace;
                <br />
                Reopened every time a model or dataset changes, not walked
                through once.
              </p>
            </div>
          </div>

          {/* Card beside the reasons on desktop (two equal 612 columns, 56
              apart), above them on mobile at gap-8. */}
          <div className="flex flex-col gap-8px md:flex-row md:items-start md:gap-[56px]">
            {/* The card. Desktop: full column width at the image's natural
                ratio. Mobile: the image held at its 613px desktop size (see the
                long note above) and clipped by the card. */}
            <div
              className="relative min-w-0 overflow-hidden rounded-[8px] border border-border-default md:flex-1"
              style={{ maskImage: CARD_FADE, WebkitMaskImage: CARD_FADE }}
            >
              <ThemeSwap
                light={
                  <Image
                    src="/images/fastrouter/fr-evals-shipped-body.png"
                    alt={SHIPPED_ALT}
                    width={1160}
                    height={706}
                    className="block h-auto w-[613px] max-w-none md:w-full"
                  />
                }
                dark={
                  <Image
                    src="/images/fastrouter/fr-evals-shipped-body-dark.png"
                    alt={SHIPPED_ALT}
                    width={1160}
                    height={706}
                    className="block h-auto w-[613px] max-w-none md:w-full"
                  />
                }
              />
            </div>

            {/* Reasons, then the closing pull-quote. 40 apart on desktop, 24 on
                mobile — which on mobile is also the gap the card→reasons 8
                sits against, so the quote reads as its own beat rather than a
                fourth reason. */}
            <div className="flex min-w-0 flex-col gap-24px md:flex-1 md:gap-40px">
              <div className="flex min-w-0 flex-col">
                {SHIPPED_REASONS.map((reason) => (
                  <div key={reason} className="flex items-start gap-16px py-16px">
                    <ThumbsUpIcon />
                    <p className="min-w-0 flex-1 font-ui font-normal text-[14px] text-text-primary leading-[20px] tracking-[0.07px]">
                      {reason}
                    </p>
                  </div>
                ))}
              </div>

              <p className="font-ui font-semibold text-[17px] text-text-primary leading-[28px] tracking-[0.085px]">
                The unified form solved setup for power users. For someone
                running their first evaluation, it was still overwhelming.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
