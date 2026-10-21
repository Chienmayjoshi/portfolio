"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

// Right-hand asset for the Illustration System slide's third point, "An icon
// for every expert" — Figma node 8097:27188, frame 8097:28018
// ("ua_iconforeveryexpert_light"), file 2aoIFdaJMyNBEWeQESBEzG.
//
// Five rounded icon blocks scattered on a 600x600 field over Figma's swirl. Every position and size is read off Figma in px against that 600
// field and expressed as a percentage of it, so the same layout scales down to
// the phone's full-width square with no second set of numbers. Each block is
// tilted a little, and each one floats very slowly: a long ease-in-out loop on
// y and rotation, every block on its own period and delay so they never move
// in step. Reduced motion holds them still.
//
// The icon art is the same in light and dark (the colours are the expert
// identities); only the block surface, the swirl and the shadow follow the
// theme, through tokens. The dark shadow is the dark background token, as in
// the prompt card's icon cells. Figma's own "dark" frame was not provided,
// so the dark treatment here is derived, not read.
//
// The Figma "blur top/bottom" frames are hidden, so no edge fade is applied.
const FIELD = 600;

interface Block {
  name: string;
  src: string;
  /** Block box in Figma px on the 600 field. */
  x: number;
  y: number;
  size: number;
  /** Icon size as a share of the block, from the Figma inset. */
  icon: number;
  tilt: number;
  /** Float: travel in px at 600 wide, seconds per loop, start delay. */
  drift: number;
  period: number;
  delay: number;
}

const BLOCKS: readonly Block[] = [
  { name: "Flex dumbbell", src: "dumbbell", x: 63, y: 89.7, size: 171.5, icon: 0.686, tilt: -14, drift: 10, period: 9, delay: 0 },
  { name: "Veda crescent moon", src: "crescent", x: 385.5, y: 75.5, size: 158.1, icon: 0.571, tilt: 10, drift: 12, period: 11, delay: 1.5 },
  { name: "Luca chef’s hat", src: "chefhat", x: 202.9, y: 239, size: 158.2, icon: 0.571, tilt: 12, drift: 9, period: 10, delay: 3 },
  { name: "Heart", src: "heart", x: 361.9, y: 404.7, size: 166.2, icon: 0.571, tilt: -8, drift: 11, period: 12, delay: 0.8 },
  { name: "Lotus", src: "lotus", x: 79.5, y: 396.6, size: 159.8, icon: 0.686, tilt: 9, drift: 10, period: 10.5, delay: 2.2 },
];

const pct = (v: number) => `${(v / FIELD) * 100}%`;

export default function ExpertIconBlocks() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="img"
      aria-label="Five expert icons — a dumbbell, a crescent moon, a chef’s hat, a heart and a lotus — each on its own rounded block"
      className="relative aspect-square w-full md:w-[600px]"
    >
      {/* Swirl: Figma's own vector (8097:28019), used as a mask so its
          strokes take the border-frame token in either theme instead of the
          export's baked-in grey. Box = the node's 491x300 at (55, 150.5),
          grown by the export's 0.33% / 0.2% stroke overhang. */}
      <div
        aria-hidden="true"
        className="absolute bg-border-frame opacity-50 dark:opacity-100"
        style={{
          left: pct(55 - 491 * 0.002),
          top: pct(150.5 - 300 * 0.0033),
          width: pct(491 * 1.004),
          height: pct(300 * 1.0066),
          maskImage: "url(/images/ultraai/ua-expert-swirl.svg)",
          WebkitMaskImage: "url(/images/ultraai/ua-expert-swirl.svg)",
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      />

      {BLOCKS.map((b) => (
        <div
          key={b.src}
          className="absolute"
          style={{
            left: pct(b.x),
            top: pct(b.y),
            width: pct(b.size),
            height: pct(b.size),
          }}
        >
          <motion.div
            className="relative size-full rounded-[22%] bg-bg-surface shadow-[0_8px_24px_color-mix(in_srgb,var(--color-text-primary)_10%,transparent)] dark:border dark:border-border-default dark:shadow-[0_8px_20px_var(--color-bg-primary)]"
            style={{ rotate: b.tilt }}
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [0, -b.drift, 0, b.drift * 0.6, 0],
                    rotate: [b.tilt, b.tilt + 2.5, b.tilt, b.tilt - 2, b.tilt],
                  }
            }
            transition={{
              duration: b.period,
              delay: b.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            initial={false}
          >
            <Image
              src={`/images/ultraai/ua-expert-icon-${b.src}.webp`}
              alt=""
              width={288}
              height={288}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
              style={{ width: `${b.icon * 100}%`, height: `${b.icon * 100}%` }}
            />
          </motion.div>
        </div>
      ))}
    </div>
  );
}
