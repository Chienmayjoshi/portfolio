"use client";

import Image from "next/image";
import { motion } from "motion/react";
import GridDepthLayer from "@/components/shared/GridDepthLayer";

// Fourth slide of the fastrouter-slides deck — "Feature Overview" (chapter 04),
// Figma desktop node 7097:62020 / mobile 7139:4, file 2aoIFdaJMyNBEWeQESBEzG.
// Introduces the three features the case study then walks through, as a list of
// "decision" rows (a ghost number, an accent eyebrow, and the question that
// feature answers).
//
// The feature illustration is shared across all three decisions FOR NOW — a
// placeholder (`fr-features-decision.webp`, the composited illustration exported
// from Figma node 7126:74331, 188×200, transparent) that will be replaced with a
// real per-decision image later. That's why each DECISION carries its own
// `image` field even though they all point at the same file today: swapping one
// in later is a one-line change per decision.
//
// Interaction differs by input, per direct instruction:
//   - Desktop (hover): the feature image slides up into view on the right of
//     the hovered row and slides back down on hover-out. Motion (not GSAP) since
//     it's a gesture/state animation (this project's animation split). The image
//     lives in an overflow-clipped window and a tween translates it from below
//     (hidden) to 0 (shown). The row's bottom border and the ghost number also
//     react to hover (see below).
//   - Mobile (no hover): each decision shows its image by default, a 56×56
//     thumbnail on the left of the row (Figma node 7139:4).
const DECISIONS = [
  {
    number: "01",
    label: "OBSERVABILITY",
    question: "Where is the money going?",
    image: "/images/fastrouter/fr-features-decision.webp",
  },
  {
    number: "02",
    label: "EVALUATIONS",
    question: "Which model actually performs best?",
    image: "/images/fastrouter/fr-features-decision.webp",
  },
  {
    number: "03",
    label: "MODEL COUNCIL",
    question: "Who gets the final verdict?",
    image: "/images/fastrouter/fr-features-decision.webp",
  },
] as const;

// Image slides in from below the clip window (110%, hidden) to 0 (shown) and
// back out on hover-end. A plain tween with an ease-out — no spring overshoot
// ("slide in / slide out," per direct instruction). rest ↔ hover variant is
// propagated from the parent row's whileHover through Motion context.
const IMAGE_VARIANTS = {
  rest: { y: "110%" },
  hover: { y: "0%" },
} as const;
const IMAGE_SLIDE = { duration: 0.4, ease: [0.22, 1, 0.36, 1] } as const;

function Decision({
  number,
  label,
  question,
  image,
}: (typeof DECISIONS)[number]) {
  return (
    <motion.div
      initial="rest"
      animate="rest"
      whileHover="hover"
      // Bottom border: always on mobile (its cards are dividers by design), but
      // on desktop only ON HOVER (transparent by default so there's no layout
      // shift, coloured in on hover) — per direct instruction. `group` so the
      // ghost number can react to the row's hover too.
      className="group relative flex w-full items-start gap-12px border-b border-border-default py-24px transition-colors md:items-center md:gap-32px md:border-transparent md:py-32px md:hover:border-border-default"
    >
      {/* Mobile thumbnail — default-visible on the left (no hover on touch). */}
      <div className="relative size-56px shrink-0 overflow-hidden md:hidden">
        <Image src={image} alt="" fill className="object-contain" sizes="56px" />
      </div>

      {/* Desktop ghost number — big, cropped to a 36px band for the "peeking
          numeral" look (Figma frame is h-36 overflow-clip on a 48/56 glyph). */}
      <div className="hidden h-[36px] w-60px shrink-0 items-center overflow-hidden md:flex">
        {/* Ghost grey by default; darkens to the primary text colour on row
            hover (group-hover beats dark: on specificity, so it works in both
            themes). transition-colors smooths it. */}
        <span className="font-display text-[48px] text-[#d9d9d9] leading-[56px] tracking-[-0.48px] transition-colors group-hover:text-text-primary dark:text-[#333333]">
          {number}
        </span>
      </div>

      {/* Eyebrow + question. Mobile prepends "0N · " to the eyebrow (there's no
          ghost number column on mobile); desktop shows just the label. */}
      <div className="flex min-w-0 flex-1 flex-col gap-12px md:gap-4px">
        <span className="font-mono font-semibold text-[12px] text-text-accent uppercase tracking-[0.24px] md:font-medium md:text-[14px] md:tracking-[0.07px]">
          <span className="md:hidden">{number} · </span>
          {label}
        </span>
        <span className="font-ui font-semibold text-[17px] text-text-primary leading-[28px] tracking-[0.085px] md:text-[28px] md:leading-[40px] md:tracking-[-0.1px]">
          {question}
        </span>
      </div>

      {/* Desktop hover image — bounces up on the row's right. The outer window is
          clipped so the spring slides the illustration in from below and back
          down; pointer-events-none so it never intercepts the row hover.
          right/top match Figma (x600 of the 800-wide row → 12px from the right;
          raised 73px above the row). */}
      <div className="pointer-events-none absolute top-[-73px] right-[12px] hidden h-[200px] w-[188px] overflow-hidden md:block">
        <motion.div
          variants={IMAGE_VARIANTS}
          transition={IMAGE_SLIDE}
          className="relative h-full w-full will-change-transform"
        >
          <Image
            src={image}
            alt=""
            fill
            className="object-contain"
            sizes="188px"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function FeaturesSlide() {
  return (
    <section
      id="features"
      className="relative flex h-full w-full flex-col overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:top-0 md:h-[800px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-start gap-40px px-20px pt-56px md:h-full md:items-center md:justify-center md:gap-0 md:px-0 md:pt-0 md:pb-[var(--fr-header-h,0px)]">
        {/* Headline — left on mobile (32/40), centered on desktop (56/64),
            matching the other slides' convention. */}
        <h1 className="w-full font-display text-[32px] text-text-primary leading-[40px] tracking-[-0.32px] md:max-w-[680px] md:py-40px md:text-center md:text-[56px] md:leading-[64px] md:tracking-[-0.56px]">
          The question eventually every AI team would ask
        </h1>

        {/* Decision list — centered 800px column on desktop (Figma reveal-rows),
            full-width on mobile. md:mt-32 matches the Figma gap between the
            headline block and the rows. */}
        <div className="w-full md:mt-32px md:max-w-[800px]">
          {DECISIONS.map((decision) => (
            <Decision key={decision.number} {...decision} />
          ))}
        </div>
      </div>
    </section>
  );
}
