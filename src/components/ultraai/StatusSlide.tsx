import Image from "next/image";
import GridDepthLayer from "@/components/shared/GridDepthLayer";
import ThemeSwap from "@/components/shared/ThemeSwap";

// "Where things stand" — the UltraAI closing beat, Figma desktop node
// 7955:282271 ("where things stand - scroll 10"), file 2aoIFdaJMyNBEWeQESBEzG.
// CLAUDE.md: the beat is Status, not Impact — no live metrics exist, so there
// are none here. Every figure on the slide ("nine", "2 experts", "1 shared
// template") is Figma copy, not a measurement. Rail tick: "status".
//
// Left: accent eyebrow, headline (deck slide-title token, 48px / 32 mobile —
// Figma's frame is 48 too), muted paragraph; then two list groups. The first
// has thumbs-up (text-success) rows, a hairline divider, then the second has
// arrow (text-accent) rows. Right: two 254x550 phones, 40 apart, 132 from the
// column, in the shared 4px token frames — the product's home with all nine
// experts (Veda live, the other eight marked Soon) beside the "Coming soon"
// sheet. Figma draws the left screenshot 612 tall in the 550 frame (a ~11%
// scale-up that crops the sides); that clipped the app's left edge in the
// build, so both shots fill their frame at the export's own ratio instead.
//
// No mobile frame was drawn: header, then the phones at full width, then the
// list (the order the decision slides use).
//
// FIGMA NOTES (normalised, flagged): the first row's title-to-description gap
// is 16 and the other rows' is 8 — set to 8 throughout as a likely slip. The
// first description has no full stop in Figma ("…see the whole product");
// kept verbatim.
//
// Assets: ua-status-{grid,soon}[-dark].webp from ua_whereitstands1/2, light and
// dark, 1170x2532 at 762px wide (3x), q88.

const THUMB_UP =
  "M22.4831 14.7188L21.3581 5.71875C21.2896 5.17489 21.0249 4.67475 20.6137 4.31224C20.2025 3.94974 19.6732 3.74981 19.125 3.75H3C2.60218 3.75 2.22064 3.90804 1.93934 4.18934C1.65804 4.47064 1.5 4.85218 1.5 5.25V13.5C1.5 13.8978 1.65804 14.2794 1.93934 14.5607C2.22064 14.842 2.60218 15 3 15H7.03687L10.5787 22.0856C10.6411 22.2102 10.7369 22.315 10.8555 22.3882C10.9741 22.4614 11.1107 22.5001 11.25 22.5C12.2446 22.5 13.1984 22.1049 13.9017 21.4017C14.6049 20.6984 15 19.7446 15 18.75V17.25H20.25C20.5693 17.2501 20.8849 17.1823 21.176 17.051C21.467 16.9197 21.7268 16.728 21.938 16.4885C22.1492 16.2491 22.3071 15.9675 22.4011 15.6623C22.4951 15.3572 22.523 15.0355 22.4831 14.7188ZM6.75 13.5H3V5.25H6.75V13.5Z";
const ARROW = "M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z";

function Row({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-16px">
      <span className="flex h-[20px] w-16px shrink-0 items-center">{icon}</span>
      <div className="flex min-w-0 flex-1 flex-col gap-8px text-[14px] leading-[20px]">
        <p className="font-ui font-semibold text-text-primary">{title}</p>
        <p className="font-ui font-normal text-text-muted tracking-[0.07px]">
          {body}
        </p>
      </div>
    </div>
  );
}

const frame =
  "relative h-full w-[46.35%] overflow-hidden rounded-[10px] border-4 border-bg-surface bg-bg-primary shadow-[0_0_2.5px_color-mix(in_srgb,var(--color-text-primary)_10%,transparent),0_0_0.5px_color-mix(in_srgb,var(--color-text-primary)_10%,transparent)] md:rounded-2xl dark:border-text-muted dark:shadow-none";

function Shot({ name, alt }: { name: string; alt: string }) {
  const img = (src: string) => (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 768px) 254px, 160px"
      className="object-cover"
    />
  );
  return (
    <div className={frame}>
      {/* Both shots fill their frame at the export's own ratio — nothing
          is scaled past the frame, so the full width shows. */}
      <div className="absolute inset-0">
        <ThemeSwap
          light={img(`/images/ultraai/ua-status-${name}.webp`)}
          dark={img(`/images/ultraai/ua-status-${name}-dark.webp`)}
        />
      </div>
    </div>
  );
}

export default function StatusSlide() {
  const up = (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-16px -scale-y-100 text-text-success"
    >
      <path d={THUMB_UP} />
    </svg>
  );
  const arrow = (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-16px text-text-accent"
    >
      <path d={ARROW} />
    </svg>
  );

  return (
    <section
      id="status"
      className="relative flex h-full w-full flex-col overflow-y-auto overflow-x-hidden bg-bg-primary md:overflow-hidden"
    >
      <GridDepthLayer className="absolute inset-x-0 top-32px h-[200px] w-full md:hidden" />
      <GridDepthLayer className="absolute inset-0 hidden w-full [--grid-cell:40px] md:block" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] shrink-0 flex-col gap-24px px-20px py-32px md:h-full md:flex-row md:items-center md:justify-between md:gap-0 md:px-80px md:py-0">
        <div className="contents md:flex md:w-[600px] md:shrink-0 md:flex-col md:gap-[40px]">
          <div className="flex flex-col gap-24px">
            <span className="font-mono text-[13px] text-text-accent uppercase leading-[18px] tracking-[0.78px]">
              Where things stand
            </span>
            <div className="flex flex-col gap-16px">
              <h2 className="font-display text-slide-title-sm text-text-primary md:text-slide-title">
                All experts visible, launched one at a time
              </h2>
              <p className="font-ui font-normal text-[16px] text-text-muted leading-[28px] tracking-[0.08px]">
                The full product shows from day one, and each expert goes live
                only when it’s ready.
              </p>
            </div>
          </div>

          <div className="order-2 flex flex-col gap-16px md:order-none">
            <div className="flex flex-col gap-16px">
              <Row
                icon={up}
                title="Show all nine from day one"
                body="Veda is live and fully usable. The other eight are marked Soon, so early users see the whole product"
              />
              <Row
                icon={up}
                title="One launch at a time"
                body="Veda went first and Flex second. Each expert goes live only when its own flow is finished."
              />
            </div>
            <div className="border-border-default border-t" />
            <div className="flex flex-col gap-16px py-12px">
              <Row
                icon={arrow}
                title="Solo"
                body="No PM. I made every product and design decision."
              />
              <Row
                icon={arrow}
                title="2 experts designed"
                body="Veda and Flex are done. The rest follow the same system."
              />
              <Row
                icon={arrow}
                title="1 shared template"
                body="Every expert follows one template for onboarding and paywall."
              />
            </div>
          </div>
        </div>

        <div className="order-1 flex aspect-[548/550] w-full items-stretch justify-between md:order-none md:w-[548px]">
          <Shot
            name="grid"
            alt="UltraAI home with all nine experts: Veda live, the other eight marked Soon"
          />
          <Shot
            name="soon"
            alt="Coming soon sheet: Something New is Brewing, with a Notify me when it's live button"
          />
        </div>
      </div>
    </section>
  );
}
