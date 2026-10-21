"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useProgressLoop } from "@/components/ultraai/useProgressLoop";
import GridDepthLayer from "@/components/shared/GridDepthLayer";
import ThemeSwap from "@/components/shared/ThemeSwap";

// Shared body of the two "direction" slides in The Shell chapter —
// RejectedDirectionSlide (Figma 7975:291951 desktop / 7686:141349 mobile) and
// ShippedDirectionSlide (7982:295575). Pulled out when the second one landed:
// the two are one layout with a different accent, copy, assets and highlight
// coordinates, and nothing else.
//
// DESKTOP is an auto-advancing selector. Three points sit in a list; the
// active one shows a 2px progress bar under it (inactive bars are opacity-0
// but keep their space, as in Figma) and a highlight box on the two phone
// mockups outlines the area it is about. When the bar finishes the next point
// takes over; after the third it loops to the first. Any point is a button:
// clicking makes it active and restarts its bar. Autoplay only runs while the
// slide is the deck's active one (`active` — every slide is mounted and
// stacked, so without it the loop would tick behind other slides) and not
// under prefers-reduced-motion, where it is click-only and the bar is full.
//
// The highlight never travels: one box per point at its own fixed spot, the
// active one fading in as the previous fades out. A point can also change what
// a phone shows (`phones`); the images stack and cross-fade the same way.
//
// MOBILE is static: three stacked blocks, each title -> mockup card ->
// description with the highlight already in place, no hover or click. Each
// card crops the same screenshots the desktop uses (top of the image in a
// 400px card) and softens everything but the highlighted band with blur
// layers — the per-point layers are supplied by the slide as `mobileCard`.
//
// Tokens only: accent from text-error / text-success, frame border from
// bg-surface (text-muted in dark), shadow ink from text-primary.

export type ImageSource = string | { light: string; dark: string };

export type Tone = "error" | "success";

// Full class strings so Tailwind's scanner sees them.
const TONES: Record<
  Tone,
  { text: string; hoverText: string; box: string; icon: string }
> = {
  error: {
    text: "text-text-error",
    hoverText:
      "group-hover:text-text-error group-focus-visible:text-text-error",
    box: "border-text-error bg-text-error/[0.16]",
    icon: "",
  },
  success: {
    text: "text-text-success",
    hoverText:
      "group-hover:text-text-success group-focus-visible:text-text-success",
    box: "border-text-success bg-text-success/[0.16]",
    icon: "-scale-y-100",
  },
};

export interface DirectionPoint {
  title: string;
  desktop: string;
  mobile: string;
  /** Highlight on the desktop phones column (628x620; phones 286 wide, 56 apart). */
  box: { x: number; y: number; w: number; h: number };
  /**
   * What the left and right phone show once this point is active. `null`
   * keeps whatever that phone is already showing — so a phone can change on a
   * later point instead of the moment the loop wraps back around.
   */
  phones: [ImageSource | null, ImageSource | null];
  /** Mobile highlight, in the block's own coordinates (title is 36px tall incl. gap). */
  mobileBox: { top: number; height: number; left?: number; width?: number };
  /** The card's image + softening layers on mobile. */
  mobileCard: React.ReactNode;
}

const FRAME_SHADOW =
  "shadow-[0_0_2.5px_color-mix(in_srgb,var(--color-text-primary)_10%,transparent),0_0_0.5px_color-mix(in_srgb,var(--color-text-primary)_10%,transparent)] dark:shadow-none";
const FRAME_BORDER = "border-4 border-bg-surface dark:border-text-muted";
const CARD = `relative h-[400px] w-full overflow-hidden rounded-2xl ${FRAME_BORDER} ${FRAME_SHADOW}`;

/** Layers inside a mobile card span the padding box plus Figma's -2px bleed. */
export const LAYER = "absolute left-[-4px] w-[calc(100%+8px)]";
const BAR_SHADOW =
  "shadow-[0_-2px_4px_color-mix(in_srgb,var(--color-text-primary)_6%,transparent)] dark:shadow-none";

function Themed({
  src,
  sizes,
  className,
}: {
  src: ImageSource;
  sizes: string;
  className?: string;
}) {
  if (typeof src === "string") {
    return <Image src={src} alt="" fill sizes={sizes} className={className} />;
  }
  return (
    <ThemeSwap
      light={
        <Image src={src.light} alt="" fill sizes={sizes} className={className} />
      }
      dark={
        <Image src={src.dark} alt="" fill sizes={sizes} className={className} />
      }
    />
  );
}

/** Top of a screenshot filling a mobile card (image is taller than the card). */
export function CardImage({ src }: { src: ImageSource }) {
  return (
    <div className="absolute left-[-4px] top-[-4px] aspect-[1170/2532] w-[calc(100%+8px)]">
      <Themed src={src} sizes="350px" />
    </div>
  );
}

/**
 * The screenshot's last `height` px (its bottom nav), kept sharp. Render it
 * AFTER any blur layer so nothing sits on top of it. 57 is the nav bar alone;
 * screenshots whose nav has icons and labels above its pill need more.
 */
export function CardBottomBar({
  src,
  height = 57,
}: {
  src: ImageSource;
  height?: number;
}) {
  return (
    <div
      className={`${LAYER} bottom-[-4px] overflow-hidden rounded-t-[15px] ${BAR_SHADOW}`}
      style={{ height }}
    >
      <div className="absolute inset-x-0 bottom-0 aspect-[1170/2532] w-full">
        <Themed src={src} sizes="350px" />
      </div>
    </div>
  );
}

function ThumbIcon({ className }: { className?: string }) {
  // Thumbs-down glyph (same path as fastrouter-slides' THUMB_DOWN); the
  // success tone flips it vertically to read as thumbs-up.
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M22.4831 14.7188L21.3581 5.71875C21.2896 5.17489 21.0249 4.67475 20.6137 4.31224C20.2025 3.94974 19.6732 3.74981 19.125 3.75H3C2.60218 3.75 2.22064 3.90804 1.93934 4.18934C1.65804 4.47064 1.5 4.85218 1.5 5.25V13.5C1.5 13.8978 1.65804 14.2794 1.93934 14.5607C2.22064 14.842 2.60218 15 3 15H7.03687L10.5787 22.0856C10.6411 22.2102 10.7369 22.315 10.8555 22.3882C10.9741 22.4614 11.1107 22.5001 11.25 22.5C12.2446 22.5 13.1984 22.1049 13.9017 21.4017C14.6049 20.6984 15 19.7446 15 18.75V17.25H20.25C20.5693 17.2501 20.8849 17.1823 21.176 17.051C21.467 16.9197 21.7268 16.728 21.938 16.4885C22.1492 16.2491 22.3071 15.9675 22.4011 15.6623C22.4951 15.3572 22.523 15.0355 22.4831 14.7188ZM6.75 13.5H3V5.25H6.75V13.5Z" />
    </svg>
  );
}

function MobileBlock({
  point,
  tone,
}: {
  point: DirectionPoint;
  tone: Tone;
}) {
  const t = TONES[tone];
  const { top, height, left, width } = point.mobileBox;
  return (
    <div className="relative flex w-full flex-col gap-16px">
      <p className="font-ui font-semibold text-[14px] text-text-primary leading-[20px]">
        {point.title}
      </p>
      <div className="flex flex-col gap-8px">
        <div className={CARD}>{point.mobileCard}</div>
        <div className="flex items-start gap-12px py-16px">
          <ThumbIcon className={`size-24px shrink-0 ${t.text} ${t.icon}`} />
          <p className="font-ui font-normal text-[14px] text-text-primary leading-[20px] tracking-[0.07px]">
            {point.mobile}
          </p>
        </div>
      </div>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute border ${t.box} ${
          width === undefined
            ? "left-1/2 w-[calc(100%+16px)] -translate-x-1/2"
            : ""
        }`}
        style={{
          top,
          height,
          ...(width === undefined ? {} : { left, width }),
        }}
      />
    </div>
  );
}

interface DirectionSlideProps {
  id: string;
  tone: Tone;
  eyebrow: string;
  headline: string;
  body: string;
  points: readonly DirectionPoint[];
  /** How long each point's bar takes. Figma doesn't specify it. */
  progressSeconds?: number;
  active?: boolean;
}

function srcKey(s: ImageSource) {
  return typeof s === "string" ? s : s.light;
}

export default function DirectionSlide({
  id,
  tone,
  eyebrow,
  headline,
  body,
  points,
  progressSeconds = 6,
  active = true,
}: DirectionSlideProps) {
  const t = TONES[tone];
  const { index, progress, select, hover } = useProgressLoop({
    count: points.length,
    seconds: progressSeconds,
    active,
  });

  // Each phone starts on the first image any point gives it, then only changes
  // when a point that names an image becomes active.
  const initialShown = [0, 1].map(
    (side) => points.find((p) => p.phones[side])?.phones[side] as ImageSource
  );
  const [shown, setShown] = useState<ImageSource[]>(initialShown);

  // Entering the slide resets what the phones show (the loop itself restarts
  // in useProgressLoop).
  useEffect(() => {
    if (!active) return;
    setShown(initialShown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    const phones = points[index].phones;
    setShown((cur) => cur.map((src, side) => phones[side] ?? src));
  }, [index, points]);

  // Every distinct image either phone ever shows, so a change cross-fades
  // between layers that are already mounted instead of swapping one <img>.
  const phoneImages = [0, 1].map((side) => {
    const seen = new Map<string, ImageSource>();
    for (const p of points) {
      const src = p.phones[side];
      if (src) seen.set(srcKey(src), src);
    }
    return [...seen.entries()];
  });

  return (
    <section
      id={id}
      className="relative flex h-full w-full flex-col overflow-y-auto overflow-x-hidden bg-bg-primary md:overflow-hidden"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:hidden" />
      <GridDepthLayer className="absolute inset-0 hidden w-full [--grid-cell:40px] md:block" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] shrink-0 flex-col gap-24px px-20px py-32px md:h-full md:flex-row md:items-center md:justify-between md:gap-[56px] md:px-80px md:pb-0 md:pt-[var(--fr-header-h,0px)]">
        <div className="flex w-full flex-col gap-24px md:w-[600px] md:shrink-0 md:gap-40px">
          <div className="flex flex-col gap-24px">
            <span
              className={`font-mono text-[13px] ${t.text} uppercase tracking-[0.78px]`}
            >
              {eyebrow}
            </span>
            <div className="flex flex-col gap-24px md:gap-16px">
              <h2 className="font-display text-slide-title-sm text-text-primary md:text-slide-title">
                {headline}
              </h2>
              <p className="font-ui font-normal text-[16px] text-text-muted leading-[28px] tracking-[0.08px]">
                {body}
              </p>
            </div>
          </div>

          {/* Desktop: selectable points with the active one's progress bar. */}
          <div
            className="hidden w-[550px] flex-col gap-24px md:flex"
            {...hover}
          >
            {points.map((point, i) => {
              const isActive = i === index;
              return (
                <button
                  key={point.title}
                  type="button"
                  aria-current={isActive}
                  onClick={() => select(i)}
                  className="group flex w-full cursor-pointer items-start gap-12px text-left"
                >
                  <span
                    className={`flex h-[20px] w-16px shrink-0 items-center ${t.text}`}
                  >
                    <ThumbIcon className={`size-16px ${t.icon}`} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-16px">
                    <span className="flex flex-col gap-8px text-[14px] leading-[20px]">
                      <span
                        className={`font-ui font-semibold transition-colors duration-200 ${isActive ? t.text : "text-text-primary"} ${t.hoverText}`}
                      >
                        {point.title}
                      </span>
                      <span className="font-ui font-normal text-text-primary tracking-[0.07px]">
                        {point.desktop}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`block h-[2px] w-full bg-border-frame md:max-w-[320px] ${isActive ? "" : "opacity-0"}`}
                    >
                      {isActive && (
                        <motion.span
                          className="block h-full w-full origin-left bg-text-primary"
                          style={{ scaleX: progress }}
                        />
                      )}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile: three static, pre-highlighted blocks. */}
          <div className="flex w-full flex-col gap-32px md:hidden">
            {points.map((point) => (
              <MobileBlock key={point.title} point={point} tone={tone} />
            ))}
          </div>
        </div>

        {/* Desktop: the two phones and the fading highlights. */}
        <div
          className="relative hidden h-[620px] w-[628px] shrink-0 gap-[56px] md:flex"
          {...hover}
        >
          {phoneImages.map((images, side) => (
            <div
              key={side}
              className={`relative h-[620px] w-[286px] shrink-0 overflow-hidden rounded-2xl ${FRAME_BORDER} ${FRAME_SHADOW}`}
            >
              {images.map(([key, src]) => (
                <div
                  key={key}
                  className={`absolute inset-0 transition-opacity duration-[350ms] ease-out motion-reduce:transition-none ${
                    srcKey(shown[side]) === key
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                >
                  <Themed src={src} sizes="286px" className="object-cover" />
                </div>
              ))}
            </div>
          ))}
          {points.map((point, i) => (
            <div
              key={point.title}
              aria-hidden="true"
              className={`pointer-events-none absolute left-0 top-0 border ${t.box} transition-opacity duration-[350ms] ease-out motion-reduce:transition-none ${i === index ? "opacity-100" : "opacity-0"}`}
              style={{
                width: point.box.w,
                height: point.box.h,
                transform: `translate(${point.box.x}px, ${point.box.y}px)`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
