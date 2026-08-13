// Source of truth: Figma node 6368:53759 (FastRouter file, per CLAUDE.md).
//
// FLAGGED: the two "-body.png" asset files have their filenames swapped
// relative to their actual content, confirmed by the literal URL baked
// into each chrome screenshot:
// - "fr-browser-chrome-rejected-pg-body.png" actually shows the SHIPPED
//   "Model Council" verdict-first UI (matches dashboard.fastrouter.ai/
//   model-council/ in the shipped chrome image, and matches Figma's own
//   "Verdict-first layout" / "Three visible stages" captions).
// - "fr-browser-chrome-shipped-council-body.png" actually shows the
//   REJECTED "Playground" side-by-side UI (matches dashboard.fastrouter.ai/
//   model-playground in the rejected chrome image, and matches Figma's own
//   "Multiple llm response columns side by side" / "Final Verdict buried
//   at the bottom" captions).
// Wired below by actual content, not filename. Worth renaming the source
// files to match so this isn't a landmine later.
//
// Dark-mode variants (2026-07-14, ThemeSwap-wired) follow the same
// already-swapped filenames above with a "-dark" suffix appended to
// whichever file is actually being referenced at each call site — not
// the prop name — so this doesn't compound into a second landmine.
//
// Container was 1280px wide with 80px side margins (not the usual
// 1136px/60px used elsewhere on this page) — measured directly off this
// node, a genuine (not drifted) exception at the time: this comparison
// needed the extra width to show two 546px browser mockups side by side.
// Unified 2026-07-16 per direct instruction: the whole page moved to one
// shared 1060px section / 980px content width, and this section's two
// columns shrank from 546px to 470px each (980 − 40px gap, split evenly)
// to fit rather than staying a wider exception — keeps the rail-clearance
// goal (SectionRail.tsx, fixed at the left edge) consistent here too,
// since this was already the widest section on the page. The row's old
// `justify-between` (relying on leftover slack at the previous width) is
// now an explicit `gap-40px`, matching how every other two-column/
// decision-row gap on this page is expressed.
//
// Reason-list body text is bound to Brand/Dark (#1E2B14) in Figma — the
// Twitter/X brand color used elsewhere in this same file for the tweet
// embed's name text (Scroll 5). Looks like a copy-paste artifact from that
// component into unrelated case-study copy; using text-primary (#0D0D0D)
// instead.
import Image from "next/image";
import ThemeSwap from "@/components/shared/ThemeSwap";

const rejectedReasons = [
  'Multiple llm response columns side by side — signals "compare these yourself" not "here\'s a verdict"',
  "Final Verdict buried at the bottom — treated as an afterthought, not the primary output",
  "No process visibility — user sees responses and a verdict with nothing in between",
];

const shippedReasons: React.ReactNode[] = [
  // Figma hard-breaks this one into two lines (the other two reasons in
  // both columns rely on natural wrap to reach 2 lines) — this line is
  // short enough to fit on one line at this column width otherwise,
  // which was making this row shorter than its "rejected" counterpart
  // and throwing off the divider alignment between the two columns.
  <>
    Verdict-first layout —
    <br />
    Final Verdict at the top, process stages below
  </>,
  "Three visible stages (Stage 1, 2, 3) with completion states — process is the proof of rigour",
  "Persistent member strip with avatars — council composition always visible, no mid-session anxiety about which models are active",
];

function RejectedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-24px shrink-0 text-text-error">
      <path
        d="M22.4831 14.7188L21.3581 5.71875C21.2896 5.17489 21.0249 4.67475 20.6137 4.31224C20.2025 3.94974 19.6732 3.74981 19.125 3.75H3C2.60218 3.75 2.22064 3.90804 1.93934 4.18934C1.65804 4.47064 1.5 4.85218 1.5 5.25V13.5C1.5 13.8978 1.65804 14.2794 1.93934 14.5607C2.22064 14.842 2.60218 15 3 15H7.03687L10.5787 22.0856C10.6411 22.2102 10.7369 22.315 10.8555 22.3882C10.9741 22.4614 11.1107 22.5001 11.25 22.5C12.2446 22.5 13.1984 22.1049 13.9017 21.4017C14.6049 20.6984 15 19.7446 15 18.75V17.25H20.25C20.5693 17.2501 20.8849 17.1823 21.176 17.051C21.467 16.9197 21.7268 16.728 21.938 16.4885C22.1492 16.2491 22.3071 15.9675 22.4011 15.6623C22.4951 15.3572 22.523 15.0355 22.4831 14.7188ZM6.75 13.5H3V5.25H6.75V13.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ShippedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-24px shrink-0 text-text-success">
      <path
        d="M21.9375 7.51125C21.7263 7.27193 21.4666 7.08028 21.1757 6.94903C20.8847 6.81778 20.5692 6.74994 20.25 6.75H15V5.25C15 4.25544 14.6049 3.30161 13.9017 2.59835C13.1984 1.89509 12.2446 1.5 11.25 1.5C11.1107 1.4999 10.9741 1.53862 10.8555 1.61181C10.7369 1.685 10.6411 1.78977 10.5787 1.91437L7.03687 9H3C2.60218 9 2.22064 9.15804 1.93934 9.43934C1.65804 9.72064 1.5 10.1022 1.5 10.5V18.75C1.5 19.1478 1.65804 19.5294 1.93934 19.8107C2.22064 20.092 2.60218 20.25 3 20.25H19.125C19.6732 20.2502 20.2025 20.0503 20.6137 19.6878C21.0249 19.3253 21.2896 18.8251 21.3581 18.2812L22.4831 9.28125C22.523 8.9644 22.495 8.64268 22.4009 8.3375C22.3068 8.03232 22.1489 7.75066 21.9375 7.51125ZM3 10.5H6.75V18.75H3V10.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

interface ComparisonColumnProps {
  kind: "rejected" | "shipped";
  title: string;
  chromeSrc: string;
  chromeSrcDark: string;
  bodySrc: string;
  bodySrcDark: string;
  bodyAlt: string;
  reasons: React.ReactNode[];
}

function ComparisonColumn({
  kind,
  title,
  chromeSrc,
  chromeSrcDark,
  bodySrc,
  bodySrcDark,
  bodyAlt,
  reasons,
}: ComparisonColumnProps) {
  const isRejected = kind === "rejected";

  return (
    <div className="flex flex-col w-full md:w-[470px]">
      <div className="flex flex-col gap-4px items-start">
        <span
          className={`font-ui font-medium text-[13px] uppercase tracking-[0.78px] ${
            isRejected ? "text-text-error" : "text-text-success"
          }`}
        >
          {isRejected ? "REJECTED" : "SHIPPED"}
        </span>
        <p className="font-ui font-semibold text-text-primary text-[17px] leading-[28px] tracking-[0.085px]">
          {title}
        </p>
      </div>

      <div className="mt-24px rounded-[8px] border border-border-default overflow-hidden w-full md:w-[470px]">
        <ThemeSwap
          light={
            <img
              src={chromeSrc}
              alt=""
              width={546}
              height={80}
              className="block w-full h-auto"
              style={{ aspectRatio: "546/80" }}
            />
          }
          dark={
            <img
              src={chromeSrcDark}
              alt=""
              width={546}
              height={80}
              className="block w-full h-auto"
              style={{ aspectRatio: "546/80" }}
            />
          }
        />
        <ThemeSwap
          light={
            <Image
              src={bodySrc}
              alt={bodyAlt}
              width={546}
              height={588}
              className="block w-full h-auto"
            />
          }
          dark={
            <Image
              src={bodySrcDark}
              alt={bodyAlt}
              width={546}
              height={588}
              className="block w-full h-auto"
            />
          }
        />
      </div>

      <div className="mt-24px flex flex-col items-start w-full">
        {reasons.map((reason, i) => (
          <div
            key={i}
            className={`flex gap-16px items-center p-16px w-full ${
              i < reasons.length - 1
                ? "border-b border-border-default"
                : "rounded-xl"
            }`}
          >
            {isRejected ? <RejectedIcon /> : <ShippedIcon />}
            <p className="font-ui font-normal text-text-primary text-[14px] leading-[20px] tracking-[0.07px] flex-1">
              {reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RejectedVsShipped() {
  return (
    <section className="w-full py-80px flex flex-col items-center">
      <div className="max-w-[var(--width-content)] mx-auto px-[var(--edge-padding)] md:px-40px flex flex-col gap-32px w-full">
        <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
          REJECTED vs shipped
        </span>

        <div className="flex flex-col md:flex-row gap-40px items-start w-full">
          <ComparisonColumn
            kind="rejected"
            title="Council as Playground extension"
            chromeSrc="/images/fastrouter/fr-browser-chrome-rejected-pg.webp"
            chromeSrcDark="/images/fastrouter/fr-browser-chrome-rejected-pg-dark.webp"
            bodySrc="/images/fastrouter/fr-browser-chrome-shipped-council-body.png"
            bodySrcDark="/images/fastrouter/fr-browser-chrome-shipped-council-body-dark.png"
            bodyAlt="Rejected direction: a Playground-style layout with multiple model responses side by side and the final verdict buried at the bottom"
            reasons={rejectedReasons}
          />
          <ComparisonColumn
            kind="shipped"
            title="Council as its own surface ✓"
            chromeSrc="/images/fastrouter/fr-browser-chrome-shipped-council.webp"
            chromeSrcDark="/images/fastrouter/fr-browser-chrome-shipped-council-dark.webp"
            bodySrc="/images/fastrouter/fr-browser-chrome-rejected-pg-body.png"
            bodySrcDark="/images/fastrouter/fr-browser-chrome-rejected-pg-body-dark.png"
            bodyAlt="Shipped design: Model Council with a verdict-first layout, three visible deliberation stages, and a persistent member strip"
            reasons={shippedReasons}
          />
        </div>
      </div>
    </section>
  );
}
