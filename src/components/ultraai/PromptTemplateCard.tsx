"use client";

import { useState } from "react";
import Image from "next/image";

// The "A fixed prompt template" visual for the Illustration System slide —
// Figma desktop 8089:117115 (3D Objects state) and 8089:117951 (Illustrations
// state). One 500x700 card with a tappable switch: "3D Objects" shows a 3x2
// grid of the six clay icons over the prompt that makes them, "Illustrations"
// swaps the card to the full-bleed illustration with its own prompt. Both
// light and dark use the same images (per direct instruction); only the card's
// surface and text follow the theme.
//
// States cross-fade (card layers, prompt text) rather than swap — both are
// mounted. The prompt panel is a dark code block in BOTH themes, as in Figma
// (rgba(26,26,26,0.8) over the card): written as a `dark`-scoped subtree so it
// resolves the dark tokens (bg-primary #1A1A1A, light text) without a hex, with
// the active switch pill and the highlighted placeholders in a `light` scope
// for the white pill / dark ink. The Illustrations state puts the whole card
// in `dark` scope so its title and overlay read over the image.
//
// DESKTOP is Figma's absolute layout: card 500x700, radius 24, title at
// (32,32) Season Mix 32/44 +0.5, grid at (24,112) of 140px cells 16 apart
// (24 radius, border-default, soft drop shadow, each icon at a third of its
// 3x export), panel 468x260 at the bottom (16 in, radius 16, px24 py20) with
// the 44px switch (130px options) and the prompt in Geist Mono 13/20 +0.78
// uppercase. MOBILE flows instead of positions: the card is full width and
// as tall as its content, a 3-column grid of square cells, the panel below
// with the switch stretched and the prompt at 11/17 — the fixed 260px panel
// cannot hold the prompt at 350px wide. Illustrations state: the same flow
// over the image.
//
// Figma notes, flagged: the yellow marker is #F1C335 with no token — added as
// `--color-highlight` (PROPOSED) in globals.css; the card is named "..._dark"
// in both frames though drawn on a light surface, so it is token-driven here;
// the highlights are drawn as separate rectangles behind the text in Figma
// and are inline <mark>s here so they follow the wrapping at any width.
//
// Assets: ua-prompt-3d-{1..6}.webp (the supplied PNGs, alpha kept, native 3x)
// and ua-prompt-illustration.webp (1000x1400, q84).
type Mode = "objects" | "illustrations";

const OBJECTS = [
  { n: 1, w: 330, h: 258 },
  { n: 2, w: 330, h: 330 },
  { n: 3, w: 264, h: 312 },
  { n: 4, w: 321, h: 300 },
  { n: 5, w: 294, h: 270 },
  { n: 6, w: 318, h: 300 },
] as const;

function Mark({ children }: { children: React.ReactNode }) {
  return (
    <mark className="light bg-highlight text-text-primary">{children}</mark>
  );
}

const PROMPTS: Record<Mode, React.ReactNode> = {
  objects: (
    <>
      Minimal 3D clay icon of <Mark>[SUBJECT],</Mark> built from soft organic
      forms with a smooth matte finish and no texture. Centered composition,
      gentle depth, soft studio lighting. Material in a single gradient of{" "}
      <Mark>[EXPERT ACCENT COLOR],</Mark> on a dark charcoal background. A
      premium AI app icon, simplified to read at 64px.
    </>
  ),
  illustrations: (
    <>
      Premium 3D clay illustration of <Mark>[SCENE]</Mark> for{" "}
      <Mark>[EXPERT NAME].</Mark> One focal object in an{" "}
      <Mark>[EXPERT ACCENT COLOR],</Mark> supported by 5 to 7 softer floating
      objects in complementary tones. Warm key light from the upper left, cool
      violet rim light from the lower right. Dark charcoal background, crisp
      silhouettes ready for background removal, no text, generous spacing.
    </>
  ),
};

export default function PromptTemplateCard() {
  const [mode, setMode] = useState<Mode>("objects");
  const ill = mode === "illustrations";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[24px] bg-bg-surface md:h-[700px] md:w-[500px] ${ill ? "dark" : ""}`}
    >
      {/* Illustration + its 20% scrim, fading in over the surface. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 transition-opacity duration-[400ms] ease-out motion-reduce:transition-none ${ill ? "opacity-100" : "opacity-0"}`}
      >
        <Image
          src="/images/ultraai/ua-prompt-illustration.webp"
          alt=""
          fill
          sizes="(min-width: 768px) 500px, 350px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-bg-primary/20" />
      </div>

      <div className="relative flex flex-col gap-16px p-20px md:block md:h-full md:p-0">
        <p className="font-display text-[32px] text-text-primary capitalize leading-[44px] tracking-[0.5px] md:absolute md:left-[32px] md:top-[32px]">
          /Prompt
        </p>

        {/* 3D Objects grid. Fades out in Illustrations, and stops taking up
            room on mobile so the illustration state's card is shorter. */}
        <div
          className={`grid grid-cols-3 gap-12px transition-opacity duration-[400ms] ease-out motion-reduce:transition-none md:absolute md:left-[24px] md:top-[112px] md:gap-16px ${ill ? "pointer-events-none absolute opacity-0" : "opacity-100"}`}
          aria-hidden={ill}
        >
          {OBJECTS.map((o) => (
            <div
              key={o.n}
              className="flex aspect-square items-center justify-center rounded-[24px] border border-border-default bg-bg-surface p-12px shadow-[0_8px_12px_color-mix(in_srgb,var(--color-text-muted)_20%,transparent)] dark:shadow-[0_8px_16px_var(--color-bg-primary)] md:size-[140px] md:p-16px"
            >
              <Image
                src={`/images/ultraai/ua-prompt-3d-${o.n}.webp`}
                alt=""
                width={o.w}
                height={o.h}
                sizes="110px"
                className="h-auto max-h-full w-auto max-w-full"
              />
            </div>
          ))}
        </div>

        {/* The prompt panel: always a dark block. */}
        <div className="dark rounded-[16px] bg-bg-primary/80 px-16px py-16px md:absolute md:bottom-[16px] md:left-1/2 md:flex md:h-[260px] md:w-[468px] md:-translate-x-1/2 md:flex-col md:gap-16px md:overflow-hidden md:px-24px md:py-20px">
          <div
            role="group"
            aria-label="Prompt type"
            className="flex h-[44px] w-full items-center rounded-full bg-text-muted p-4px md:w-fit"
          >
            {(
              [
                ["objects", "3D Objects"],
                ["illustrations", "Illustrations"],
              ] as const
            ).map(([key, label]) => {
              const on = mode === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setMode(key)}
                  className={`flex h-[36px] min-w-0 flex-1 cursor-pointer items-center justify-center whitespace-nowrap rounded-[18px] px-12px font-ui text-[14px] leading-[20px] tracking-[0.07px] transition-colors md:w-[130px] md:flex-none ${
                    on
                      ? "light bg-bg-surface font-medium text-text-primary shadow-[0_1px_4px_color-mix(in_srgb,var(--color-text-primary)_8%,transparent)]"
                      : "font-normal text-text-primary"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Both prompts share one grid cell so the panel is as tall as the
              longer of the two and the swap is a cross-fade. */}
          <div className="mt-16px grid font-mono font-medium text-[11px] text-text-primary uppercase leading-[17px] tracking-[0.5px] md:mt-0 md:text-[13px] md:leading-[20px] md:tracking-[0.78px]">
            {(["objects", "illustrations"] as const).map((key) => (
              <p
                key={key}
                aria-hidden={mode !== key}
                className={`col-start-1 row-start-1 transition-opacity duration-[300ms] ease-out motion-reduce:transition-none ${mode === key ? "opacity-100" : "pointer-events-none opacity-0"}`}
              >
                {PROMPTS[key]}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
