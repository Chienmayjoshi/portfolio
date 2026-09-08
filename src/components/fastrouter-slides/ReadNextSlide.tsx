"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import ArmEnterLink from "@/components/shared/ArmEnterLink";
import AssetPlaceholder from "@/components/shared/AssetPlaceholder";
import GridDepthLayer from "@/components/shared/GridDepthLayer";
import { armCaseStudyEnter } from "@/components/shared/caseStudyEnterArming";

// Source of truth: Figma desktop node 7471:22432 ("read next") / mobile node
// 7474:24046 (named "feature 1 - llm council - mobile" — stale name, it was
// duplicated from that frame; its content is this slide). The deck's last
// slide, second of the Closing chapter after ThanksSlide.
//
// Desktop (content node 7471:23159, 1280 wide at x80/y147 in the 900 frame —
// centred on the full frame, like ThanksSlide, so no `--fr-header-h` offset):
// `items-center justify-between`, left column 600 wide with gap-16 between its
// two blocks; block one gap-32 (eyebrow → headline), block two gap-40 + pb-40
// (paragraph → progress line); image card 600×606, radius 24.
// Mobile (7474:24069): 20px page padding, one `bg-bg-surface` card at radius
// 12 with p-16 and gap-24; eyebrow row carries a right-aligned arrow the
// desktop frame has no equivalent of; image 260 tall; the progress line is
// HIDDEN in the frame — see the auto-advance note below.
//
// Shadows, per direct instruction 2026-09-08, against Figma: the frame's
// 0 12 16 rgba(0,0,0,.25) drop-shadow on the IMAGE card is dropped at both
// widths — it reads as a UI screenshot pasted onto the page rather than
// part of it, and on mobile it doubled up with the card it sits inside.
// In its place the mobile card itself carries a very subtle lift
// (0 2 8 rgba(0,0,0,.06)) so the surface separates from the page ground;
// desktop has no card to lift, so it gets nothing. Figma wants updating.
//
// Type, per node: eyebrow Geist Mono Medium 13/18/+0.78 uppercase in
// text-accent; headline Season Mix 48/56/-0.48 desktop, 32/40/-0.32 mobile
// (exactly the `text-slide-title` / `-sm` tokens); paragraph Google Sans Flex
// Regular 16/28/+0.08 desktop, 18/30/+0.09 mobile.
//
// Four Figma notes, flagged not silently fixed:
// - The paragraph is bound to `text-muted` on desktop and `text-primary` on
//   mobile. Took text-muted for both — role-correct for a supporting line, and
//   the same call already made on RejectedVsShippedSlide's identical
//   disagreement. The 16 → 18 size step IS kept: this deck's mobile frames
//   consistently set body copy larger than desktop, so that one is a real
//   mobile step rather than a mismatch.
// - The progress line's FILL is bound to `bg-primary`, which resolves to the
//   LIGHT value (#f9f9f7) on a frame whose every other variable resolves dark
//   — a bar bound to the page background can only be invisible in one theme or
//   the other. It renders here as `bg-text-primary`, which is what the frame
//   actually shows (a bright bar on the dark surface) and is correct in both
//   themes. The track keeps its `border-frame` binding, which matches the
//   token exactly (#ffffff24 dark / #D5D5D5 light).
// - The image is FastRouter's own hero illustration, on a card announcing
//   Analytics — a placeholder (the frame carries a hidden second image layer
//   next to it). No Analytics cover asset exists in the repo, so this renders
//   `AssetPlaceholder` in the card's exact geometry rather than putting this
//   case study's art on the next one's teaser. Drop
//   `public/images/analytics/an-read-next-cover.webp` in and it's a one-line
//   swap. The frame's 20%-black scrim over the image goes in with the image,
//   not over the placeholder — it exists to hold contrast on a photo.
// - The mobile frame's section pill mock reads "05 · Closing"; the real rail
//   numbers 01–07 and leaves the three bookends (Reflections, Outcomes,
//   Closing) unnumbered. SegmentedRail's CHAPTERS table is the source of
//   truth, not the mock.
//
// Copy is not new: the headline and paragraph are the same strings the
// vertical route's own ReadNext teaser card already uses for Analytics.
const NEXT_HREF = "/analytics";
const NEXT_TITLE = "Analytics";
const NEXT_BLURB =
  "50+ metrics, no taxonomy, and a formula builder that broke every time a dependency was missing.";

// How long the line takes to fill before it navigates. Long enough to be
// read as an offer and outrun by a scroll, short enough to actually complete
// for someone who stops — the behaviour zainabkabira.com's pager uses to hand
// the reader to the next project.
const ADVANCE_SECONDS = 6;

// Phosphor ArrowRight, lifted from the mobile frame's own export (node
// 7475:24174) with its baked #888888 swapped for currentColor, same
// convention as SegmentedRail's map/close icons and ShareButton's mark.
function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 23"
      fill="currentColor"
      className="size-24px shrink-0"
      aria-hidden="true"
    >
      <path d="M20.7806 12.031L14.0306 18.781C13.8899 18.9218 13.699 19.0008 13.5 19.0008C13.301 19.0008 13.1101 18.9218 12.9694 18.781C12.8286 18.6403 12.7496 18.4494 12.7496 18.2504C12.7496 18.0514 12.8286 17.8605 12.9694 17.7198L18.4397 12.2504H3.75C3.55109 12.2504 3.36032 12.1714 3.21967 12.0307C3.07902 11.8901 3 11.6993 3 11.5004C3 11.3015 3.07902 11.1107 3.21967 10.9701C3.36032 10.8294 3.55109 10.7504 3.75 10.7504H18.4397L12.9694 5.28104C12.8286 5.14031 12.7496 4.94944 12.7496 4.75042C12.7496 4.55139 12.8286 4.36052 12.9694 4.21979C13.1101 4.07906 13.301 4 13.5 4C13.699 4 13.8899 4.07906 14.0306 4.21979L20.7806 10.9698C20.8504 11.0394 20.9057 11.1222 20.9434 11.2132C20.9812 11.3043 21.0006 11.4019 21.0006 11.5004C21.0006 11.599 20.9812 11.6966 20.9434 11.7876C20.9057 11.8787 20.8504 11.9614 20.7806 12.031Z" />
    </svg>
  );
}

interface ReadNextSlideProps {
  /**
   * True only while this is the current slide of the POINTER deck. The
   * auto-advance is deliberately not driven by "is it on screen": the touch
   * stack scrolls freely, so a reader pausing here on a phone would be
   * navigated away mid-scroll. It's also why the frame hides the line on
   * mobile at all.
   */
  active?: boolean;
}

export default function ReadNextSlide({ active = false }: ReadNextSlideProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const progress = useMotionValue(0);
  // The line is `hidden md:block` per the frame, so the timer has to be gated
  // on the same breakpoint — otherwise a narrow desktop window (pointer deck,
  // no visible line) would navigate with nothing on screen explaining why.
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    // Reduced motion opts out of the auto-advance entirely rather than
    // shortening it: it isn't decoration over something that happens anyway,
    // it IS the navigation, and a reader who asked for less motion should not
    // be moved between pages by a timer. The card stays a plain link.
    if (!active || !wide || reduceMotion) {
      progress.set(0);
      return;
    }
    // Motion, not GSAP: this is tied to React state (which slide is current),
    // never to scroll position — CLAUDE.md's split. It also means the tween
    // runs on Motion's rAF loop, so a backgrounded tab freezes it and nobody
    // returns to a page that navigated itself while they were away.
    const controls = animate(progress, 1, {
      duration: ADVANCE_SECONDS,
      ease: "linear",
      onComplete: () => {
        armCaseStudyEnter(NEXT_HREF);
        router.push(NEXT_HREF);
      },
    });
    return () => {
      controls.stop();
      progress.set(0);
    };
  }, [active, wide, reduceMotion, progress, router]);

  return (
    <section
      id="read-next"
      className="relative flex h-full w-full flex-col overflow-hidden bg-bg-primary"
    >
      {/* Desktop only — the mobile frame carries no grid layer. Figma's band
          is y81–790 in the 900 frame. */}
      <GridDepthLayer className="absolute inset-x-0 top-[81px] hidden h-[709px] w-full md:block" />

      <div className="relative z-10 flex w-full flex-col px-20px pt-32px pb-40px md:h-full md:justify-center md:px-80px md:py-40px">
        {/* One link for the whole card/row rather than a button under the
            copy: the frame gives no CTA at all on desktop and only an arrow
            on mobile, so the block itself is the affordance — and the
            auto-advance needs a manual equivalent for anyone who doesn't wait.

            `contents` below md is what lets one DOM order serve both
            arrangements. Mobile stacks header → image → paragraph; desktop
            groups header and paragraph into a 600px column with the image
            beside it. Since CSS can't regroup elements, the left column
            dissolves into the parent flow on mobile (the same `contents` +
            `order` technique FiveDecisions.tsx uses) and becomes a real
            column at md. */}
        <ArmEnterLink
          href={NEXT_HREF}
          className="group mx-auto flex w-full max-w-[1280px] flex-col gap-24px rounded-lg bg-bg-surface p-16px shadow-[0px_2px_8px_0px_rgba(0,0,0,0.06)] md:flex-row md:items-center md:justify-between md:gap-40px md:rounded-none md:bg-transparent md:p-0 md:shadow-none"
        >
          <div className="contents md:flex md:w-[600px] md:shrink-0 md:flex-col md:gap-16px">
            {/* Eyebrow + headline */}
            <div className="order-1 flex flex-col gap-24px md:order-none md:gap-32px">
              <div className="flex w-full items-center justify-between">
                <span className="font-mono font-medium text-[13px] text-text-accent uppercase leading-[18px] tracking-[0.78px]">
                  Read next
                </span>
                {/* Mobile-only tap affordance; the desktop frame has none —
                    there the filling line is what says "this is going
                    somewhere". */}
                <span className="text-text-muted transition-colors group-hover:text-text-primary md:hidden">
                  <ArrowRightIcon />
                </span>
              </div>
              <h2 className="max-w-[680px] font-display text-slide-title-sm text-text-primary md:text-slide-title">
                {NEXT_TITLE}
              </h2>
            </div>

            {/* Paragraph + progress line */}
            <div className="order-3 flex flex-col gap-40px pb-40px md:order-none">
              <p className="font-ui font-normal text-[18px] text-text-muted leading-[30px] tracking-[0.09px] md:text-[16px] md:leading-[28px] md:tracking-[0.08px]">
                {NEXT_BLURB}
              </p>

              {/* 400px track, 2px tall, with the fill scaling out of its left
                  edge. scaleX rather than an animated width so the tween stays
                  on the compositor for its whole six seconds; a solid bar has
                  no glyphs or borders to distort, which is the usual reason
                  this project avoids scaling. */}
              <div
                className="hidden h-[2px] w-[400px] overflow-hidden bg-border-frame md:block"
                role="presentation"
              >
                <motion.div
                  className="h-full w-full origin-left bg-text-primary"
                  style={{ scaleX: progress }}
                />
              </div>
            </div>
          </div>

          {/* Image card. Geometry is the frame's; the contents are a
              placeholder until an Analytics cover exists — see the note at the
              top of this file. */}
          <div className="order-2 h-[260px] w-full overflow-hidden rounded-[24px] md:order-none md:h-[606px] md:w-[600px] md:shrink-0">
            <AssetPlaceholder label="[Analytics cover image]" />
          </div>
        </ArmEnterLink>
      </div>
    </section>
  );
}
