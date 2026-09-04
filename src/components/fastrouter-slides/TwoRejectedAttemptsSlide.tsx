import Image from "next/image";
import GridDepthLayer from "@/components/shared/GridDepthLayer";
import ThemeSwap from "@/components/shared/ThemeSwap";

// "Two rejected attempts" slide for the Evaluations chapter — Figma desktop
// node 7421:41025 / mobile 7421:41847, file 2aoIFdaJMyNBEWeQESBEzG. Sits
// directly after EvaluationsIntroSlide: the two directions that were tried and
// dropped before the shipped single-form Evaluations flow, each with a
// screenshot and three reasons.
//
// SIBLING OF RejectedVsShippedSlide, deliberately not shared with it. Same
// Figma component family — identical header block, identical column shape,
// identical reason rows, identical bottom-fade on the card — but this one sets
// TWO REJECTED attempts against each other rather than a rejected direction
// against the shipped one. That changes three things a shared component would
// have to branch on rather than reuse: both columns carry the thumbs-DOWN mark
// in text-error (there is no "shipped" side here), the inline tag after each
// column title is a VERSION label ([V1]/[V2], text-error) instead of a verdict
// ([REJECTED]/[SHIPPED], text-error/text-success), and the eyebrow itself is
// two-toned rather than one accent run. Three branches through a five-prop
// component is worse than two flat ones; if a third slide of this shape turns
// up, that's the moment to extract.
//
// ASSETS — `fr-evals-rejected-{top,side}-stepper[-dark].png`, already in the
// repo, 1092x1176 each. That 0.9286 aspect is exactly the card's in both
// frames (371x400 desktop, 350x376.92 mobile), so the image is at its natural
// ratio and is rendered as such — no fixed card height, no object-cover crop.
// Figma's separate app-chrome images (`image 56` / `image 58`) are HIDDEN in
// both frames, same as RejectedVsShippedSlide: these PNGs already contain the
// full chrome, so it's one image per card.
//
// Desktop values, verified per-node: content block y144 h662 in the 900 frame;
// header block (7421:41786) gap-24 with the headline + paragraph grouped at
// gap-16; headline Season Mix 48/56/-0.48 on one line; eyebrow Geist Mono
// 13/18/+0.78; header to columns 40 apart; the two 612 columns 56 apart
// (7421:41791); column title Google Sans Flex SemiBold 17/28 with the version
// tag 16px after it (7421:41793); card 371 beside reasons 225 at gap-16; reason
// rows py-16 / gap-12 / 16px icon / 14-20 body.
//
// Mobile (7421:42235) is not a pure md: step-down, same as its sibling:
// headline 32/40/-0.32 and flowing (three lines), header block a flat gap-24
// with no inner grouping, header to columns 24 apart, column title 14/20, the
// two columns stacked 60 apart, and the card ABOVE its reasons at gap-8.
//
// FIGMA CONFLICT (flagged, normalized): the supporting paragraph is bound to
// text-muted in the desktop frame (7421:41790) and text-primary in the mobile
// one (7421:42241). Took text-muted for both — identical disagreement, and
// identical resolution, to RejectedVsShippedSlide's version of the same line.

const TOP_STEPPER_REASONS = [
  "Config split across three tabs — dataset, models, and metrics never visible together",
  "Wizard framing suits one-time setup — Evaluations runs on every model change",
  "Next button gates progress — can't see data preview while configuring",
];

const SIDE_STEPPER_REASONS = [
  "Four sequential steps for what the shipped version does in one scrollable form",
  "Step 1/4 framing implies a long process — raises barrier before user starts",
  "Stepping back to edit means losing forward context",
];

// Thumbs-down mark. Figma serves it here as a 16-viewBox SVG (7421:41805), but
// that is the same glyph as the 24-viewBox path RejectedVsShippedSlide already
// carries, uniformly scaled — kept at 24 so the two slides draw an identical
// mark from an identical string. currentColor, so it takes text-error from the
// wrapper.
const THUMB_DOWN =
  "M22.4831 14.7188L21.3581 5.71875C21.2896 5.17489 21.0249 4.67475 20.6137 4.31224C20.2025 3.94974 19.6732 3.74981 19.125 3.75H3C2.60218 3.75 2.22064 3.90804 1.93934 4.18934C1.65804 4.47064 1.5 4.85218 1.5 5.25V13.5C1.5 13.8978 1.65804 14.2794 1.93934 14.5607C2.22064 14.842 2.60218 15 3 15H7.03687L10.5787 22.0856C10.6411 22.2102 10.7369 22.315 10.8555 22.3882C10.9741 22.4614 11.1107 22.5001 11.25 22.5C12.2446 22.5 13.1984 22.1049 13.9017 21.4017C14.6049 20.6984 15 19.7446 15 18.75V17.25H20.25C20.5693 17.2501 20.8849 17.1823 21.176 17.051C21.467 16.9197 21.7268 16.728 21.938 16.4885C22.1492 16.2491 22.3071 15.9675 22.4011 15.6623C22.4951 15.3572 22.523 15.0355 22.4831 14.7188ZM6.75 13.5H3V5.25H6.75V13.5Z";

// Figma's "blur" layer (7421:41818 / 7421:41845) — a 56px band dissolving each
// screenshot's bottom edge into the page. A MASK on the card, not an opaque
// gradient overlay inside it, for the reason spelled out on RejectedVsShipped-
// Slide's equivalent: the card has a border and an 8px radius, and an overlay
// leaves that bottom border and its two corners crisply drawn behind the band.
//
// Stops are px-anchored rather than percentage-anchored because the band is a
// fixed 56px against a card that is 400 tall on desktop and ~377 on mobile — a
// single percentage ramp would be wrong at one of the two. Values are Figma's
// own gradient read back as mask alpha: opaque until 56px from the bottom, 0.2
// at 30px, gone by 3px.
const CARD_FADE =
  "linear-gradient(to bottom, #000 calc(100% - 56px), rgba(0,0,0,0.2) calc(100% - 30px), transparent calc(100% - 3px))";

function ThumbsDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="size-16px shrink-0 text-text-error"
    >
      <path d={THUMB_DOWN} fill="currentColor" />
    </svg>
  );
}

function AttemptColumn({
  title,
  version,
  light,
  dark,
  alt,
  reasons,
}: {
  title: string;
  version: string;
  light: string;
  dark: string;
  alt: string;
  reasons: string[];
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-24px">
      {/* Title + inline version tag. */}
      <div className="flex items-center gap-16px">
        <span className="font-ui font-semibold text-[14px] text-text-primary leading-[20px] md:text-[17px] md:leading-[28px] md:tracking-[0.085px]">
          {title}
        </span>
        <span className="shrink-0 font-mono font-medium text-[13px] text-text-error uppercase leading-[18px] tracking-[0.78px]">
          [{version}]
        </span>
      </div>

      {/* Card beside its reasons on desktop, above them on mobile. The 371/225
          desktop widths are expressed as flex ratios rather than fixed px so
          the pair keeps Figma's proportion at any column width. */}
      <div className="flex flex-col gap-8px md:flex-row md:items-start md:gap-16px">
        <div
          className="relative min-w-0 overflow-hidden rounded-[8px] border border-border-default md:flex-[371_1_0]"
          style={{ maskImage: CARD_FADE, WebkitMaskImage: CARD_FADE }}
        >
          <ThemeSwap
            light={
              <Image
                src={light}
                alt={alt}
                width={1092}
                height={1176}
                className="block h-auto w-full"
              />
            }
            dark={
              <Image
                src={dark}
                alt={alt}
                width={1092}
                height={1176}
                className="block h-auto w-full"
              />
            }
          />
        </div>

        <div className="flex min-w-0 flex-col md:flex-[225_1_0]">
          {reasons.map((reason) => (
            <div key={reason} className="flex items-start gap-12px py-16px">
              <ThumbsDownIcon />
              <p className="min-w-0 flex-1 font-ui font-normal text-[14px] text-text-primary leading-[20px] tracking-[0.07px]">
                {reason}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TwoRejectedAttemptsSlide() {
  return (
    <section
      id="evaluations-rejected"
      className="relative flex h-full w-full flex-col overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:top-0 md:h-[800px]" />

      {/* Desktop centres the block in the BELOW-HEADER area (pt = header height
          + justify-center), which is where Figma puts it: content spans y144–806
          in a 900 frame, centred on 475 against the 478 centre of the 78–900
          region under the header. */}
      <div className="relative z-10 w-full px-20px pt-32px pb-40px md:flex md:h-full md:flex-col md:justify-center md:px-80px md:pb-0 md:pt-[var(--fr-header-h,0px)]">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-24px md:gap-40px">
          {/* Header. Mobile is a flat gap-24 stack; desktop groups the headline
              and paragraph at gap-16 under the same 24 from the eyebrow. */}
          <div className="flex flex-col gap-24px">
            {/* Two-toned eyebrow: the bracketed verdict in text-error, the rest
                in the usual text-accent. */}
            <span className="font-mono font-medium text-[13px] text-text-accent uppercase leading-[18px] tracking-[0.78px]">
              <span className="text-text-error">[Rejected]</span>{" "}
              &mdash; Two attempts
            </span>
            <div className="flex flex-col gap-24px md:gap-16px">
              <h1 className="font-display text-[32px] text-text-primary leading-[40px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]">
                Sequential steps for a non-sequential workflow.
              </h1>
              <p className="font-ui font-normal text-[16px] text-text-muted leading-[28px] tracking-[0.08px]">
                Evaluations isn&rsquo;t a one-time setup &mdash; teams return to
                it every time a model or dataset changes.{" "}
                <br className="hidden md:block" />
                Both attempts still forced it through a fixed sequence, just
                arranged differently.
              </p>
            </div>
          </div>

          {/* The two attempts. 60 apart stacked (mobile), 56 apart side by side
              (desktop) — neither 56 nor 60 is on the spacing scale as a gap, so
              56 is an arbitrary value; a named gap-56px would silently collapse
              to 0. */}
          <div className="flex flex-col gap-60px md:flex-row md:gap-[56px]">
            <AttemptColumn
              title="Top Stepper"
              version="V1"
              light="/images/fastrouter/fr-evals-rejected-top-stepper.png"
              dark="/images/fastrouter/fr-evals-rejected-top-stepper-dark.png"
              alt="First rejected attempt: a New Evaluation screen with a horizontal three-tab stepper — Import Logs, Test Criteria, Review — and a Next button at the bottom"
              reasons={TOP_STEPPER_REASONS}
            />
            <AttemptColumn
              title="Side Stepper"
              version="V2"
              light="/images/fastrouter/fr-evals-rejected-side-stepper.png"
              dark="/images/fastrouter/fr-evals-rejected-side-stepper-dark.png"
              alt="Second rejected attempt: the same New Evaluation screen with a Step 1 / 4 side stepper on the left and a data preview panel on the right"
              reasons={SIDE_STEPPER_REASONS}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
