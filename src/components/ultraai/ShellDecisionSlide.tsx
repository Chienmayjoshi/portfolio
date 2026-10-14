"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import GridDepthLayer from "@/components/shared/GridDepthLayer";
import ThemeAwareVideo from "@/components/shared/ThemeAwareVideo";
import ThemeSwap from "@/components/shared/ThemeSwap";

// Decision slides for The Shell chapter. Decision 01 — "Home stays in the
// bottom nav" — is Figma desktop node 7753:176288 (light) / 7753:175497 (dark
// render of the same frame) and mobile 7753:177079, file
// 2aoIFdaJMyNBEWeQESBEzG. The dark frame is the same layout on dark tokens,
// so there is one component and the theme does the rest.
//
// Same slots as fastrouter-slides' DecisionSlide (ghost number, accent
// "DECISION · {chapter}" eyebrow, headline, Chose / Gave up / Why) but a
// different shape, so it isn't that component: no capsule frame — the asset is
// a bare 600x655 showcase video (the frame's "UAI_navbar_showcase" slot, a
// 1100x1200 recording, same 0.917 aspect) sitting beside a 600px text column,
// and the headline is a hard two-line break on desktop. Desktop: the two
// columns 80 apart, vertically centred on the viewport. Mobile: the video
// moves BETWEEN the header block and the rationale, all 24 apart.
//
// Headline is the deck-wide slide-title token (48px / 32px mobile), not
// Figma's literal 56/64 desktop — the divergence CLAUDE.md already records.
// The "Why?" label keeps its question mark: it is in both of this slide's
// frames. (FastRouter's equivalent was normalised to "Why" because three
// other frames dropped it; there is no such majority here yet — say if it
// should lose it.)
//
// The videos are ~10.6MB each (H.264, ~8Mbps, 10.6s loop). That is not a
// Figma matter, but worth re-encoding before this ships. Until then the file
// isn't requested until the slide is, or is about to be, on screen — the
// pointer deck mounts every slide at once, so an eager <video> here would pull
// 10MB on first paint.
//
// Assets: ua_shelldecision01_light.mp4 / _dark.mp4 (as supplied).

interface ShellDecisionLayoutProps {
  id: string;
  number: string;
  /** Eyebrow after "Decision ·". */
  chapter?: string;
  /** One line, or two with a hard break on desktop. */
  headline: string | [string, string];
  chose: React.ReactNode;
  gaveUp: string;
  why: string;
  /** The right-hand (mobile: middle) visual, sized by its own classes. */
  visual: React.ReactNode;
}

// The frame every Shell decision shares: ghost number, accent eyebrow,
// headline, Chose / Gave up / Why? — and a slot for the decision's visual,
// which differs per decision (a video for 01, two mockups and a switch for
// 02). On mobile the visual sits BETWEEN the header and the rationale.
function ShellDecisionLayout({
  id,
  number,
  chapter = "The shell",
  headline,
  chose,
  gaveUp,
  why,
  visual,
}: ShellDecisionLayoutProps) {
  const blocks = [
    { label: "Chose", text: chose },
    { label: "Gave up", text: gaveUp },
    { label: "Why?", text: why },
  ];

  return (
    <section
      id={id}
      className="relative flex h-full w-full flex-col overflow-y-auto overflow-x-hidden bg-bg-primary md:overflow-hidden"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:hidden" />
      <GridDepthLayer className="absolute inset-0 hidden w-full [--grid-cell:40px] md:block" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] shrink-0 flex-col gap-24px px-20px py-32px md:h-full md:flex-row md:items-center md:justify-between md:gap-0 md:px-80px md:py-0">
        {/* Header block. On desktop it sits in the same column as the
            rationale, so the two are wrapped; on mobile the visual comes
            between them (flex order). */}
        <div className="contents md:flex md:w-[600px] md:shrink-0 md:flex-col md:gap-[56px]">
          <div className="flex flex-col gap-24px">
            <div className="flex flex-col gap-4px">
              {/* Ghost number: a band shorter than the glyph's line box, so
                  only its top shows — same peeking numeral as the Council
                  intro and decisions. */}
              <div className="flex h-40px items-start justify-center overflow-hidden px-4px self-start">
                <span className="font-display text-[48px] text-border-frame leading-[56px] tracking-[-0.48px]">
                  {number}
                </span>
              </div>
              <p className="font-mono text-[13px] text-text-accent uppercase leading-[18px] tracking-[0.78px]">
                Decision · {chapter}
              </p>
            </div>
            <h2 className="font-display text-slide-title-sm text-text-primary md:text-slide-title">
              {typeof headline === "string" ? (
                headline
              ) : (
                <>
                  {headline[0]} <br className="hidden md:block" />
                  {headline[1]}
                </>
              )}
            </h2>
          </div>

          <div className="order-2 flex flex-col gap-24px md:order-none md:gap-32px">
            {blocks.map((b) => (
              <div key={b.label} className="flex flex-col gap-8px">
                <p className="font-mono text-[13px] text-text-muted uppercase leading-[18px] tracking-[0.78px]">
                  {b.label}
                </p>
                <div className="font-ui font-normal text-[16px] text-text-primary leading-[28px] tracking-[0.08px]">
                  {b.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 md:order-none">{visual}</div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- decision 01

function VideoVisual({
  video,
  label,
  active,
  frameClass = "aspect-[600/655] md:w-[600px]",
  fit = "cover",
}: {
  video: { light: string; dark: string };
  label: string;
  active?: boolean;
  /** Aspect and desktop width of the slot; full width on mobile. */
  frameClass?: string;
  /** How the clip sits in its slot. */
  fit?: "cover" | "contain";
}) {
  const [seen, setSeen] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  // Pointer deck: load once the slide is first active. Touch stack (no
  // `active`): load when the video block nears the viewport.
  useEffect(() => {
    if (active === true) setSeen(true);
  }, [active]);

  useEffect(() => {
    if (active !== undefined || seen) return;
    const el = frameRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [active, seen]);

  return (
    <div
      ref={frameRef}
      className={`w-full shrink-0 ${frameClass}`}
    >
      {seen && (
        <ThemeAwareVideo
          lightSrc={video.light}
          darkSrc={video.dark}
          className={`size-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
          aria-label={label}
        />
      )}
    </div>
  );
}

export function ShellDecision01Slide({ active }: { active?: boolean }) {
  return (
    <ShellDecisionLayout
      id="shell-decision-01"
      number="01"
      headline={["Home stays in", "the bottom nav"]}
      chose={`The first bottom nav tab changed from "Experts" to "Home." It always takes you back to where you started, the For You hub or an expert's own dashboard.`}
      gaveUp={`"Experts" just meant you were somewhere in that section. It looked the same whether you were on the main hub or deep inside an expert.`}
      why="People need one fast way back to their starting point, from anywhere in the app."
      visual={
        <VideoVisual
          video={{
            light: "/images/ultraai/ua_shelldecision01_light.mp4",
            dark: "/images/ultraai/ua_shelldecision01_dark.mp4",
          }}
          label="UltraAI home screen with Home as the first bottom nav tab, opening the For You hub from inside an expert"
          active={active}
        />
      }
    />
  );
}

// ---------------------------------------------------------------- decision 02
//
// Figma desktop 7784:180497, mobile 7784:180057. Two mockups side by side:
// the unified app's For You (left, fixed) and an expert's screen (right), the
// right one with a switch under it — Unified App / Standalone App — that swaps
// the mockup between the expert screen WITH its top bar and the standalone
// screen without. Both mockups carry the same accent (text-accent) box on
// their bottom nav, which is what the decision is about.
//
// The switch is live on both breakpoints. Figma draws the mobile one as a
// static "Unified" state; it is the same control, so it works there too rather
// than shipping an inert switch.
//
// Copy differs between frames in places, each used at its own breakpoint:
// the switch labels ("Unified App" / "Standalone App" desktop, "Unified" /
// "Standalone" mobile) and the right caption ("Inside an expert" desktop,
// "Expert Context" mobile). Rationale text and headline match.
//
// Assets are the shipped-direction screenshots reused as-is, light and dark
// pairs: home (left), expert and standalone (right) — per direct instruction,
// not new exports. Figma's own frames use the dark pair in both themes.
//
// Sizes: desktop mockups 254x550, border 4, radius 16, 56 apart, box 280x72;
// mobile mockups 139x300, border 2, radius 12, box 150x46. The box hangs 13px
// (desktop) over each side; bottom is 90px up from the column's bottom, where
// the column is the mockup plus its 68px caption block.

const D2_HOME = {
  light: "/images/ultraai/ua-shell-shipped-home.webp",
  dark: "/images/ultraai/ua-shell-shipped-home-dark.webp",
};
const D2_EXPERT = {
  light: "/images/ultraai/ua-shell-shipped-expert.webp",
  dark: "/images/ultraai/ua-shell-shipped-expert-dark.webp",
};
const D2_STANDALONE = {
  light: "/images/ultraai/ua-shell-shipped-standalone.webp",
  dark: "/images/ultraai/ua-shell-shipped-standalone-dark.webp",
};

const MOCK_FRAME =
  "relative h-[300px] w-[139px] shrink-0 overflow-hidden rounded-[12px] border-4 md:h-[550px] md:w-[254px] md:rounded-2xl border-bg-surface dark:border-text-muted shadow-[0_0_2.5px_color-mix(in_srgb,var(--color-text-primary)_10%,transparent),0_0_0.5px_color-mix(in_srgb,var(--color-text-primary)_10%,transparent)] dark:shadow-none";

function ThemedFill({
  src,
  sizes,
}: {
  src: { light: string; dark: string };
  sizes: string;
}) {
  return (
    <ThemeSwap
      light={
        <Image
          src={src.light}
          alt=""
          fill
          sizes={sizes}
          className="object-cover"
        />
      }
      dark={
        <Image
          src={src.dark}
          alt=""
          fill
          sizes={sizes}
          className="object-cover"
        />
      }
    />
  );
}

function NavBox() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-[90px] left-1/2 h-[46px] w-[150px] -translate-x-1/2 border border-text-accent bg-text-accent/[0.16] md:h-[72px] md:w-[280px]"
    />
  );
}

function NavAdaptsVisual() {
  const [standalone, setStandalone] = useState(false);
  const modes = [
    { key: "unified", long: "Unified App", short: "Unified" },
    { key: "standalone", long: "Standalone App", short: "Standalone" },
  ] as const;

  return (
    <div className="flex w-full items-start justify-between px-16px md:w-[578px] md:justify-between md:gap-[56px] md:px-0">
      {/* Left: the unified app's For You, fixed. */}
      <div className="relative flex w-[139px] flex-col items-center gap-24px md:w-[254px]">
        <div className={MOCK_FRAME}>
          <ThemedFill src={D2_HOME} sizes="254px" />
        </div>
        <div className="flex w-full flex-col items-center gap-4px md:gap-12px">
          <p className="flex h-[44px] w-full items-center justify-center font-ui font-medium text-[12px] text-text-accent leading-[20px] tracking-[0.06px] md:text-[14px] md:tracking-[0.07px]">
            For You Dashboard
          </p>
          <p className="flex items-center justify-center gap-4px whitespace-nowrap font-ui font-normal text-[12px] text-text-muted leading-[20px] tracking-[0.06px] md:gap-8px md:text-[14px] md:tracking-[0.07px]">
            <span>Unified app</span>
            <span className="font-mono text-[13px] uppercase leading-[18px] tracking-[0.78px]">
              ·
            </span>
            <span>All experts</span>
          </p>
        </div>
        <NavBox />
      </div>

      {/* Right: an expert's screen, switchable. */}
      <div className="relative flex w-[139px] flex-col items-center gap-24px md:w-[268px]">
        <div className={MOCK_FRAME}>
          {[
            { src: D2_EXPERT, on: !standalone },
            { src: D2_STANDALONE, on: standalone },
          ].map(({ src, on }) => (
            <div
              key={src.light}
              className={`absolute inset-0 transition-opacity duration-[350ms] ease-out motion-reduce:transition-none ${on ? "opacity-100" : "opacity-0"}`}
            >
              <ThemedFill src={src} sizes="254px" />
            </div>
          ))}
        </div>
        <div className="flex w-full flex-col items-center gap-4px md:gap-12px">
          <div
            role="group"
            aria-label="App type"
            className="flex h-[44px] w-full items-center rounded-full bg-border-frame p-4px md:w-auto"
          >
            {modes.map((m, i) => {
              const on = (i === 1) === standalone;
              return (
                <button
                  key={m.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setStandalone(i === 1)}
                  className={`flex h-[36px] min-w-0 flex-1 cursor-pointer items-center justify-center whitespace-nowrap rounded-[18px] px-8px font-ui text-[12px] leading-[18px] tracking-[0.06px] transition-colors md:w-[130px] md:flex-none md:px-12px md:text-[14px] md:leading-[20px] md:tracking-[0.07px] ${
                    on
                      ? "bg-bg-surface font-medium text-text-accent shadow-[0_1px_4px_color-mix(in_srgb,var(--color-text-primary)_8%,transparent)]"
                      : "font-normal text-text-muted"
                  }`}
                >
                  <span className="md:hidden">{m.short}</span>
                  <span className="hidden md:inline">{m.long}</span>
                </button>
              );
            })}
          </div>
          <p className="font-ui font-normal text-[12px] text-text-muted leading-[20px] tracking-[0.06px] md:text-[14px] md:tracking-[0.07px]">
            <span className="md:hidden">Expert Context</span>
            <span className="hidden md:inline">Inside an expert</span>
          </p>
        </div>
        <NavBox />
      </div>
    </div>
  );
}

export function ShellDecision02Slide() {
  return (
    <ShellDecisionLayout
      id="shell-decision-02"
      number="02"
      headline={["The nav adapts to", "where you are"]}
      chose="One nav component, two shapes. On For You it shows Home, Tools, Chat. Inside an expert it shows Home, Signature, Explore, Chat. Standalone apps only use the second shape."
      gaveUp="Building a separate standalone nav later, whenever the business decided to launch one."
      why="A user is either on For You or inside an expert, so the unified app needs two shapes. Standalone has no For You, so it only needs the one."
      visual={<NavAdaptsVisual />}
    />
  );
}

// ---------------------------------------------------------------- decision 03
//
// Figma desktop 7806:189778 (dark) / 7806:190569 (light); no mobile frame was
// drawn, so mobile follows decision 01's pattern (header, video, rationale).
// Same shape as 01 with a different slot: the showcase video is 550x600 here
// (x=730, so 130 from the 600px text column) rather than 600x655. The file is
// 1100x1200 — the slot's own 0.917 aspect — so cover and contain draw the
// same thing; `contain` is kept so a differently shaped re-export is never
// cropped.
//
// Copy verbatim from the frame, including "Why?". Headline is the deck's
// slide-title token (48px / 32px mobile) with Figma's break after "capped".
//
// Assets: ua_expertcapped_{light,dark}.mp4 (~7MB each, 11.8s). They replace
// ua_Expertidentities_*, which was the wrong clip and is no longer used.
export function ShellDecision03Slide({ active }: { active?: boolean }) {
  return (
    <ShellDecisionLayout
      id="shell-decision-03"
      number="03"
      headline={["Expert pinning, capped", "at four"]}
      chose="Pinning already existed as an uncapped list in the sidebar. It moved into the top bar and now caps at four."
      gaveUp="An unlimited pinned list tucked behind the menu."
      why="A hidden, unlimited list is hard to find and can still grow out of control. The top bar is where people switch experts, and four keeps it easy to scan."
      visual={
        <VideoVisual
          video={{
            light: "/images/ultraai/ua_expertcapped_light.mp4",
            dark: "/images/ultraai/ua_expertcapped_dark.mp4",
          }}
          label="UltraAI top bar of expert tabs, pinned experts capped at four with the rest behind Explore"
          active={active}
          frameClass="aspect-[550/600] md:w-[550px]"
          fit="contain"
        />
      }
    />
  );
}

// ---------------------------------------------------------------- decision 04
//
// Figma desktop 7857:26537 (dark) / 7864:97904 (light); no mobile frame, so
// mobile follows decision 01's pattern. The showcase video is 600x473 here
// (x=680, 80 from the text column) and vertically centred against the
// 580px-tall text block — which is what the layout's centring already does.
// The clip (1008x794, 1.27:1) is that slot's own aspect, so nothing is
// cropped.
//
// Copy verbatim from the frame, including "Why?". Headline is the deck's
// slide-title token with Figma's break after "wayfinding,".
//
// Assets: ua_Expertidentities_{light,dark}.mp4 (~4.3MB, 12s). The names
// match Figma's own layer, "Expert identities — Continuous loop".
export function ShellDecision04Slide({ active }: { active?: boolean }) {
  return (
    <ShellDecisionLayout
      id="shell-decision-04"
      number="04"
      headline={["Color as wayfinding,", "not branding"]}
      chose="Every expert gets its own accent color, used consistently on buttons, chips, and icons."
      gaveUp="One shared brand color for the whole app, with experts told apart only by their avatar and name."
      why="With nine experts in one app, color is the fastest way to know who you’re talking to, faster than reading a label every time."
      visual={
        <VideoVisual
          video={{
            light: "/images/ultraai/ua_Expertidentities_light.mp4",
            dark: "/images/ultraai/ua_Expertidentities_dark.mp4",
          }}
          label="UltraAI expert tabs, each expert in its own accent colour, looping through Kaia, Veda and Flex"
          active={active}
          frameClass="aspect-[600/473] md:w-[600px]"
          fit="contain"
        />
      }
    />
  );
}

// ---------------------------------------------------------------- decision 05
//
// Figma desktop 7879:107413 ("image 82", 600x711, x=680 from the text column's
// left). The right-hand asset is a composition of four onboarding screens:
// the user supplied them as FULL-SCREEN exports (1170x2532, light and dark),
// and this builds the composition from them — four bordered frames, each a
// crop of its screen, faded at the edges the way the Figma image is.
//
// Geometry read off the Figma render (pixel scan of the 1440x900 frame, origin
// = the asset's top-left), in 600x711 units, positioned as percentages so the
// composition scales with its slot on mobile:
//   birthdate  x 13.5  y 67   273 x 297   bottom-anchored crop (the sheet)
//   frequency  x 314   y 22   273 x 285   bottom-anchored crop
//   sun sign   x 13.5  y 403  273 x 302   crop starts at 33.5% of the screen
//   height     x 314   y 345  273 x 297   crop starts at 33.5% of the screen
// Border 4px, in the same tokens as the other mockup frames (bg-surface,
// text-muted in dark). Top two fade IN over their first ~48px, bottom two fade
// OUT over their last ~110 — a mask on each whole frame, so the border fades
// with the picture.
//
// Mobile has no frame in Figma; the same composition simply scales into the
// full-width slot between header and rationale, like decision 01's video.
//
// Assets: ua-onboarding-{birthdate,frequency,sunsign,height}[-dark].webp —
// the supplied PNGs at 801px wide (3x the 267px they render at) q88.
const W = 600;
const H = 711;
const pct = (n: number, of: number) => `${((n / of) * 100).toFixed(3)}%`;

const FADE_IN_TOP =
  "linear-gradient(to bottom, transparent 0, black 48px)";
const FADE_OUT_BOTTOM =
  "linear-gradient(to bottom, black calc(100% - 110px), transparent 100%)";

const ONBOARDING = [
  {
    key: "birthdate",
    x: 13.5,
    y: 67,
    h: 297,
    crop: "bottom",
    fade: FADE_IN_TOP,
  },
  {
    key: "frequency",
    x: 314,
    y: 22,
    h: 285,
    crop: "bottom",
    fade: FADE_IN_TOP,
  },
  {
    key: "sunsign",
    x: 13.5,
    y: 403,
    h: 302,
    crop: "top",
    fade: FADE_OUT_BOTTOM,
  },
  {
    key: "height",
    x: 314,
    y: 345,
    h: 297,
    crop: "top",
    fade: FADE_OUT_BOTTOM,
  },
] as const;

function OnboardingFrame({
  item,
}: {
  item: (typeof ONBOARDING)[number];
}) {
  const light = `/images/ultraai/ua-onboarding-${item.key}.webp`;
  const dark = `/images/ultraai/ua-onboarding-${item.key}-dark.webp`;
  const img = (src: string) => (
    <Image src={src} alt="" fill sizes="(min-width: 768px) 267px, 160px" />
  );
  return (
    <div
      className="absolute overflow-hidden rounded-[14px] border-4 border-bg-surface md:rounded-[24px] dark:border-text-muted"
      style={{
        left: pct(item.x, W),
        top: pct(item.y, H),
        width: pct(273, W),
        height: pct(item.h, H),
        maskImage: item.fade,
        WebkitMaskImage: item.fade,
      }}
    >
      {/* The screen at its natural 1170:2532 ratio, pinned to the frame's
          bottom edge or pushed up by a fraction of its own height. */}
      <div
        className="absolute inset-x-0 aspect-[1170/2532]"
        style={
          item.crop === "bottom"
            ? { bottom: 0 }
            : { top: 0, marginTop: "-72.5%" }
        }
      >
        <ThemeSwap light={img(light)} dark={img(dark)} />
      </div>
    </div>
  );
}

function OnboardingComposite() {
  return (
    <div
      className="relative aspect-[600/711] w-full md:w-[600px]"
      role="img"
      aria-label="Four onboarding screens: exact time of birth, exercise frequency, sun sign and height"
    >
      {ONBOARDING.map((item) => (
        <OnboardingFrame key={item.key} item={item} />
      ))}
    </div>
  );
}

export function ShellDecision05Slide() {
  return (
    <ShellDecisionLayout
      id="shell-decision-05"
      number="05"
      headline={["Ask for data when it’s", "needed."]}
      chose="Every expert asks for data only when a feature needs it. Veda’s first features need just a sun sign, so she starts light. Flex’s first feature needs body metrics, so he asks on day one."
      gaveUp="One onboarding flow for every expert."
      why="Asking less is not always better. Veda is useful with almost nothing, while a workout plan is useless without body metrics. Asking at the point of need gives people value sooner."
      visual={<OnboardingComposite />}
    />
  );
}

// ------------------------------------------------------------- Veda decision 01
//
// Figma desktop 7891:131694 ("veda -decision 01"); no mobile frame, so mobile
// follows the Shell decisions' pattern (header, visual, rationale). Same layout
// as the Shell decisions with "Decision · Veda" as the eyebrow.
//
// The visual is a 562x747 stack of six onboarding screens in two columns of
// three, 24 apart: the left column (x 21) is the INTENT flow — what draws you,
// experience, astrology system — and the right (x 295) the BIRTH-DETAIL
// screens — birthday, birth time known?, exact time. Columns are centred
// independently (683 vs 738 tall), so they start at different heights. Each
// screen is a cropped export (1170 x 924-1203) at 250 wide in a 4px frame
// (same border tokens as the other mockup frames, 16px radius), the box height
// being Figma's per-screen height; images fill it object-cover. The whole
// stack fades over its top and bottom 32px, as Figma's two gradient strips do
// — done as a mask so it fades to the surface in either theme.
//
// Everything is a percentage of 562x747, so the stack scales into the mobile
// slot unchanged.
//
// FILE NAMES vs CONTENT: ua_birthlocation_* is the "Do you know what time you
// were born?" screen and ua_birthtime_* the "exact time of birth?" picker —
// the names read the other way round. Used by what each shows, in Figma's
// order; say if the files were meant the other way.
//
// Assets: ua-veda-onboarding-{intent,experience,system,birthdate,
// birthlocation,birthtime}[-dark].webp — supplied PNGs at 750px (3x), q88.
const VEDA_W = 562;
const VEDA_H = 747;

const VEDA_SCREENS = [
  { key: "intent", x: 21, y: 32, h: 238, alt: "What draws you here? Love and Relationships, Spiritual Path, Daily Guidance, Moon and Cosmic Cycles" },
  { key: "experience", x: 21, y: 294, h: 197, alt: "How familiar are you with astrology?" },
  { key: "system", x: 21, y: 515, h: 200, alt: "Which astrology system feels like yours? Vedic or Western" },
  { key: "birthdate", x: 295, y: 4, h: 203, alt: "When's your birthday?" },
  { key: "birthlocation", x: 295, y: 231, h: 258, alt: "Do you know what time you were born?" },
  { key: "birthtime", x: 295, y: 513, h: 229, alt: "What is your exact time of birth?" },
] as const;

function VedaOnboardingStack() {
  const fade =
    "linear-gradient(to bottom, transparent 0, black 32px, black calc(100% - 32px), transparent 100%)";
  return (
    <div
      className="relative aspect-[562/747] w-full md:w-[562px]"
      style={{ maskImage: fade, WebkitMaskImage: fade }}
    >
      {VEDA_SCREENS.map((s) => (
        <div
          key={s.key}
          className="absolute overflow-hidden rounded-[10px] border-4 border-bg-surface md:rounded-2xl dark:border-text-muted"
          style={{
            left: `${((s.x / VEDA_W) * 100).toFixed(3)}%`,
            top: `${((s.y / VEDA_H) * 100).toFixed(3)}%`,
            width: `${((250 / VEDA_W) * 100).toFixed(3)}%`,
            height: `${((s.h / VEDA_H) * 100).toFixed(3)}%`,
          }}
        >
          <ThemeSwap
            light={
              <Image
                src={`/images/ultraai/ua-veda-onboarding-${s.key}.webp`}
                alt={s.alt}
                fill
                sizes="(min-width: 768px) 250px, 160px"
                className="object-cover"
              />
            }
            dark={
              <Image
                src={`/images/ultraai/ua-veda-onboarding-${s.key}-dark.webp`}
                alt={s.alt}
                fill
                sizes="(min-width: 768px) 250px, 160px"
                className="object-cover"
              />
            }
          />
        </div>
      ))}
    </div>
  );
}

export function VedaDecision01Slide() {
  return (
    <ShellDecisionLayout
      id="veda-decision-01"
      number="01"
      chapter="Veda"
      headline="Onboarding by intent"
      chose="Onboarding starts with what you came for. Your focus areas set what shows up first, and your experience level sets how Veda talks to you. Every expert starts this way."
      gaveUp="One long signup screen asking for birth date, time, and location before showing anything."
      why="Full birth details are more personal than a sun sign. Veda asks for them later, only when a feature like the birth chart needs them."
      visual={<VedaOnboardingStack />}
    />
  );
}

// ------------------------------------------------------------- Veda decision 02
//
// Figma desktop 7893:134109 ("veda -decision 02"); no mobile frame, so mobile
// follows the same pattern as the other decisions. Two phones, 254x550 in
// 4px frames, 40 apart, 132 from the text column: the Tarot "3 Cards Spread"
// screen with its Go Deeper sheet (the credit cost sits on the Get Insight
// button) beside the resulting chat reading. Left is an export 1170x2496 shown
// at 254x542 (Figma's own, inside the 550 frame), right 1170x2532 at 254x550.
//
// All percentages of 548x550, so the pair scales into the mobile slot.
//
// Assets: ua-veda-spreads[-dark].webp (ua_spreads_*) and
// ua-veda-spreads-chat[-dark].webp (ua_spreadschat_*), the supplied PNGs at
// 762px (3x), q88.
const VEDA_SPREADS = [
  { light: "/images/ultraai/ua-veda-spreads.webp", dark: "/images/ultraai/ua-veda-spreads-dark.webp", alt: "Tarot 3 Cards Spread with the Go Deeper sheet; the Get Insight button shows the credit cost" },
  { light: "/images/ultraai/ua-veda-spreads-chat.webp", dark: "/images/ultraai/ua-veda-spreads-chat-dark.webp", alt: "Veda's reading of the drawn cards in chat" },
] as const;

function VedaSpreadsVisual() {
  return (
    <div className="flex aspect-[548/550] w-full items-stretch justify-between md:w-[548px]">
      {VEDA_SPREADS.map((p) => (
        <div
          key={p.light}
          className="relative h-full w-[46.35%] overflow-hidden rounded-[10px] border-4 border-bg-surface md:rounded-2xl dark:border-text-muted"
        >
          <ThemeSwap
            light={
              <Image
                src={p.light}
                alt={p.alt}
                fill
                sizes="(min-width: 768px) 254px, 160px"
                className="object-cover object-top"
              />
            }
            dark={
              <Image
                src={p.dark}
                alt={p.alt}
                fill
                sizes="(min-width: 768px) 254px, 160px"
                className="object-cover object-top"
              />
            }
          />
        </div>
      ))}
    </div>
  );
}

export function VedaDecision02Slide() {
  return (
    <ShellDecisionLayout
      id="veda-decision-02"
      number="02"
      chapter="Veda"
      headline="Tarot’s credit economy"
      chose="Tarot is Veda’s signature feature. Drawing a card is free and unlimited, and only the AI insight on a card costs a credit. The cost shows on the button before you tap."
      gaveUp="Charging a credit for every action, including the draw."
      why="Free draws give people a reason to come back every day. The credit sits only on the interpretation, the one moment worth paying for."
      visual={<VedaSpreadsVisual />}
    />
  );
}

// --------------------------------------------------------- Paywall decision 01
//
// Figma desktop 7903:156032 ("paywall -decision 01"); no mobile frame, so
// mobile follows the other decisions (header, visual, rationale).
//
// The visual is a rotating three-up: the centre frame is 254x550 and the two
// behind it 231x500 at half opacity, tucked 32 in from each edge of the 652x550
// stage. Every 3 seconds the ring advances — the right frame comes to the
// centre, the centre goes left, the left goes round behind to the right — so
// each template takes the centre in turn. Order in Figma: sheet (centre), then
// feature paywall (left), full subscribe (right); it rotates in that order of
// appearance: sheet -> feature -> full.
//
// All three are the same 254x550 box, scaled 0.909 (231/254 = 500/550) for the
// sides rather than resized, so the whole move is transform + opacity and
// runs on the compositor. Positions are percentages of the stage, so it
// scales into the mobile slot. Clicking a side frame brings it to the
// centre and restarts the 3s wait. Autoplay runs only while the slide is the
// deck's active one and not under reduced motion.
//
// Frame border is 4px in the shared mockup-frame tokens (bg-surface, text-muted
// in dark); the centre frame has a soft lift (Figma's 0 22 35 at 56% read as harsh on
// the page — now 0 10 28 at 14%), the sides the standard hairline one. In dark mode shadows are off, as on the other frames.
//
// Assets: the three paywall exports (ua_paywallsheet / featurepaywall /
// fulldrawer, light and dark, 1170x2532, in Downloads when supplied) at 762px
// wide q88 as ua-paywall-{sheet,feature,full}[-dark].webp.
const PAYWALL_INTERVAL_MS = 3000;

const PAYWALL_FRAMES = [
  {
    key: "sheet",
    alt: "Bottom sheet paywall: Mangal Dosha Check with Unlock with Pro",
  },
  {
    key: "feature",
    alt: "Feature paywall: Full Planetary Transits with what you'll see and Unlock with Pro",
  },
  {
    key: "full",
    alt: "Full subscribe screen: Unlock Full Access with Annual and Weekly plans",
  },
] as const;

// The frames are not three slots that swap state. They sit on a ring and one
// continuous number, `progress`, moves them all: each frame's distance `d`
// from the centre is (index - progress) wrapped into [-1.5, 1.5), and its
// position, scale and opacity are plain functions of |d|. So a step is a real
// slide — everything travels left together; the frame leaving on the left
// fades out as it goes, and the one entering from the right fades in as it
// arrives — and the wrap from far left to far right happens at |d| = 1.5,
// where it is fully transparent, so it is never seen. The earlier version
// animated three fixed slots, which read as the centre frame shrinking and
// dimming while another popped up.
//
//   |d|   0      1       1.5
//   x     centre side    edge (one step further)
//   scale 1      0.909   0.82
//   opac. 1      0.5     0
//
// x is in percent of a frame's own width (254): centre 78.35, one step 70.25.
const PW_STEP = 70.25;
const PW_CENTER_X = 78.35;
const PW_EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];

function pwDistance(index: number, progress: number, n: number) {
  const v = index - progress;
  return ((((v + 1.5) % n) + n) % n) - 1.5;
}

function PaywallFrame({
  index,
  total,
  progress,
  frame,
  onSelect,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  frame: (typeof PAYWALL_FRAMES)[number];
  onSelect: (index: number) => void;
}) {
  const d = useTransform(progress, (p) => pwDistance(index, p, total));
  const x = useTransform(d, (v) => `${PW_CENTER_X + PW_STEP * v}%`);
  const y = useTransform(d, (v) => `${2.36 * Math.min(Math.abs(v), 1)}%`);
  const scale = useTransform(d, (v) => {
    const a = Math.abs(v);
    return a <= 1 ? 1 - 0.091 * a : 0.909 - 0.178 * (a - 1);
  });
  const opacity = useTransform(d, (v) => {
    const a = Math.abs(v);
    return a <= 1 ? 1 - 0.5 * a : Math.max(0, 0.5 * (1 - (a - 1) / 0.5));
  });
  const zIndex = useTransform(d, (v) => 10 - Math.round(Math.abs(v) * 4));
  // How central the frame is, 1 at the centre to 0 one step out: drives the
  // deep drop shadow, so it travels with the slide instead of snapping.
  const centred = useTransform(d, (v) => Math.max(0, 1 - Math.abs(v)));

  return (
    <motion.div
      style={{ x, y, scale, opacity, zIndex }}
      className="absolute left-0 top-0 h-full w-[38.96%]"
    >
      {/* The centre frame's soft lift (subtle in light mode). Its own layer because the
          frame below clips overflow; off in dark mode like the other frames. */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[10px] shadow-[0_10px_28px_color-mix(in_srgb,var(--color-text-primary)_14%,transparent)] md:rounded-2xl dark:hidden"
        style={{ opacity: centred }}
      />
      <button
        type="button"
        aria-label={`Show ${frame.key} paywall`}
        onClick={() => onSelect(index)}
        className="relative block h-full w-full cursor-pointer overflow-hidden rounded-[10px] border-4 border-bg-surface shadow-[0_0_2.5px_color-mix(in_srgb,var(--color-text-primary)_10%,transparent),0_0_0.5px_color-mix(in_srgb,var(--color-text-primary)_10%,transparent)] md:rounded-2xl dark:border-text-muted dark:shadow-none"
      >
        <ThemeSwap
          light={
            <Image
              src={`/images/ultraai/ua-paywall-${frame.key}.webp`}
              alt={frame.alt}
              fill
              sizes="(min-width: 768px) 254px, 140px"
              className="object-cover object-top"
            />
          }
          dark={
            <Image
              src={`/images/ultraai/ua-paywall-${frame.key}-dark.webp`}
              alt={frame.alt}
              fill
              sizes="(min-width: 768px) 254px, 140px"
              className="object-cover object-top"
            />
          }
        />
      </button>
    </motion.div>
  );
}

function PaywallCarousel({ active = true }: { active?: boolean }) {
  const progress = useMotionValue(0);
  const [tick, setTick] = useState(0);
  const reduceMotion = useReducedMotion();
  const n = PAYWALL_FRAMES.length;

  // One step every 3 seconds, the wait starting when the previous move ends
  // (and restarting after a click).
  useEffect(() => {
    if (!active || reduceMotion) return;
    let controls: ReturnType<typeof animate> | null = null;
    const id = window.setTimeout(() => {
      controls = animate(progress, Math.round(progress.get()) + 1, {
        duration: 0.9,
        ease: PW_EASE,
      });
      controls.then(() => setTick((t) => t + 1));
    }, PAYWALL_INTERVAL_MS);
    return () => {
      window.clearTimeout(id);
      controls?.stop();
    };
  }, [active, reduceMotion, tick, progress]);

  const select = (index: number) => {
    // Take the short way round to the clicked frame.
    const target =
      progress.get() + pwDistance(index, Math.round(progress.get()), n);
    if (reduceMotion) {
      progress.set(Math.round(target));
      setTick((t) => t + 1);
      return;
    }
    animate(progress, Math.round(target), { duration: 0.9, ease: PW_EASE }).then(
      () => setTick((t) => t + 1)
    );
  };

  return (
    <div className="relative aspect-[652/550] w-full md:w-[652px]">
      {PAYWALL_FRAMES.map((f, i) => (
        <PaywallFrame
          key={f.key}
          index={i}
          total={n}
          progress={progress}
          frame={f}
          onSelect={select}
        />
      ))}
    </div>
  );
}

export function PaywallDecision01Slide({ active }: { active?: boolean }) {
  return (
    <ShellDecisionLayout
      id="paywall-decision-01"
      number="01"
      chapter="Paywall"
      headline={["Three templates, real", "intent trigger"]}
      chose="Every paywall uses one of three formats: a bottom sheet for one blocked action, a feature paywall for a bigger ask, or a full subscribe screen. None of them appear until someone hits a real wall."
      gaveUp="One upgrade screen used everywhere, and prompts shown before someone has anything to lose."
      why="A paywall that appears too early feels like an interruption. One that appears right after a real wall feels fair, because the person already knows what they’re missing."
      visual={<PaywallCarousel active={active} />}
    />
  );
}

// --------------------------------------------------------- Paywall decision 02
//
// Figma desktop 7919:164389 ("paywall -decision 2"); no mobile frame, so
// mobile follows the other decisions. The visual is a 590x597 stack of five
// cropped screens, one per place the paywall appears, in two staggered
// columns: left (x 2, 282 wide) feature detail, chat credits ran out, the
// chip on an expert's home; right (x 308, 280 wide, centred vertically)
// profile page, right after onboarding. Each is a crop at its export's natural
// 1170-wide ratio (232 / 195 / 118 / 185 / 231 tall), in a 4px token frame
// with a subtle shadow in light mode (Figma's 0 5 7.5 at 35% read as harsh on
// the page — softened to a 6% drop plus the usual hairline; off in dark). Percentages of the stage, so it scales into the mobile slot.
//
// The "Chose" block here is a sentence plus a two-column bulleted list, in
// Figma's row-major order: detail page, credits run out / onboarding, profile /
// the home-screen chip. One column on mobile.
//
// Assets: ua-paywall-places-{detail,credits,onboarding,profile,chip}[-dark]
// .webp from ua_paywallfeaturedetail / datacreditranout / rightafteronboarding
// / ontheprofilepage / chiponanexperthomescreen, light and dark, at 840px
// wide (3x), q88.
const PW_PLACES_W = 590;
const PW_PLACES_H = 597;

const PW_PLACES = [
  { key: "detail", x: 2, y: 2, w: 282, h: 232, alt: "A feature's detail page with the Unlock Full Reading button" },
  { key: "credits", x: 2, y: 258, w: 282, h: 195, alt: "Chat usage limit reached with a Get Pro button" },
  { key: "chip", x: 2, y: 477, w: 282, h: 118, alt: "A Get Pro chip on an expert's home screen" },
  { key: "profile", x: 308, y: 78.5, w: 280, h: 185, alt: "Profile page with the Unlock UltraAI PRO banner" },
  { key: "onboarding", x: 308, y: 288.5, w: 280, h: 231, alt: "The paywall shown right after onboarding" },
] as const;

function PaywallPlacesVisual() {
  const pct = (n: number, of: number) => `${((n / of) * 100).toFixed(3)}%`;
  return (
    <div className="relative aspect-[590/597] w-full md:w-[590px]">
      {PW_PLACES.map((p) => (
        <div
          key={p.key}
          className="absolute overflow-hidden rounded-[10px] border-4 border-bg-surface shadow-[0_2px_6px_color-mix(in_srgb,var(--color-text-primary)_6%,transparent),0_0_2.5px_color-mix(in_srgb,var(--color-text-primary)_10%,transparent),0_0_0.5px_color-mix(in_srgb,var(--color-text-primary)_10%,transparent)] md:rounded-2xl dark:border-text-muted dark:shadow-none"
          style={{
            left: pct(p.x, PW_PLACES_W),
            top: pct(p.y, PW_PLACES_H),
            width: pct(p.w, PW_PLACES_W),
            height: pct(p.h, PW_PLACES_H),
          }}
        >
          <ThemeSwap
            light={
              <Image
                src={`/images/ultraai/ua-paywall-places-${p.key}.webp`}
                alt={p.alt}
                fill
                sizes="(min-width: 768px) 282px, 170px"
                className="object-cover object-top"
              />
            }
            dark={
              <Image
                src={`/images/ultraai/ua-paywall-places-${p.key}-dark.webp`}
                alt={p.alt}
                fill
                sizes="(min-width: 768px) 282px, 170px"
                className="object-cover object-top"
              />
            }
          />
        </div>
      ))}
    </div>
  );
}

export function PaywallDecision02Slide() {
  const places = [
    "A feature’s detail page",
    "When chat credits run out",
    "Right after onboarding",
    "On the profile page",
    "A chip on an expert’s home screen",
  ];
  return (
    <ShellDecisionLayout
      id="paywall-decision-02"
      number="02"
      chapter="Paywall"
      headline={["The paywall shows in", "five places only"]}
      chose={
        <>
          The paywall appears in only five places:
          <ul className="mt-8px grid list-disc grid-cols-1 gap-x-8px gap-y-8px ps-[24px] marker:text-text-primary md:grid-cols-2">
            {places.map((p) => (
              <li key={p} className="md:whitespace-nowrap">
                {p}
              </li>
            ))}
          </ul>
        </>
      }
      gaveUp="Adding an upgrade prompt wherever a screen felt empty."
      why="Five is a limit. Leaving other tempting spots out on purpose keeps the paywall from chasing people around the app."
      visual={<PaywallPlacesVisual />}
    />
  );
}

export default ShellDecision01Slide;
