import Image from "next/image";
import GridDepthLayer from "@/components/shared/GridDepthLayer";

// "The Brief" slide for the Council chapter — sits right after the Model
// Council feature intro. Figma desktop node 7166:85380 / mobile 7317:13031,
// file 2aoIFdaJMyNBEWeQESBEzG.
//
// A torn paper note (the verbatim brief) on the left, an annotation on the
// right that reframes it, joined by a hand-drawn arrow. Desktop is a two-column
// row; mobile stacks the note over the annotation with the arrow tucked under
// the note and a scroll-down "↓" at the end.
//
// ASSETS / how each mark is reproduced:
//   - Paper texture: public/images/fastrouter/fr-brief-paper.png (the only
//     raster — a subtle grain, multiplied over a warm cream base so the note
//     reads as paper regardless of how flat the export is).
//   - Ruled lines: Figma ships them as an SVG of #6B6B6B dotted lines
//     (dasharray "1 3") spaced by the quote's line-height. Reproduced in CSS
//     (a tiled radial-dot gradient, --rule-h = the vertical period) so they
//     scale to both fixed card sizes without shipping two fixed SVGs.
//   - Eyebrow underline: a hairline #C9C9C9 rule.
//   - Arrows: inline SVG (the two hand-drawn strokes, #424242), currentColor so
//     they stay visible when the slide follows the theme into dark.
//
// The card is a FIXED-size element per breakpoint (mobile 320×380, desktop
// 500×600), tilted -3°, so its children are placed at the exact Figma
// coordinates rather than a fluid layout.
//
// DARK MODE (not in Figma — only light frames were provided, so this is an
// inferred-but-safe default, flagged): the slide follows the theme, but the
// paper note is forced light (`light` scope) so it stays a bright cream object
// with dark ink on a dark page, and the highlighted callout line keeps dark ink
// so it reads on the yellow highlight in either theme.

// Dotted ruled-paper lines as a tiled radial-dot gradient. --rule-h (the row
// pitch) is set responsively on the element: 28px mobile / 44px desktop, each
// matching that breakpoint's quote line-height so text sits on the rules.
const RULED_LINES_STYLE: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(circle at 0.6px 0.6px, #6B6B6B 0.6px, transparent 1px)",
  backgroundSize: "4px var(--rule-h)",
};

// Verbatim brief. Colour-only emphasis (Figma renders both the base and the
// stressed phrase in the same Season Mix weight — only the ink differs: muted
// grey vs primary). The blank middle line keeps the two sentences one ruled
// row apart.
function BriefQuote() {
  return (
    <>
      <p className="mb-0">
        <span>&ldquo;LLMs are </span>
        <span className="text-text-primary">
          better at synthesizing and judging
        </span>
        <span> than generating content.</span>
      </p>
      <p aria-hidden="true" className="mb-0">
        &nbsp;
      </p>
      <p className="mb-0">
        We want to show how a council of models can produce a better output by
        mixing their responses.&rdquo;
      </p>
    </>
  );
}

// The paper note. Fixed size, tilted, forced-light so its ink reads on the
// cream in either page theme. Absolutely-placed children at Figma coordinates.
function BriefCard() {
  return (
    <div className="light relative -rotate-3 h-[380px] w-[320px] shrink-0 overflow-hidden rounded-[4px] bg-[#F1ECE1] shadow-[0px_8px_24px_0px_rgba(149,157,165,0.2)] md:h-[600px] md:w-[500px]">
      <Image
        src="/images/fastrouter/fr-brief-paper.png"
        alt=""
        fill
        sizes="500px"
        className="pointer-events-none select-none object-cover mix-blend-multiply"
      />

      {/* Dotted rules. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[24px] top-[117px] h-[224px] w-[272px] [--rule-h:28px] md:left-[40px] md:top-[162px] md:h-[352px] md:w-[415px] md:[--rule-h:44px]"
        style={RULED_LINES_STYLE}
      />

      {/* Eyebrow + underline. */}
      <div className="absolute left-[24px] top-[40px] w-[286px] md:left-[40px] md:top-[56px] md:w-[415px]">
        <span className="font-mono font-medium text-[13px] uppercase leading-[18px] tracking-[0.78px] text-text-accent">
          THE BRIEF · LLM COUNCIL
        </span>
        <div className="mt-[10px] h-px w-full bg-[#C9C9C9]" />
      </div>

      {/* Quote — Season Mix, muted with the stressed phrase in primary ink. */}
      <div className="absolute left-[24px] top-[92px] w-[272px] font-display text-[20px] leading-[28px] tracking-[0.5px] text-text-muted md:left-[40px] md:top-[125px] md:w-[421px] md:text-[32px] md:leading-[44px]">
        <BriefQuote />
      </div>
    </div>
  );
}

// Hand-drawn arrow. viewBox is the raw Figma stroke; preserveAspectRatio="none"
// lets the caller stretch it to the Figma bounding box. currentColor so it
// tracks a theme-aware text colour.
function BriefArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 74.0295 103"
      fill="none"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M71.5497 1.50022C75.8874 29.2399 68.0566 84.7194 2.0292 84.7194M23.2621 101.5L2.0292 84.7194L19.1525 59.7194"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Mobile arrow — a separate hand-drawn stroke (Figma flips it vertically to
// point up at the note); baked the flip into the path's own box via scaleY(-1).
function BriefArrowMobile({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 43.0093 59.0003"
      fill="none"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      style={{ transform: "scaleY(-1)" }}
    >
      <path
        d="M40.9607 1.50022C43.3898 17.0345 39.0045 48.103 2.0292 48.103M13.9196 57.5002L2.0292 48.103L11.6182 34.103"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function BriefSlide() {
  return (
    <section
      id="council-brief"
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:top-0 md:h-[800px]" />

      {/* ---------- Desktop: two-column row ---------- */}
      {/* Figma content frame is 1069×625 (card 530 slot + 80 gap + 459
          annotation). Kept as a fixed relative box so the arrow can sit at its
          exact Figma coordinate between the two columns. */}
      <div className="relative z-10 hidden h-[625px] w-[1069px] max-w-[calc(100%-160px)] items-center md:flex">
        <div className="flex h-full w-[530px] shrink-0 items-center justify-center">
          <BriefCard />
        </div>

        <div className="ml-[80px] flex w-[459px] flex-col gap-[40px] text-text-muted">
          <p className="font-ui font-semibold text-[17px] leading-[28px] tracking-[0.085px]">
            That&rsquo;s an engineering observation.
            <br />
            The question it doesn&rsquo;t answer is
          </p>
          <div className="font-ui font-semibold text-[28px] leading-[40px] tracking-[-0.1px] text-text-primary">
            <span className="block">If AI is judging AI,</span>
            <span className="relative block w-fit whitespace-nowrap">
              <span
                aria-hidden="true"
                className="absolute inset-y-0 right-[-8px] left-[-12px] bg-[#ffeaa0]"
              />
              <span className="relative text-[#0d0d0d]">
                why would a user trust the verdict?
              </span>
            </span>
          </div>
        </div>

        {/* Curved arrow between the note and the annotation (Figma node
            7177:96608, at content-relative x539 y177, 122×112). Figma displays
            the exported stroke flipped vertically (its arrowhead points UP-left
            into the note) — the design-context export dropped that transform,
            so -scale-y-100 restores it. */}
        <BriefArrow className="pointer-events-none absolute top-[177px] left-[466px] h-[112px] w-[122px] -scale-y-100 text-[#424242] dark:text-[#8f8f8f]" />
      </div>

      {/* ---------- Mobile: stacked column ---------- */}
      {/* mb-16px: extra 16px below the brief so the gap to the NEXT slide in the
          touch stack (the deck's 48px inter-slide gap) reads as 64px — replacing
          the removed scroll-down "↓" that used to separate the two sections. */}
      <div className="relative z-10 mb-16px flex w-full max-w-[430px] flex-col items-center gap-24px px-20px md:hidden">
        {/* Note + its up-arrow, anchored to the note's lower-right. */}
        <div className="relative">
          <BriefCard />
          <BriefArrowMobile className="pointer-events-none absolute right-[36px] bottom-[-12px] h-[56px] w-[40px] text-[#424242] dark:text-[#8f8f8f]" />
        </div>

        <p className="w-full text-center font-ui font-normal text-[18px] leading-[30px] tracking-[0.09px] text-text-muted">
          That&rsquo;s an engineering observation. The question it doesn&rsquo;t
          answer is:
        </p>

        <div className="flex flex-col items-center font-ui font-semibold text-[17px] leading-[28px] tracking-[0.085px]">
          <span className="text-text-primary">If AI is judging AI,</span>
          <span className="bg-[#ffeb8c] px-8px text-[#0d0d0d]">
            why would a user trust the verdict?
          </span>
        </div>
      </div>
    </section>
  );
}
