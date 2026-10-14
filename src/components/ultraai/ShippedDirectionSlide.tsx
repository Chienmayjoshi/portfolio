import DirectionSlide, {
  CardBottomBar,
  CardImage,
  LAYER,
  type DirectionPoint,
} from "@/components/ultraai/DirectionSlide";

// "Shipped direction" slide for The Shell chapter — Figma desktop section
// 7982:295575 (three states: 7982:292753 / 7982:293554 / 7982:294410), file
// 2aoIFdaJMyNBEWeQESBEzG. The counterpart of RejectedDirectionSlide and built
// on the same DirectionSlide: same loop, same click-to-select, same fading
// highlight, green accent (text-success) and thumbs-up instead of red/down.
//
// Highlights (desktop, in the 628x620 phones column): 1 the unified app's
// Home in the left phone's bottom nav (-17, 534, 127x103); 2 the expert app's
// top bar on the right phone (325, 89, 320x84); 3 the right phone swaps to
// the standalone screen and the box lands on its bottom nav (325, 549,
// 320x84, hanging 13px below the frame as in Figma).
//
// NO MOBILE FRAME EXISTS for this slide in Figma, so mobile follows the
// rejected slide's pattern as instructed: three stacked blocks, desktop copy,
// the same blur-the-rest cards. Mobile highlight positions are the desktop
// boxes carried onto the 350px card (scale 350/286 on the 1170x2532
// screenshot): the Home item and top bar by that scale, the third point on the
// sharp bottom-nav crop like the rejected slide's first block. Flag if a
// mobile frame is drawn later — these are derived, not read.
//
// Assets: ua-shell-shipped-{home,expert,standalone}[-dark].webp from the
// provided 1170x2532 PNGs at q90 — the unified app's home, an expert's home
// (Veda) with its top bar, and the same expert screen scrolled with the top
// bar gone. Both themes were supplied, so unlike the rejected slide's
// light-only shots these follow the portfolio theme.
//
// FIGMA NOTES: the progress fill is bound to bg-primary in Figma (invisible on
// the track in light mode); drawn in text-primary. Progress duration isn't
// specified; DirectionSlide's default is a choice.

// Sharp bottom-nav crop on mobile: tall enough for the nav pill WITH its icons
// and labels (57px clipped the top of them), with the blur ending where it
// starts so nothing overlays it.
const BAR_H = 80;

const HOME = {
  light: "/images/ultraai/ua-shell-shipped-home.webp",
  dark: "/images/ultraai/ua-shell-shipped-home-dark.webp",
};
const EXPERT = {
  light: "/images/ultraai/ua-shell-shipped-expert.webp",
  dark: "/images/ultraai/ua-shell-shipped-expert-dark.webp",
};
const STANDALONE = {
  light: "/images/ultraai/ua-shell-shipped-standalone.webp",
  dark: "/images/ultraai/ua-shell-shipped-standalone-dark.webp",
};

const POINTS: readonly DirectionPoint[] = [
  {
    title: "One Job Split in Two",
    desktop:
      "For You is no longer a tab. It’s what Home means in the bottom nav for the unified app, an orchestration layer that routes to every expert, not one option sitting alongside them.",
    mobile:
      "For You is no longer a tab. It’s what Home means in the bottom nav for the unified app, an orchestration layer that routes to every expert, not one option sitting alongside them.",
    box: { x: -17, y: 534, w: 127, h: 103 },
    // null = keep the right phone as is: coming round from point 3 it stays on
    // the standalone screen and only changes back on point 2.
    phones: [HOME, null],
    mobileBox: { top: 348, height: 96, left: -8, width: 156 },
    mobileCard: (
      <>
        <CardImage src={HOME} />
        <div
          className={`${LAYER} top-[-4px] h-[320px] bg-bg-primary/50 backdrop-blur-[2px]`}
        />
        <CardBottomBar src={HOME} height={BAR_H} />
      </>
    ),
  },
  {
    title: "Pin Four, Explore the Rest",
    desktop:
      "The top bar now holds up to four pinned experts, chosen by the user. Every other expert lives one tap away in Explore All.",
    mobile:
      "The top bar now holds up to four pinned experts, chosen by the user. Every other expert lives one tap away in Explore All.",
    box: { x: 325, y: 89, w: 320, h: 84 },
    phones: [HOME, EXPERT],
    mobileBox: { top: 145, height: 103 },
    mobileCard: (
      <>
        <CardImage src={EXPERT} />
        <div
          className={`${LAYER} bottom-[-4px] h-[190px] bg-bg-primary/50 backdrop-blur-[2px]`}
        />
        <div
          className={`${LAYER} top-[-4px] h-[107px] bg-gradient-to-b from-bg-primary/50 to-bg-primary/0 backdrop-blur-[2px]`}
        />
      </>
    ),
  },
  {
    title: "No Switching, No Top Bar",
    desktop:
      "A standalone app has nothing to switch between, so there's no top bar. The bottom nav alone carries Home, Signature, Explore, Chat.",
    mobile:
      "A standalone app has nothing to switch between, so there's no top bar. The bottom nav alone carries Home, Signature, Explore, Chat.",
    box: { x: 325, y: 549, w: 320, h: 84 },
    phones: [HOME, STANDALONE],
    mobileBox: { top: 348, height: 96 },
    mobileCard: (
      <>
        {/* No blur on this one: the point is that there is NO top bar, so the
            screen has to be seen sharp from its first row. */}
        <CardImage src={STANDALONE} />
        <CardBottomBar src={STANDALONE} height={BAR_H} />
      </>
    ),
  },
];

export default function ShippedDirectionSlide({
  active = true,
}: {
  active?: boolean;
}) {
  return (
    <DirectionSlide
      id="shell-shipped"
      tone="success"
      eyebrow="Shipped direction"
      headline="One Nav, Three Contexts"
      body="The top bar switches between experts, pin up to four, rest in Explore All. The bottom nav adapts: Home, Tools, Chats in the unified app, Home, Signature, Explore, Chat inside an expert."
      points={POINTS}
      active={active}
    />
  );
}
