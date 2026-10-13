import Image from "next/image";
import UltraAILogomark from "@/components/ultraai/UltraAILogomark";
import GridDepthLayer from "@/components/shared/GridDepthLayer";

// Source of truth: Figma node 7518:6034 ("case study intro"), file
// 2aoIFdaJMyNBEWeQESBEzG — UltraAI's own case-study deck, same file as
// FastRouter's. Desktop content (eyebrow/headline/TL;DR/meta grid) is real,
// finished UltraAI copy, verified directly against the node.
//
// Mobile (node 7518:6118, "case study intro-mobile") is an UNFINISHED
// copy-paste of FastRouter's own mobile Hero — its text layers still read
// "Enterprise AI teams were flying blind...", "B2B · AI Infrastructure",
// "1 PM, 2 Engineers", "fastrouter.ai" etc. Per CLAUDE.md's UltraAI rule
// (flag every conflict, never pick silently): treated here as a LAYOUT
// reference only (padding/gaps/grid structure/the decorative grid band),
// not a content reference — the real copy below is the desktop frame's
// copy, carried over verbatim, same convention FastRouter's own HeroSlide
// already uses (one set of real copy, reflowed by breakpoint, not two
// independent texts).
//
// No forced <br> line-break pairs here (unlike FastRouter's HeroSlide) —
// that pattern exists there specifically because the case-study entrance
// animation flies words onto the headline by index, which requires a
// pinned arrangement. No entrance animation is wired for UltraAI yet, and
// Figma itself free-wraps this headline, so it free-wraps here too.
//
// Hero illustration: FastRouter's own asset, reused as-is per direct
// instruction — "keep hero image same as FastRouter for now, I'll update
// it later." Figma's own frame also still shows FastRouter's cockpit PNG
// in this slot, so this isn't a placeholder substitution, it's matching
// what's actually in the design right now.
//
// text-slide-title(-sm) used for the headline rather than Figma's literal
// 56px — same established deck-wide token or divergence already documented
// in CLAUDE.md for fastrouter-slides (48px code / 56px Figma, direct
// instruction 2026-09-04); this is a deck-format token, not a
// FastRouter-specific one, so the same value applies here.
//
// Deck/rail chrome (bottom segmented rail on desktop, floating chapter
// pill on mobile) is NOT built yet — deferred until a second slide exists
// to navigate to/from, per CLAUDE.md's "don't build shared infrastructure
// speculatively" rule. The back arrow / theme toggle seen in Figma's frame
// are the global Header's, not this slide's — already live via
// CASE_STUDY_ROUTE_PREFIXES.
export default function HeroSlide() {
  return (
    <section
      id="hero"
      className="relative flex h-full w-full flex-col overflow-hidden bg-bg-primary"
    >
      {/* Mobile-only decoration, matches mobile frame's "grid" layer
          (node 7518:6123, x0 y36 w400 h200) — same geometry FastRouter's
          HeroSlide already verified for the identical shared component. */}
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:hidden" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] shrink-0 flex-col items-start justify-between gap-0 px-20px pt-40px pb-40px md:flex-row md:gap-40px md:px-80px md:pt-[calc(var(--fr-header-h,0px)+48px)] md:pb-0">
        <div className="flex w-full max-w-[720px] flex-col items-start gap-24px md:gap-40px">
          <div className="flex flex-wrap items-center gap-12px">
            <UltraAILogomark className="shrink-0" />
            <span className="font-ui text-[13px] text-text-muted uppercase tracking-[0.78px]">
              ·
            </span>
            <span className="font-mono font-medium text-[13px] text-text-muted uppercase tracking-[0.78px]">
              B2C
            </span>
            <span className="font-ui text-[13px] text-text-muted uppercase tracking-[0.78px]">
              ·
            </span>
            <span className="font-mono font-medium text-[13px] text-text-muted uppercase tracking-[0.78px]">
              Multi-Expert AI
            </span>
          </div>

          <div className="flex w-full flex-col items-start gap-24px md:gap-32px">
            <h1 className="w-full font-display text-text-primary text-slide-title-sm md:text-slide-title">
              Turning a single AI chatbot into a system nine domain experts
              run on.
            </h1>

            <div className="w-full border-border-frame border-t py-32px md:py-40px">
              <p className="font-ui font-normal text-[17px] text-text-primary leading-[28px] tracking-[0.085px]">
                A chatbot is only as valuable as its one conversation.
                UltraAI runs on domain experts, each with its own home and
                signature feature, as one unified app or its own standalone
                app.
              </p>
            </div>
          </div>
        </div>

        <div className="grid w-full max-w-[400px] grid-cols-2 gap-24px md:w-auto md:gap-x-64px md:gap-y-40px">
          <div className="flex flex-col items-start gap-12px">
            <span className="font-mono font-medium text-[13px] text-text-muted uppercase tracking-[0.78px]">
              Role
            </span>
            <span className="font-ui text-[16px] text-text-primary tracking-[0.08px]">
              Lead Product Designer
            </span>
          </div>
          <div className="flex flex-col items-start gap-12px">
            <span className="font-mono font-medium text-[13px] text-text-muted uppercase tracking-[0.78px]">
              Platform
            </span>
            <span className="font-ui text-[16px] text-text-primary tracking-[0.08px]">
              iOS · Android · Web
            </span>
          </div>
          <div className="flex flex-col items-start gap-12px">
            <span className="font-mono font-medium text-[13px] text-text-muted uppercase tracking-[0.78px]">
              Team
            </span>
            <span className="font-ui text-[16px] text-text-primary tracking-[0.08px]">
              sole design and product decision-maker, no PM
            </span>
          </div>
          <div className="flex flex-col items-start gap-12px">
            <span className="font-mono font-medium text-[13px] text-text-muted uppercase tracking-[0.78px]">
              Constraint
            </span>
            <span className="font-ui text-[16px] text-text-primary tracking-[0.08px]">
              One codebase, unified app or standalone per expert
            </span>
          </div>
        </div>
      </div>

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
