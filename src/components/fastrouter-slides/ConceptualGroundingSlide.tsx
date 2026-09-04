import Image from "next/image";
import GridDepthLayer from "@/components/shared/GridDepthLayer";

// Council chapter — "Conceptual Grounding" slide. Figma desktop node
// 7183:97478 / mobile 7320:14911, file 2aoIFdaJMyNBEWeQESBEzG. Grounds the
// Council design in Andrej Karpathy's real "llm-council" tweet: a headline +
// three-step flow (respond → rank → synthesize) + the insight that drove the
// design, alongside a reconstructed embed of the tweet.
//
// Layout differs by breakpoint (two separate Figma frames):
//   - Desktop: two columns — left = headline / horizontal 3-step flow /
//     insight; right = the full tweet card. Vertically centred.
//   - Mobile: one column — headline, the tweet (a fixed-height card faded off
//     at the bottom), the 3-step flow stacked vertically, then the insight.
//
// The tweet is REBUILT (not a screenshot) to reflow into the narrow column, in
// Source Sans 3 (`font-tweet` — an approved third-font exception for this
// Twitter/X reproduction; see layout.tsx). Its colours are literal Twitter
// light/dark values with `dark:` variants (an inverse-ish surface, like the
// SegmentedRail pill), not portfolio tokens. Same tweet + content as the
// vertical-scroll case study's fr-karpathy-tweet screenshot.

const STEPS = [
  {
    n: "1",
    title: "Respond independently",
    desc: "Each model answers the same query separately.",
  },
  {
    n: "2",
    title: "Rank anonymously",
    desc: "Each model ranks the others' answers — without knowing authorship.",
  },
  {
    n: "3",
    title: "Synthesize the verdict",
    desc: "A chairman model produces the final response.",
  },
] as const;

// X "verified" badge — the standard scalloped blue mark.
function VerifiedBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 22" aria-hidden="true" className={className}>
      <path
        fill="#1d9bf0"
        d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
      />
    </svg>
  );
}

// Tweet engagement icons — clean line glyphs (Phosphor-style), currentColor so
// they follow the card's theme-adaptive muted colour. Inline stand-ins: the
// project's icon lib (@phosphor-icons/react) can't be installed in this
// sandbox (npm registry unreachable — the same block noted in Header.tsx), so
// these are hand-matched to Phosphor's ChatCircle / Repeat / Heart / ChartBar /
// Export. Swap to the real Phosphor icons once the package installs.
const ICON: Record<string, string> = {
  comment: "M4.5 5.5A1.5 1.5 0 0 1 6 4h12a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 18 15H9.5L5 18.5V15A1.5 1.5 0 0 1 4.5 13.5Z",
  retweet: "M4 9V8a3 3 0 0 1 3-3h9m0 0-3-3m3 3-3 3M20 15v1a3 3 0 0 1-3 3H8m0 0 3 3m-3-3 3-3",
  like: "M12 20.3 3.9 12.2A4.5 4.5 0 0 1 3 9.5 4.2 4.2 0 0 1 7.2 5.3c1.5 0 2.9.7 3.8 1.9l1 .1 1-.1a4.7 4.7 0 0 1 3.8-1.9A4.2 4.2 0 0 1 21 9.5a4.5 4.5 0 0 1-.9 2.7Z",
  view: "M5 20V10M12 20V4M19 20v-8",
  share: "M12 15V3.5M8 7l4-4 4 4M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6",
};

function EngagementIcon({ name }: { name: keyof typeof ICON }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-[19px] shrink-0"
    >
      <path d={ICON[name]} />
    </svg>
  );
}

// Reconstructed tweet body — Karpathy's raw text (** left literal, as posted).
function TweetBody() {
  return (
    <>
      {`As a fun Saturday vibe code project and following up on this tweet earlier, I hacked up an **llm-council** web app. It looks exactly like ChatGPT except each user query is `}
      <br />
      <br />
      1) dispatched to multiple models on your council using OpenRouter, e.g.
      currently:
      <br />
      {`"openai/gpt-5.1", "google/gemini-3-pro-preview", "anthropic/claude-sonnet-4.5", "x-ai/grok-4",`}
      <br />
      <br />
      {`Then 2) all models get to see each other's (anonymized) responses and they review and rank them, and`}
      <br />
      &nbsp;
      <br />
      {`then 3) a "Chairman LLM" gets all of that as context and produces the final response.`}
    </>
  );
}

// The reconstructed X card. `compact` = the mobile size set (smaller avatar /
// type / padding); on mobile the card is also clipped to a fixed height and
// faded (handled by the caller), so the timestamp + menu below stay out of
// view. Colours are literal Twitter light values with dark: overrides.
function TweetCard({ compact = false }: { compact?: boolean }) {
  const nameSize = compact ? "text-[16px]" : "text-[18px]";
  const bodySize = compact ? "text-[14px]" : "text-[18px]";
  const metaSize = compact ? "text-[14px]" : "text-[16px]";
  // Desktop bottom fade. Figma (node 7183:97478) dissolves the WHOLE card at
  // the bottom — border, surface and the engagement row all go with it — the
  // same treatment the Product recording gets. This was previously an overlay
  // div filled with a gradient to the card's own background, which is
  // invisible by construction: white fading into white on a card whose content
  // ends inside it. A mask on the card root is what actually reproduces it,
  // and it's this codebase's established mechanic for a faded edge
  // (ScreenshotFrame's `black 82%, transparent 100%`). The ramp here is deeper
  // and finishes EARLY (72% -> 97%, not 100%): ScreenshotFrame fades a
  // screenshot that sits inside a bezel, so a soft tail is fine, but here the
  // thing being faded is the card's own border and rounded bottom corner —
  // reaching zero only at the very last pixel row left that edge faintly
  // drawn, which reads as a clipped card rather than a dissolving one. The
  // mobile card is clipped to a fixed height instead and gets its own
  // fade-to-page-bg from the caller, so it stays unmasked.
  const fadeMask = "linear-gradient(to bottom, black 72%, transparent 97%)";
  return (
    <div
      className={`relative flex w-full gap-8px overflow-hidden rounded-[16px] border border-[#d9d9d9] bg-white font-tweet dark:border-[#38444d] dark:bg-[#15202b] ${
        compact ? "h-[300px] p-12px" : "rounded-[24px] p-24px"
      }`}
      style={
        compact
          ? undefined
          : { maskImage: fadeMask, WebkitMaskImage: fadeMask }
      }
    >
      <div className={`flex min-w-0 flex-1 items-start ${compact ? "gap-12px" : "gap-16px"}`}>
        {/* Avatar */}
        <div
          className={`relative shrink-0 overflow-hidden rounded-full ${
            compact ? "size-40px" : "size-[63px]"
          }`}
        >
          <Image
            src="/images/fastrouter/fr-karpathy-avatar.png"
            alt="Andrej Karpathy"
            fill
            className="object-cover"
            sizes="63px"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-12px">
          {/* Name / handle */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4px">
              <span className={`font-bold text-[#1e2b14] dark:text-[#e7e9ea] ${nameSize}`}>
                Andrej Karpathy
              </span>
              <VerifiedBadge className="size-[17px] shrink-0" />
            </div>
            <span className={`text-[#828282] dark:text-[#71767b] ${metaSize}`}>
              @karpathy
            </span>
          </div>

          {/* Body */}
          <p
            className={`whitespace-pre-wrap text-[#1e2b14] leading-[1.4] dark:text-[#e7e9ea] ${bodySize}`}
          >
            <TweetBody />
          </p>

          {/* Timestamp */}
          <div className={`flex items-center gap-6px text-[#828282] dark:text-[#71767b] ${metaSize}`}>
            <span>5:24 AM</span>
            <span aria-hidden="true">·</span>
            <span>Nov 23, 2025</span>
            <span aria-hidden="true">·</span>
            <span>
              <span className="font-semibold">5.3M</span> Views
            </span>
          </div>

          {/* Engagement menu */}
          <div className="flex items-center justify-between py-8px text-[#828282] dark:text-[#71767b]">
            {(["comment", "retweet", "like", "view"] as const).map((name) => (
              <div key={name} className="flex items-center gap-6px">
                <EngagementIcon name={name} />
                <span className={metaSize}>22.4k</span>
              </div>
            ))}
            <EngagementIcon name="share" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Numbered flow step. `compact` = mobile (row layout, 28px chip); desktop is a
// vertical block with a 48px chip. The chip is an INVERSE surface (dark on the
// light page, light on the dark page) — bg-text-primary / text-bg-primary.
function FlowStep({
  n,
  title,
  desc,
  compact = false,
}: {
  n: string;
  title: string;
  desc: string;
  compact?: boolean;
}) {
  const chip = (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-text-primary font-ui font-semibold text-bg-primary ${
        compact ? "size-[28px] text-[14px]" : "size-48px text-[17px]"
      }`}
    >
      {n}
    </div>
  );
  const text = (
    <div className={`flex min-w-0 flex-col ${compact ? "gap-2px" : "gap-8px"}`}>
      <span className="font-ui font-semibold text-[17px] text-text-primary leading-[28px] tracking-[0.085px]">
        {title}
      </span>
      <span className="font-ui font-normal text-[14px] text-text-muted leading-[20px] tracking-[0.07px]">
        {desc}
      </span>
    </div>
  );
  return compact ? (
    <div className="flex w-full items-start gap-12px">
      {chip}
      {text}
    </div>
  ) : (
    <div className="flex w-[200px] flex-col gap-24px">
      {chip}
      {text}
    </div>
  );
}

const Eyebrow = () => (
  <span className="font-mono font-medium text-[13px] text-text-accent uppercase tracking-[0.78px]">
    CONCEPTUAL GROUNDING
  </span>
);

export default function ConceptualGroundingSlide() {
  return (
    <section
      id="council-grounding"
      className="relative flex h-full w-full flex-col overflow-hidden bg-bg-primary md:items-center md:justify-center"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:top-0 md:h-[800px]" />

      {/* ---------- Desktop: two columns ---------- */}
      <div className="relative z-10 hidden w-full max-w-[1240px] items-start gap-40px px-40px md:flex">
        {/* Left column */}
        <div className="flex w-[700px] shrink-0 flex-col gap-[56px]">
          <div className="flex flex-col gap-24px">
            <Eyebrow />
            <div className="flex flex-col gap-16px">
              <h1 className="font-display text-slide-title text-text-primary">
                Reference: Andrej Karpathy&apos;s llm-council
              </h1>
              <p className="font-ui font-normal text-[16px] text-text-muted leading-[28px] tracking-[0.08px]">
                A personal experiment in multi-model deliberation.
              </p>
            </div>
          </div>

          {/* Horizontal flow: step → arrow → step → arrow → step */}
          <div className="flex items-start justify-between">
            <FlowStep {...STEPS[0]} />
            <span className="mt-[60px] font-ui text-[24px] text-text-muted">→</span>
            <FlowStep {...STEPS[1]} />
            <span className="mt-[60px] font-ui text-[24px] text-text-muted">→</span>
            <FlowStep {...STEPS[2]} />
          </div>

          {/* Insight */}
          <div className="flex flex-col gap-12px border-text-accent border-l-[3px] pl-20px font-ui font-semibold text-[17px] text-text-primary leading-[28px] tracking-[0.085px]">
            <p>The insight that changed the design:</p>
            <p>
              Models were willing to rank another model&apos;s response above
              their own — but only when anonymous. Remove authorship, remove
              bias.
            </p>
          </div>
        </div>

        {/* Right column — tweet */}
        <div className="w-[500px] shrink-0">
          <TweetCard />
        </div>
      </div>

      {/* ---------- Mobile: stacked ---------- */}
      <div className="relative z-10 flex w-full flex-col gap-24px px-20px py-40px md:hidden">
        <div className="flex flex-col gap-16px">
          <Eyebrow />
          <h1 className="font-display text-slide-title-sm text-text-primary">
            Reference: Andrej Karpathy&apos;s llm-council
          </h1>
          <p className="font-ui font-normal text-[16px] text-text-primary leading-[28px] tracking-[0.08px]">
            A personal experiment in multi-model deliberation.
          </p>
        </div>

        {/* Tweet — fixed-height card faded off at the bottom (to the page bg). */}
        <div className="relative w-full">
          <TweetCard compact />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[80px]"
            style={{
              background:
                "linear-gradient(to top, var(--color-bg-primary) 30%, transparent)",
            }}
          />
        </div>

        {/* Vertical flow */}
        <div className="flex flex-col gap-12px">
          {STEPS.map((s) => (
            <FlowStep key={s.n} {...s} compact />
          ))}
        </div>

        {/* Insight — single paragraph */}
        <div className="border-text-accent border-l-[3px] pl-16px">
          <p className="font-ui font-medium text-[14px] text-text-primary leading-[20px] tracking-[0.07px]">
            The insight that changed the design: models were willing to rank
            another model&apos;s response above their own — but only when
            anonymous. Remove authorship, remove bias.
          </p>
        </div>
      </div>
    </section>
  );
}
