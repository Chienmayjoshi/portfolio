import Image from "next/image";
import FastRouterLogomark from "@/components/fastrouter/FastRouterLogomark";
import GridDepthLayer from "@/components/shared/GridDepthLayer";

// Source of truth: Figma node 7032:61508 ("case study intro"), file
// 2aoIFdaJMyNBEWeQESBEzG — the fastrouter-slides horizontal format, not
// the live vertical-scroll /fastrouter route's Hero.tsx (kept untouched).
//
// Headline/TL;DR copy is identical to the live Hero, but sizing/weight
// differ deliberately in this Figma pass: 56px/64px/-1.2px (not the live
// page's 68px/76px/-1.2px — this format fits the whole intro in one
// viewport rather than a scroll column) and the TL;DR paragraph is
// font-normal here, not font-semibold like the live version.
//
// Eyebrow row ("FastRouter · B2B · AI Infrastructure") and the meta grid
// labels (ROLE/TEAM/TIMELINE/LIVE AT) use the new label-mono token (Geist
// Mono) instead of the live page's Google Sans Flex `label` style — see
// design-tokens.json's `label-mono` entry and IMPLEMENTATION_LOG.md's
// 2026-08-22 entry for why that's a new token, not a change to `label`.
// The "·" separators keep Google Sans Flex — Figma binds them to DM Sans,
// which is stale everywhere else in this project (CLAUDE.md), so treating
// this the same way.
//
// Illustration: two real, finished Figma assets (not placeholders) —
// "hero-plate 1" (a background gradient/vignette plate) layered under
// "image 1" (the cockpit "SELECT MODEL" illustration), downloaded and
// converted to webp as fr-hero-slides-plate / fr-hero-slides-illustration.
// Figma composes these at fixed, deliberately oversized offsets against a
// static 1440x900 canvas; that doesn't hold up responsively, so it's
// rebuilt here as a normal-flow band below the text rather than replicated
// pixel-for-pixel.
//
// This is a "slide," not a scroll section — the whole point of the
// horizontal format is that a slide fills exactly one viewport, no
// vertical scroll inside it. Height is owned by the slide stage now
// (src/app/fastrouter-slides/page.tsx, `calc(100dvh - 64px)` for the
// global Header) — was duplicated here as a local `HEADER_HEIGHT_PX`
// constant when this was the only slide; moved up once a second slide
// existed, so neither has to redeclare it.
//
// Content-start padding (pt-64px) is a fixed design-rhythm value, same
// token used everywhere else in this codebase — it's the illustration
// band that flexes (flex-1, fills whatever's left after the text column),
// since text length/height will vary slide to slide but the "where does
// content start" position shouldn't.
//
// Mobile treatment (node 7255:6865, "case study intro-mobile") verified
// per-value, not assumed — and re-verified a second time against Figma's
// current state after the person flagged the first pass as too generously
// spaced ("compact version where spacing is reduced"). Second pass used
// get_metadata's raw x/y/width/height rather than get_design_context's
// codegen, since the codegen output hadn't surfaced the content-block
// rhythm was tighter than desktop's, not just re-flowed at the same
// rhythm. Genuinely different numbers on mobile: side padding, the
// grid-depth decoration (new, not on desktop at all), content top padding
// (40 vs desktop's 64), every internal content gap (24 vs 40/32), the
// TL;DR paragraph's own padding (32 vs 40), and zero gap (vs 40) between
// the text block and the meta grid below it. TL;DR paragraph and
// meta-grid text sizes turned out identical to desktop's, so those needed
// no change. See the inline comments at each value below and
// IMPLEMENTATION_LOG.md.
export default function HeroSlide() {
  return (
    <section
      id="hero"
      className="relative flex h-full w-full flex-col overflow-hidden bg-bg-primary"
    >
      {/* Mobile-only decoration — the real mobile Figma frame (node
          7255:6865) adds this behind the eyebrow/headline; desktop's Hero
          (node 7032:61508) has no equivalent element at all, unlike
          ProblemSlide, which already uses GridDepthLayer on both. Not a
          responsive override of an existing desktop layer — genuinely new
          on mobile only, hence md:hidden rather than a breakpoint-scaled
          size. Position/height (top-32px, h-[200px]) measured directly off
          the mobile grid node (x=0 y=36 w=400 h=200); 36 isn't on this
          project's spacing scale and ties evenly between 32/40, rounded to
          32px to match the mobile header's own pt-32px rhythm. Height kept
          as an arbitrary bracket value, same as ProblemSlide's h-[600px] —
          200 isn't a defined scale step either, and large decorative
          dimensions like these aren't part of the small-increment rhythm
          scale in the first place. */}
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:hidden" />

      {/* Re-measured against the current Figma mobile frame (metadata for
          node 7255:7243, not just the earlier design-context pass) — this
          is a genuinely "compact" mobile spec, not a scaled-down version
          of desktop's rhythm: pt-40 (was pt-64), and gap-0 between the
          text block and the meta grid below (was gap-40 — Figma's own
          "content" frame shows zero explicit gap there; the meta grid's
          y-position lands exactly where the text block's own bottom edge
          ends, confirmed by direct math on the metadata, not assumed).
          md: values unchanged, still desktop's original spec.

          DESKTOP TOP PADDING is measured FROM THE HEADER, not from the
          viewport top. The deck pulls every slide up behind the transparent
          Header (page.tsx's marginTop: -headerHeight), so the old flat
          pt-64px put this content 64px from the VIEWPORT top — i.e. under a
          ~74px header, which is what made it read as crowded. Figma's own
          frame (node 7032:61508) puts the header row at y24 h54 (bottom 78)
          and the content block at y130: a 52px gap BELOW the header. Rebuilt
          as var(--fr-header-h) + 48px so the relationship holds whatever the
          real header measures — 52 rounded to the 48px scale token, same
          nearest-token treatment CLAUDE.md documents for other off-grid Figma
          values. Product does the same thing with its own (zero) offset.

          DESKTOP BOTTOM PADDING is 0, not 40. Figma's content block ends at
          y548 and the illustration frame starts at y548 — no gap at all; the
          40px below the description is the description block's OWN py-40px
          bottom (node 7032:61533: 40 pad + 56 text + 40 pad = 136). The extra
          wrapper pb-40px was doubling that to 80px. Mobile keeps pb-40px (the
          touch stack isn't pulled up behind the header, so its own frame's
          spacing still applies). */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] shrink-0 flex-col items-start justify-between gap-0 px-20px pt-40px pb-40px md:flex-row md:gap-40px md:px-80px md:pt-[calc(var(--fr-header-h,0px)+48px)] md:pb-0">
        {/* gap-24 (was gap-40): real mobile value, node 7255:7285. */}
        <div className="flex w-full max-w-[760px] flex-col items-start gap-24px md:gap-40px">
          <div className="flex flex-wrap items-center gap-12px">
            <FastRouterLogomark className="shrink-0" />
            <span className="font-ui text-[13px] text-text-muted uppercase tracking-[0.78px]">
              ·
            </span>
            <span className="font-mono font-medium text-[13px] text-text-muted uppercase tracking-[0.78px]">
              B2B
            </span>
            <span className="font-ui text-[13px] text-text-muted uppercase tracking-[0.78px]">
              ·
            </span>
            <span className="font-mono font-medium text-[13px] text-text-muted uppercase tracking-[0.78px]">
              AI Infrastructure
            </span>
          </div>

          {/* gap-24 (was gap-32): real mobile value, node 7255:7299. */}
          <div className="flex w-full flex-col items-start gap-24px md:gap-32px">
            {/* Base (<md) size corrected to the real mobile Figma frame
                (node 7255:7302): 32px/40px/-0.32px. The previous base
                value (36px/42px/-0.6px) predated any mobile Figma
                reference and was an unverified guess — see
                IMPLEMENTATION_LOG.md. md: (desktop, 56px/64px/-1.2px)
                unchanged, already verified against node 7032:61532. */}
            {/* Explicit w-full: harmless, defensive cross-axis sizing for
                this flex item under a flex-col+items-start parent (which
                doesn't stretch children by default). Not fixing an actual
                bug — a real mobile viewport (CDP device-metrics emulation)
                wraps this correctly either way; an early screenshot that
                appeared to show clipped/overflowing text turned out to be
                an artifact of headless Chrome's --window-size CLI flag not
                reliably setting the true CSS viewport at narrow widths,
                not a layout problem in this component. */}
            <h1 className="w-full font-display text-text-primary text-[32px] leading-[40px] tracking-[-0.32px] md:text-[56px] md:leading-[64px] md:tracking-[-1.2px]">
              Enterprise AI teams were flying blind on every model decision.
            </h1>

            {/* py-32 (was py-40): real mobile value, node 7255:7303. */}
            <div className="w-full border-border-frame border-t py-32px md:py-40px">
              <p className="font-ui font-normal text-[17px] text-text-primary leading-[28px] tracking-[0.085px]">
                I designed three features for FastRouter that gave teams
                their first systematic way to monitor cost, validate model
                quality, and reach a trusted verdict.
              </p>
            </div>
          </div>
        </div>

        {/* Desktop gap (gap-x-64px/gap-y-40px): Figma specifies
            gap-x-[56px], off this project's spacing scale (...48, 60,
            64...) — corrected to the existing 64px token, same 56->64
            rounding CLAUDE.md already documents for Council intro's
            identical off-grid value. Mobile gap (base gap-24px, node
            7255:7308): flat 24px both axes, measured directly — a real,
            different value from desktop's, not the same rounding case. */}
        <div className="grid w-full max-w-[400px] grid-cols-2 gap-24px md:w-auto md:gap-x-64px md:gap-y-40px">
          <div className="flex flex-col items-start gap-12px">
            <span className="font-mono font-medium text-[13px] text-text-muted uppercase tracking-[0.78px]">
              Role
            </span>
            <span className="font-ui text-[16px] text-text-primary tracking-[0.08px]">
              Senior Product Designer
            </span>
          </div>
          <div className="flex flex-col items-start gap-12px">
            <span className="font-mono font-medium text-[13px] text-text-muted uppercase tracking-[0.78px]">
              Team
            </span>
            <span className="font-ui text-[16px] text-text-primary tracking-[0.08px]">
              1 PM, 2 Engineers
            </span>
          </div>
          <div className="flex flex-col items-start gap-12px">
            <span className="font-mono font-medium text-[13px] text-text-muted uppercase tracking-[0.78px]">
              Timeline
            </span>
            <span className="font-ui text-[16px] text-text-primary tracking-[0.08px]">
              4 Weeks 2025-26
            </span>
          </div>
          <div className="flex flex-col items-start gap-12px">
            <span className="font-mono font-medium text-[13px] text-text-muted uppercase tracking-[0.78px]">
              Live At
            </span>
            <a
              href="https://fastrouter.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-ui text-[16px] text-text-accent tracking-[0.08px] hover:underline"
            >
              fastrouter.ai ↗
            </a>
          </div>
        </div>
      </div>

      {/* overflow-hidden here is the crop mask — the zoom wrapper inside
          scales up to 1.05 and this boundary is what keeps that from ever
          spilling past the band's own edges.

          Height model differs by mode. On desktop this is a slide inside a
          fixed-height horizontal stage, so `flex-1` fills whatever the text
          column leaves — `min-h-0` there lets the flex child shrink below
          its (image) content. On mobile the page scrolls freely (see
          page.tsx): the slide is content-sized, so there's no leftover
          height for `flex-1` to claim and this band would collapse to 0 and
          vanish. `min-h-[320px]` is a mobile floor so the illustration is
          always visibly present; the slide (and the page) just grows/scrolls
          around it. 320 is a provisional value — the mobile Hero frame never
          locked an explicit illustration height (the band is a normal-flow
          rebuild, not a 1:1 of Figma, per this file's header), so it's
          tunable, not a verified spec. */}
      <div
        className="relative min-h-[320px] w-full flex-1 overflow-hidden md:min-h-0"
        aria-hidden="true"
      >
        <div className="hero-zoom-loop absolute inset-0">
          <Image
            src="/images/fastrouter/fr-hero-slides-plate.webp"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <Image
            src="/images/fastrouter/fr-hero-slides-illustration.webp"
            alt=""
            fill
            className="object-cover object-top"
            priority
          />
        </div>
      </div>
    </section>
  );
}
