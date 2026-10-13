import DirectionSlide, {
  CardBottomBar,
  CardImage,
  LAYER,
  type DirectionPoint,
} from "@/components/ultraai/DirectionSlide";

// "Rejected direction" slide for The Shell chapter — Figma desktop section
// 7975:291951 (three states: 7975:287900 / 7975:290333 / 7975:291142) and
// mobile frame 7686:141349, file 2aoIFdaJMyNBEWeQESBEzG. Follows the Shell
// intro and shares its rail tick ("shell"). Behaviour, layout and the reasons
// for them live in DirectionSlide.tsx; this file is the slide's content.
//
// Highlight positions (desktop, in the 628x620 phones column; both phones
// 286 wide, 56 apart): 1 bottom nav (-17, 564), 2 top tab bar (-17, 84), 3
// second tab row on the right phone (325, 133); each 320x64. Mobile boxes are
// 366x64 centred on the 350 column, tops read from the frame (block coords:
// card-relative top + 36 for the title).
//
// FIGMA CONFLICTS (flagged, not silently picked):
// - Copy differs between the frames: the desktop descriptions are shorter
//   than mobile's for all three points. Each breakpoint uses its own frame's
//   text, as both are canonical for their layout.
// - Mobile point 1 reads "orchastration" in Figma; set here as
//   "orchestration" — a typo fix, say if it should stay verbatim.
// - Mobile description colour is a one-off #1E2B14 in Figma; set as
//   text-primary like desktop.
// - The progress fill is bound to bg-primary (fallback #1A1A1A) in Figma,
//   which is the page colour in light mode and would vanish on the track;
//   drawn in text-primary, i.e. the dark ink in the frame.
// - Progress duration isn't specified in Figma; DirectionSlide's default is a
//   choice.
//
// Assets: ua-shell-rejected-top-tabs.webp (Figma "returning user 1") and
// ua-shell-rejected-second-row.webp ("returning user 2"), converted from the
// provided 1170x2532 PNGs at q90. Light-mode product screenshots, reused
// as-is in dark mode like the Problem slide's.

const TOP_TABS = "/images/ultraai/ua-shell-rejected-top-tabs.webp";
const SECOND_ROW = "/images/ultraai/ua-shell-rejected-second-row.webp";

const POINTS: readonly DirectionPoint[] = [
  {
    title: "Just Another Peer",
    desktop:
      "Tapping Experts always opens For You, even inside an expert. For You looks like one more tab, not the hub.",
    mobile:
      "Tapping Experts always opens For You, and stays lit no matter which expert you're in. For You still reads as just another peer, not the orchestration layer it actually is.",
    box: { x: -17, y: 564, w: 320, h: 64 },
    phones: [TOP_TABS, SECOND_ROW],
    mobileBox: { top: 376, height: 64 },
    mobileCard: (
      <>
        <CardImage src={TOP_TABS} />
        <CardBottomBar src={TOP_TABS} />
        <div
          className={`${LAYER} top-[-2px] h-[343px] bg-bg-primary/50 backdrop-blur-[2px]`}
        />
      </>
    ),
  },
  {
    title: "No Cap, No Priority",
    desktop:
      "Every new expert adds another tab. The bar has no limit and no way to rank experts.",
    mobile:
      "Every new expert adds another permanent tab to that top bar, which has no cap and no way to prioritize which experts matter most.",
    box: { x: -17, y: 84, w: 320, h: 64 },
    phones: [TOP_TABS, SECOND_ROW],
    mobileBox: { top: 146, height: 64 },
    mobileCard: (
      <>
        <CardImage src={TOP_TABS} />
        <div
          className={`${LAYER} bottom-[-2px] h-[227px] bg-bg-primary/50 backdrop-blur-[2px]`}
        />
        <div
          className={`${LAYER} bottom-[286px] h-[112px] bg-gradient-to-b from-bg-primary/50 to-bg-primary/0 backdrop-blur-[2px]`}
        />
      </>
    ),
  },
  {
    title: "Nothing Reusable",
    desktop:
      "Each expert got its own second row of tabs, like Veda’s Today, Explore, Learning. Nine experts meant nine sets to maintain.",
    mobile:
      "Each expert got its own second row of tabs, like Veda's Today, Explore, Learning. None of it was reusable, nine experts meant nine separate sets to build and maintain.",
    box: { x: 325, y: 133, w: 320, h: 64 },
    phones: [TOP_TABS, SECOND_ROW],
    mobileBox: { top: 204, height: 64 },
    mobileCard: (
      <>
        <CardImage src={SECOND_ROW} />
        <div
          className={`${LAYER} bottom-[-2px] h-[56px] bg-gradient-to-t from-bg-primary from-[5.6%] via-bg-primary/80 via-[52.8%] to-bg-primary/0`}
        />
        <div
          className={`${LAYER} bottom-[-2px] h-[168px] bg-gradient-to-b from-bg-primary/0 to-bg-primary/50 backdrop-blur-[2px]`}
        />
        <div
          className={`${LAYER} top-[-2px] h-[113px] bg-gradient-to-b from-bg-primary/50 to-bg-primary/0 backdrop-blur-[2px]`}
        />
      </>
    ),
  },
];

export default function RejectedDirectionSlide({
  active = true,
}: {
  active?: boolean;
}) {
  return (
    <DirectionSlide
      id="shell-rejected"
      tone="error"
      eyebrow="Rejected direction"
      headline="One Nav for Every Expert"
      body="Every expert lived in a horizontal top tab bar beside For You, all treated as equal peers, with a fixed bottom nav below it."
      points={POINTS}
      active={active}
    />
  );
}
