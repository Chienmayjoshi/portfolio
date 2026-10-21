import Image from "next/image";
import GridDepthLayer from "@/components/shared/GridDepthLayer";
import ThemeSwap from "@/components/shared/ThemeSwap";

// "The design system" slide for the UltraAI deck — Figma desktop node
// 8043:29592 ("design system - scroll 10"), file 2aoIFdaJMyNBEWeQESBEzG. The
// image is the second export (2445x4161, a tight run of every block of the
// system), which replaced the first (2445x4575) on request. Rail
// tick: "design-system". No mobile frame was drawn.
//
// Left (600 wide, 500 for the list): accent eyebrow, headline (deck
// slide-title token — the frame's 48px, 32 mobile), muted paragraph, four
// thumbs-up (text-success) rows, then a semibold closing statement. Right: a
// 600x600 window onto the design-system screenshot (light and dark
// exports), which scrolls vertically, very slowly, so the system reads as one
// continuous run of blocks. Both ends of the window fade out through a mask
// (Figma's frame fades the top and bottom the same way), so the image enters
// and leaves instead of being cut.
//
// THE SCROLL: two copies of the image stacked in a track, the track
// translating exactly one copy-height and repeating (see `.ua-ds-track` in
// globals.css), 110s a lap — about 10px a second at 600 wide. Pure CSS, no
// JS: it is an ambient loop, not scroll- or state-driven. It holds still under
// prefers-reduced-motion. Each copy carries a 24px gap under it, so the point where
// one lap ends and the next begins reads as the gap between two blocks of the
// system, with the fades easing it in and out.
//
// MOBILE (smart, no frame): the window comes between the header and the list —
// header, the scrolling system, then the rows and the statement — as the other
// decisions order theirs. It becomes full width and 4:3-ish (a shorter window
// than desktop's square, so the headline, the window and the first rows share
// a screen), and at that width the image is smaller, so the same 110s lap
// reads proportionally slower — fine, it is meant to be ambient.
//
// Figma notes, flagged not silently fixed: row text is a one-off #1E2B14 (a
// dark green-black), set as text-primary; the first row's gap and weight match
// the others'.
//
// Asset: ua-design-system-board[-dark].webp — the exports at 1200px wide (2x the 600
// they render at), q82.
const THUMB_UP =
  "M22.4831 14.7188L21.3581 5.71875C21.2896 5.17489 21.0249 4.67475 20.6137 4.31224C20.2025 3.94974 19.6732 3.74981 19.125 3.75H3C2.60218 3.75 2.22064 3.90804 1.93934 4.18934C1.65804 4.47064 1.5 4.85218 1.5 5.25V13.5C1.5 13.8978 1.65804 14.2794 1.93934 14.5607C2.22064 14.842 2.60218 15 3 15H7.03687L10.5787 22.0856C10.6411 22.2102 10.7369 22.315 10.8555 22.3882C10.9741 22.4614 11.1107 22.5001 11.25 22.5C12.2446 22.5 13.1984 22.1049 13.9017 21.4017C14.6049 20.6984 15 19.7446 15 18.75V17.25H20.25C20.5693 17.2501 20.8849 17.1823 21.176 17.051C21.467 16.9197 21.7268 16.728 21.938 16.4885C22.1492 16.2491 22.3071 15.9675 22.4011 15.6623C22.4951 15.3572 22.523 15.0355 22.4831 14.7188ZM6.75 13.5H3V5.25H6.75V13.5Z";

const POINTS = [
  "First pass of tokens generated with AI, then tuned by hand in Figma",
  "Flex reused every token and changed only its accent",
  "Shared components (Empty State, Paywall, Onboarding) keep the same structure, with only accent and copy changing",
  "Light and dark mode run off the same tokens",
];

const FADE =
  "linear-gradient(to bottom, transparent 0, black 56px, black calc(100% - 56px), transparent 100%)";

// One lap's block: the image plus a gap under it, so where one copy ends and
// the next begins reads as the gap between two blocks of the system, not a
// butt joint.
function Strip() {
  const img = (src: string) => (
    <Image
      src={src}
      alt=""
      width={1200}
      height={2042}
      sizes="(min-width: 768px) 600px, 350px"
      className="block h-auto w-full"
    />
  );
  return (
    <div className="pb-24px">
      <ThemeSwap
        light={img("/images/ultraai/ua-design-system-board.webp")}
        dark={img("/images/ultraai/ua-design-system-board-dark.webp")}
      />
    </div>
  );
}

export default function DesignSystemSlide({
  active = true,
}: {
  active?: boolean;
}) {
  return (
    <section
      id="design-system"
      className="relative flex h-full w-full flex-col overflow-y-auto overflow-x-hidden bg-bg-primary md:overflow-hidden"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:hidden" />
      <GridDepthLayer className="absolute inset-0 hidden w-full [--grid-cell:40px] md:block" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] shrink-0 flex-col gap-24px px-20px py-32px md:h-full md:flex-row md:items-center md:justify-between md:gap-0 md:px-80px md:py-0">
        <div className="contents md:flex md:w-[600px] md:shrink-0 md:flex-col md:gap-[56px]">
          <div className="flex flex-col gap-24px">
            <span className="font-mono text-[13px] text-text-accent uppercase leading-[18px] tracking-[0.78px]">
              The design system
            </span>
            <div className="flex flex-col gap-16px">
              <h2 className="font-display text-slide-title-sm text-text-primary md:text-slide-title">
                One system for all nine experts.
              </h2>
              <p className="font-ui font-normal text-[16px] text-text-muted leading-[28px] tracking-[0.08px]">
                Every expert runs on the same tokens. A new one only adds its
                own accent.
              </p>
            </div>
          </div>

          <div className="order-2 flex flex-col gap-24px md:order-none md:max-w-[500px] md:gap-40px">
            <div className="flex flex-col">
              {POINTS.map((p) => (
                <div key={p} className="flex items-start gap-16px py-16px">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="mt-2px size-16px shrink-0 -scale-y-100 text-text-success"
                  >
                    <path d={THUMB_UP} />
                  </svg>
                  <p className="font-ui font-normal text-[14px] text-text-primary leading-[20px] tracking-[0.07px]">
                    {p}
                  </p>
                </div>
              ))}
            </div>
            <p className="font-ui font-semibold text-[17px] text-text-primary leading-[28px] tracking-[0.085px]">
              AI got the system started and my judgment shaped it, so a new
              expert now costs a set of tokens, not a new UI.
            </p>
          </div>
        </div>

        {/* The window. Overflow hidden + a top/bottom fade mask; the track
            inside does the scrolling. */}
        <div
          className="relative order-1 aspect-[4/3] w-full shrink-0 overflow-hidden md:order-none md:aspect-square md:w-[600px]"
          role="img"
          aria-label="The UltraAI design system: tokens, colour primitives, brand colours, spacing and opacity, scrolling slowly"
          style={{ maskImage: FADE, WebkitMaskImage: FADE }}
        >
          <div
            className="ua-ds-track"
            style={{ animationPlayState: active ? "running" : "paused" }}
          >
            <Strip />
            <Strip />
          </div>
        </div>
      </div>
    </section>
  );
}
