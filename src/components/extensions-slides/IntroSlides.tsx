import GridDepthLayer from "@/components/shared/GridDepthLayer";
import AssetPlaceholder from "@/components/shared/AssetPlaceholder";
import ExtensionsLogomark from "@/components/extensions-slides/ExtensionsLogomark";

// Hero, Problem, Brief and Framework for the Extensions deck. Source of truth
// is the Extensions Figma frame (node 6408:8, file 2aoIFdaJMyNBEWeQESBEzG), a
// single vertical layout re-composed into the deck's slide shapes. Copy is
// tightened for skimming with the meaning kept.
//
// Register: Figma-locked B2B-style case study page, so the enterprise register
// FastRouter and Analytics use (the hero's "B2C" label is Figma's own).
//
// The hero illustration is a placeholder with no caption: Figma's ("The AI product
// making decisions at scale — with no instruments to read from") is
// FastRouter's line pasted in.

const META = [
  { label: "Role", value: "Senior Product Designer" },
  { label: "Team", value: "1 PM, 3 Engineers" },
  { label: "Timeline", value: "Jan – Nov 2025 · 11 months" },
  { label: "Pace", value: "3–5 days per extension" },
];

export function HeroSlide() {
  return (
    <section
      id="hero"
      className="relative flex h-full w-full flex-col overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:hidden" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] shrink-0 flex-col items-start justify-between gap-0 px-20px pt-40px pb-40px md:flex-row md:gap-40px md:px-80px md:pt-[calc(var(--fr-header-h,0px)+48px)] md:pb-0">
        <div className="flex w-full max-w-[720px] flex-col items-start gap-24px md:gap-40px">
          <div className="flex flex-wrap items-center gap-12px">
            <ExtensionsLogomark />
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
              Browser Extensions
            </span>
          </div>

          <div className="flex w-full flex-col items-start gap-24px md:gap-32px">
            <h1 className="w-full font-display text-text-primary text-slide-title-sm md:text-slide-title">
              Designed to stay installed.
            </h1>

            <div className="w-full border-border-frame border-t py-32px md:py-40px">
              <p className="font-ui font-normal text-[17px] text-text-primary leading-[28px] tracking-[0.085px]">
                Seven new-tab extensions, one designer. Each has half a second
                to justify itself before someone types a URL and moves on.
              </p>
            </div>
          </div>
        </div>

        <div className="grid w-full max-w-[400px] grid-cols-2 gap-24px md:w-auto md:gap-x-64px md:gap-y-40px">
          {META.map((item) => (
            <div key={item.label} className="flex flex-col items-start gap-12px">
              <span className="font-mono font-medium text-[13px] text-text-muted uppercase tracking-[0.78px]">
                {item.label}
              </span>
              <span className="font-ui text-[16px] text-text-primary tracking-[0.08px]">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative min-h-[320px] w-full flex-1 overflow-hidden md:min-h-0">
        <AssetPlaceholder label="[ Hero illustration ]" />
      </div>
    </section>
  );
}

const PROBLEM_PILLS = [
  "No design system across 7 extensions",
  "ATF viewport constraint on every tab open",
  "Users remove it in 3 clicks if it's not useful",
];

export function ProblemSlide() {
  return (
    <section
      id="problem"
      className="relative flex h-full w-full flex-col items-start justify-start overflow-hidden bg-bg-primary md:items-center md:justify-center"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:top-0 md:h-[600px]" />

      <div className="relative z-10 flex w-full max-w-[1440px] flex-col items-start gap-40px px-20px pt-40px md:h-full md:items-center md:justify-center md:gap-24px md:px-40px md:pt-0">
        <div className="flex w-full max-w-[760px] flex-col items-start gap-40px text-left md:items-center md:gap-24px md:text-center">
          <h1 className="w-full font-display text-text-primary text-slide-title-sm md:pb-40px md:text-slide-title">
            The Problem
          </h1>

          <p className="w-full font-ui font-semibold text-[24px] text-text-primary leading-[32px] tracking-[-0.1px] md:text-[28px] md:leading-[40px]">
            Designing for retention. Not for the install.
          </p>

          <div className="flex w-full flex-col gap-16px font-ui font-normal text-[16px] text-text-primary leading-[28px] tracking-[0.08px] md:text-[18px] md:leading-[30px] md:tracking-[0.09px]">
            <p>
              A new tab replacement isn&rsquo;t a landing page. A landing page
              converts a stranger. This one has already converted: the install
              happened.
            </p>
            <p>
              Its job now is harder. It has to justify itself every time a tab
              opens, or get removed, and users can uninstall in three clicks.
              The question isn&rsquo;t how to get installed. It&rsquo;s how to
              stay installed.
            </p>
          </div>

          <ul className="mt-16px flex w-full flex-wrap gap-12px md:justify-center">
            {PROBLEM_PILLS.map((pill) => (
              <li
                key={pill}
                className="rounded-xl border border-border-default bg-bg-primary px-24px py-16px font-ui font-semibold text-[14px] text-text-primary leading-[20px]"
              >
                {pill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function BriefSlide() {
  return (
    <section
      id="brief"
      className="relative flex h-full w-full flex-col items-start justify-start overflow-hidden bg-bg-primary md:items-center md:justify-center"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:top-0 md:h-[600px]" />

      <div className="relative z-10 flex w-full max-w-[880px] flex-col items-start gap-32px px-20px pt-40px md:h-full md:items-center md:justify-center md:px-40px md:pt-0 md:text-center">
        <span className="font-mono font-medium text-[13px] text-text-accent uppercase leading-[18px] tracking-[0.78px]">
          The Brief
        </span>
        <h1 className="font-display text-slide-title-sm text-text-primary md:text-slide-title">
          &ldquo;Build something people choose to keep installed.&rdquo;
        </h1>
        <p className="font-ui font-medium text-[14px] text-text-muted leading-[20px] tracking-[0.07px]">
          Business brief, verbatim
        </p>
        <div className="flex flex-col gap-16px font-ui font-normal text-[16px] text-text-primary leading-[28px] tracking-[0.08px] md:text-[18px] md:leading-[30px] md:tracking-[0.09px]">
          <p>That one shift changed every design decision.</p>
          <p>
            Designing for retention means designing for the hundredth use, not
            the first. There&rsquo;s no marketing layer to fall back on, so the
            product has to earn its place in the viewport every time.
          </p>
        </div>
      </div>
    </section>
  );
}

// Figma's table (rule / what it means / design implication) as four cards, a
// grid being easier to scan at a glance than a four-row table.
const RULES = [
  {
    rule: "ATF viewport",
    means: "Fully usable above the fold (ATF). The product itself, not a screenshot of it.",
    implies:
      "No headlines or value props above the fold. Every extension opens with the product filling the viewport.",
  },
  {
    rule: "Permissions upfront",
    means:
      "All permissions (demographics, browser details, IP) collected on one consent screen.",
    implies:
      "Drip permissions interrupt a daily-use product at every feature trigger. One moment is the better trade.",
  },
  {
    rule: "Compliance footer",
    means:
      "Privacy Policy, Terms of Service, Uninstall, Do Not Sell and Contact, on every page.",
    implies: "Non-negotiable. Design around it, never over it or beneath it.",
  },
  {
    rule: "Asset weight",
    means:
      "Extensions load on every new tab. A slow extension is a removal waiting to happen.",
    implies: "Every visual decision carries a performance question.",
  },
];

export function FrameworkSlide() {
  return (
    <section
      id="framework"
      className="relative flex h-full w-full flex-col overflow-hidden bg-bg-primary"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:top-0 md:h-[800px]" />

      <div className="relative z-10 w-full px-20px pt-32px pb-40px md:flex md:h-full md:flex-col md:justify-center md:px-80px md:pt-[var(--fr-header-h,0px)] md:pb-0">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-24px md:gap-32px">
          <div className="flex flex-col gap-16px">
            <span className="font-mono font-medium text-[13px] text-text-accent uppercase leading-[18px] tracking-[0.78px]">
              The Design Framework
            </span>
            <h1 className="font-display text-slide-title-sm text-text-primary md:text-slide-title">
              Four rules. Every extension ran through them.
            </h1>
            <p className="max-w-[760px] font-ui font-normal text-[16px] text-text-primary leading-[28px] tracking-[0.08px]">
              Designing a browser extension isn&rsquo;t designing a smaller web
              app. The format sets constraints that change which decisions are
              even available.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-16px md:grid-cols-2 md:gap-24px">
            {RULES.map((r) => (
              <div
                key={r.rule}
                className="flex flex-col gap-16px rounded-md border border-bg-light bg-bg-surface p-24px md:p-32px"
              >
                <h2 className="font-ui font-semibold text-[20px] text-text-primary leading-[26px] tracking-[-0.1px]">
                  {r.rule}
                </h2>
                <div className="flex flex-col gap-8px">
                  <span className="font-mono font-medium text-[13px] text-text-muted uppercase tracking-[0.78px]">
                    What it means
                  </span>
                  <p className="font-ui font-normal text-[16px] text-text-primary leading-[28px] tracking-[0.08px]">
                    {r.means}
                  </p>
                </div>
                <div className="flex flex-col gap-8px">
                  <span className="font-mono font-medium text-[13px] text-text-accent uppercase tracking-[0.78px]">
                    Design implication
                  </span>
                  <p className="font-ui font-normal text-[16px] text-text-primary leading-[28px] tracking-[0.08px]">
                    {r.implies}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
