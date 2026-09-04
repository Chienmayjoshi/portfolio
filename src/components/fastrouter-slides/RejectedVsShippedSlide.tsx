import Image from "next/image";
import GridDepthLayer from "@/components/shared/GridDepthLayer";
import ThemeSwap from "@/components/shared/ThemeSwap";

// "Rejected vs shipped" slide for the Council chapter — Figma desktop node
// 7391:26319 / mobile 7391:27141, file 2aoIFdaJMyNBEWeQESBEzG. The first
// Council direction (Playground extension) set beside the shipped one, each
// with a screenshot and three reasons.
//
// Same content as the vertical-scroll route's fastrouter/RejectedVsShipped.tsx,
// but a genuinely different composition, so it's a separate component rather
// than a shared one: this slide adds a headline + supporting paragraph the
// vertical version doesn't have, puts the [REJECTED]/[SHIPPED] tag INLINE after
// the column title instead of stacked above it, drops the dividers between
// reason rows, and sets the screenshot beside its reasons on desktop instead of
// above them.
//
// ASSETS — the "-body" PNGs already contain the full app chrome (top bar with
// the FastRouter logo and org selector), so this slide uses them alone. Figma
// agrees: each card's separate chrome image (`image 56` / `image 58`) is HIDDEN
// in both frames, unlike the vertical route, which stacks a 546x80 chrome webp
// on top of the body. One image per card here.
//
// ASSET LANDMINE (inherited, not introduced — see the long note at the top of
// fastrouter/RejectedVsShipped.tsx): the two "-body.png" filenames are SWAPPED
// relative to their contents. `fr-browser-chrome-shipped-council-body.png`
// actually shows the REJECTED Playground UI, and `fr-browser-chrome-rejected-
// pg-body.png` actually shows the SHIPPED Model Council UI — verified again
// here by opening the file, not taken on trust. Wired below by what each image
// CONTAINS, not by what it is called. Renaming the source files would fix this
// for both call sites at once.
//
// Desktop values, verified per-node: header block gap-24 with the headline +
// paragraph grouped at gap-16 (7391:27080); headline Season Mix 48/56/-0.48 in
// two explicit lines (7391:27083); eyebrow Geist Mono 13/18/+0.78 in
// text-accent; column title Google Sans Flex SemiBold 17/28 with the tag in
// Geist Mono 13/18 (text-error / text-success) 16px after it; reason rows py-16
// / gap-12 / 24px icon / 14-20 body (7391:27094); card 371 beside reasons 225
// at gap-16 inside a 612 column, columns 56 apart.
//
// Mobile (7391:27141) differs in more than scale, so it isn't a pure md:
// step-down: headline 32/40/-0.32, header block a flat gap-24 (no inner
// grouping), column title 14/20, the two columns stacked 60 apart, and the
// card sits ABOVE its reasons at gap-8 rather than beside them.
//
// FIGMA CONFLICT (flagged, normalized): the supporting paragraph is bound to
// text-muted in the desktop frame and text-primary in the mobile one. Took
// text-muted for both — it's the role-correct token for a supporting line under
// a headline, and the desktop frame is where this slide's composition was
// designed. Same class of desktop/mobile disagreement as the Reframe slide's
// struck-through line.
//
// The reason-row body is bound to Brand/Dark (#1E2B14) in BOTH frames — the
// Twitter/X brand colour used by the tweet embed elsewhere in this file, and
// already identified as a copy-paste artifact in the vertical route's version
// of this section. Uses text-primary here too, for the same reason.

const REJECTED_REASONS = [
  'Multiple llm response columns side by side — signals "compare these yourself" not "here\'s a verdict"',
  "Final Verdict buried at the bottom — treated as an afterthought, not the primary output",
  "No process visibility — user sees responses and a verdict with nothing in between",
];

const SHIPPED_REASONS = [
  "Verdict-first layout — Final Verdict at the top, process stages below",
  "Three visible stages (Stage 1, 2, 3) with completion states — process is the proof of rigour",
  "Persistent member strip with avatars — council composition always visible, no mid-session anxiety about which models are active",
];

// Thumbs-down / thumbs-up marks, same paths as the vertical route's version of
// this section so the two stay identical; currentColor so each takes its
// column's semantic token.
const THUMB_DOWN =
  "M22.4831 14.7188L21.3581 5.71875C21.2896 5.17489 21.0249 4.67475 20.6137 4.31224C20.2025 3.94974 19.6732 3.74981 19.125 3.75H3C2.60218 3.75 2.22064 3.90804 1.93934 4.18934C1.65804 4.47064 1.5 4.85218 1.5 5.25V13.5C1.5 13.8978 1.65804 14.2794 1.93934 14.5607C2.22064 14.842 2.60218 15 3 15H7.03687L10.5787 22.0856C10.6411 22.2102 10.7369 22.315 10.8555 22.3882C10.9741 22.4614 11.1107 22.5001 11.25 22.5C12.2446 22.5 13.1984 22.1049 13.9017 21.4017C14.6049 20.6984 15 19.7446 15 18.75V17.25H20.25C20.5693 17.2501 20.8849 17.1823 21.176 17.051C21.467 16.9197 21.7268 16.728 21.938 16.4885C22.1492 16.2491 22.3071 15.9675 22.4011 15.6623C22.4951 15.3572 22.523 15.0355 22.4831 14.7188ZM6.75 13.5H3V5.25H6.75V13.5Z";
const THUMB_UP =
  "M21.9375 7.51125C21.7263 7.27193 21.4666 7.08028 21.1757 6.94903C20.8847 6.81778 20.5692 6.74994 20.25 6.75H15V5.25C15 4.25544 14.6049 3.30161 13.9017 2.59835C13.1984 1.89509 12.2446 1.5 11.25 1.5C11.1107 1.4999 10.9741 1.53862 10.8555 1.61181C10.7369 1.685 10.6411 1.78977 10.5787 1.91437L7.03687 9H3C2.60218 9 2.22064 9.15804 1.93934 9.43934C1.65804 9.72064 1.5 10.1022 1.5 10.5V18.75C1.5 19.1478 1.65804 19.5294 1.93934 19.8107C2.22064 20.092 2.60218 20.25 3 20.25H19.125C19.6732 20.2502 20.2025 20.0503 20.6137 19.6878C21.0249 19.3253 21.2896 18.8251 21.3581 18.2812L22.4831 9.28125C22.523 8.9644 22.495 8.64268 22.4009 8.3375C22.3068 8.03232 22.1489 7.75066 21.9375 7.51125ZM3 10.5H6.75V18.75H3V10.5Z";

// Figma's "blur" layer — a band dissolving each screenshot's bottom edge into
// the page. A MASK on the card, not an opaque gradient overlay inside it: the
// card carries a border and an 8px radius, so an overlay leaves the bottom
// border and its two corners crisply drawn behind the band — a bordered box
// with a gradient painted inside it, not something dissolving. Masking the card
// itself takes the border and corners with it. Same mechanic and ramp as the
// Conceptual Grounding tweet; the Product recording gets the same read from an
// overlay only because its container has no bottom border to give it away.
const CARD_FADE = "linear-gradient(to bottom, black 72%, transparent 97%)";

function VerdictIcon({ rejected }: { rejected: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`size-16px shrink-0 ${
        rejected ? "text-text-error" : "text-text-success"
      }`}
    >
      <path d={rejected ? THUMB_DOWN : THUMB_UP} fill="currentColor" />
    </svg>
  );
}

function ComparisonColumn({
  rejected,
  title,
  light,
  dark,
  alt,
  reasons,
}: {
  rejected: boolean;
  title: string;
  light: string;
  dark: string;
  alt: string;
  reasons: string[];
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-24px">
      {/* Title + inline verdict tag. */}
      <div className="flex items-center gap-16px">
        <span className="font-ui font-semibold text-[14px] text-text-primary leading-[20px] md:text-[17px] md:leading-[28px] md:tracking-[0.085px]">
          {title}
        </span>
        <span
          className={`shrink-0 font-mono font-medium text-[13px] uppercase leading-[18px] tracking-[0.78px] ${
            rejected ? "text-text-error" : "text-text-success"
          }`}
        >
          [{rejected ? "Rejected" : "Shipped"}]
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
              <VerdictIcon rejected={rejected} />
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

export default function RejectedVsShippedSlide() {
  return (
    <section
      id="council-rejected-shipped"
      className="relative flex h-full w-full flex-col overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:top-0 md:h-[800px]" />

      {/* Desktop centres the block in the BELOW-HEADER area (pt = header
          height + justify-center), which is exactly where Figma puts it: its
          content spans y144–834 in a 900 frame, centred on 489 — the same
          centre as the 78–900 region under the header. */}
      <div className="relative z-10 w-full px-20px pt-32px pb-40px md:flex md:h-full md:flex-col md:justify-center md:px-80px md:pb-0 md:pt-[var(--fr-header-h,0px)]">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-24px md:gap-[56px]">
          {/* Header. Mobile is a flat gap-24 stack; desktop groups the headline
              and paragraph at gap-16 under the same 24 from the eyebrow. */}
          <div className="flex flex-col gap-24px">
            <span className="font-mono font-medium text-[13px] text-text-accent uppercase leading-[18px] tracking-[0.78px]">
              Rejected vs shipped
            </span>
            <div className="flex flex-col gap-24px md:gap-16px">
              <h1 className="font-display text-slide-title-sm text-text-primary md:text-slide-title">
                Council was treated as a{" "}
                <br className="hidden md:block" />
                comparison tool.
              </h1>
              <p className="font-ui font-normal text-[16px] text-text-muted leading-[28px] tracking-[0.08px]">
                Playground &mdash; FastRouter&rsquo;s side-by-side model
                comparison view &mdash; was the natural place to build it. The
                first version tried exactly that.
              </p>
            </div>
          </div>

          {/* The two columns. 60 apart stacked (mobile), 56 apart side by side
              (desktop) — 56 isn't on the spacing scale, so it's an arbitrary
              value; a named gap-56px would silently collapse to 0. */}
          <div className="flex flex-col gap-60px md:flex-row md:gap-[56px]">
            <ComparisonColumn
              rejected
              title="Council as playground extension"
              light="/images/fastrouter/fr-browser-chrome-shipped-council-body.png"
              dark="/images/fastrouter/fr-browser-chrome-shipped-council-body-dark.png"
              alt="Rejected direction: a Playground-style layout with multiple model responses side by side and the Final Verdict buried at the bottom"
              reasons={REJECTED_REASONS}
            />
            <ComparisonColumn
              rejected={false}
              title="Council as its own surface"
              light="/images/fastrouter/fr-browser-chrome-rejected-pg-body.png"
              dark="/images/fastrouter/fr-browser-chrome-rejected-pg-body-dark.png"
              alt="Shipped design: Model Council with a verdict-first layout, three visible deliberation stages, and a persistent member strip"
              reasons={SHIPPED_REASONS}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
