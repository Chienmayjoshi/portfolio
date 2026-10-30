import DecisionSlide, {
  type Decision,
} from "@/components/fastrouter-slides/DecisionSlide";
import ThemeAwareVideo from "@/components/shared/ThemeAwareVideo";
import GestureSeamVideo from "@/components/extensions-slides/GestureSeamVideo";

// The Extensions deck's four decisions, through FastRouter's DecisionSlide
// template (same as the Analytics deck). Copy is the Extensions Figma frame's
// (node 6408:8), tightened for skimming with the meaning kept.
//
// Figma repeats FastRouter's "Decision 05: Tabs over cards + persistent member
// strip" under both features — a copy-paste leftover with no Extensions
// meaning — so it isn't rendered. Its "Before/After slider — FR-01 vs FR-02"
// blocks are FastRouter's too, and no slider component exists, so they're
// skipped as the old page did.
//
// Decision 02's recording is portrait inside a landscape capsule, so it goes
// through GestureSeamVideo (a GSAP pan/zoom to the chevron tap) as a `custom`
// asset rather than the template's plain cover-cropped video.

const MAPS = "MAPS";
const PHOTO_EDITOR = "PHOTO EDITOR";
const IMG = "/images/extensions";

// Left-anchored, not the template's centred `object-top` crop: these recordings
// are full browser captures with the extension's own bezel at the left edge, so
// a centred cover crop clips the left side of the UI (the panel text and logo).
// The old vertical page used object-left-top for the same reason.
const videoAsset = (light: string, dark: string, alt: string): Decision["asset"] => ({
  kind: "custom",
  node: (
    <ThemeAwareVideo
      className="block size-full object-cover object-left-top"
      lightSrc={light}
      darkSrc={dark}
      aria-label={alt}
    />
  ),
});

export const MAPS_DECISIONS: readonly Decision[] = [
  {
    id: "maps-decision-01",
    number: "01",
    chapter: MAPS,
    headline: "The ATF is the product",
    highlight: "the product",
    body: "The install was the conversion. Every later new tab is a moment to justify the install, not to market it, and a user who has to scroll to find the map already has a reason to question it. So the map loads immediately, full size and fitted to the viewport.",
    chose:
      "The map loads immediately, full size and fitted to the viewport. No headline, no value proposition, no social proof above the fold.",
    gaveUp: "all the conventional landing-page space above the fold",
    why: "The install was the conversion. Every later new tab is a moment to justify the install, not to market it. A user who has to scroll to find the map already has a reason to question it.",
    asset: videoAsset(
      `${IMG}/ex-atf-is-the-extension-not-a-marketing-wrapper.mp4`,
      `${IMG}/ex-atf-is-the-extension-not-a-marketing-wrapper-dark.mp4`,
      "Maps extension opening full-viewport above the fold, immediately usable with no marketing content",
    ),
  },
  {
    id: "maps-decision-02",
    number: "02",
    chapter: MAPS,
    headline: "On mobile, tap to leave the map",
    highlight: "tap",
    body: "Chrome and Firefox policies require usability across viewport sizes, and a seam was the cleanest answer. On mobile, the full-screen map uses drag to navigate, which collides with the natural drag to scroll.\n\nSo the map owns the whole first screen. A chevron at the bottom signals page content below, and tapping it switches to a scrollable page.",
    chose:
      "The map owns the whole first screen. A chevron at the bottom signals page content below, and tapping it switches to a scrollable page.",
    gaveUp: "seamless continuous scroll from the map into the page",
    why: "A compliance requirement: Chrome and Firefox policies require usability across viewport sizes, and the seam was the cleanest answer. But desktop is where Maps actually lives, so the mobile work met the policy bar rather than solving a user problem.",
    asset: {
      kind: "custom",
      node: (
        <GestureSeamVideo
          lightSrc={`${IMG}/ex-gesture-seam-on-mobile.mp4`}
          darkSrc={`${IMG}/ex-gesture-seam-on-mobile-dark.mp4`}
          aria-label="Mobile map view with a chevron seam at the bottom; tapping it transitions to the scrollable page below"
        />
      ),
    },
  },
  {
    id: "maps-decision-03",
    number: "03",
    chapter: MAPS,
    headline: "Directions are always one glance away",
    highlight: "one glance away",
    body: "Directions, transport modes and POI filters sit permanently beside the map, with no collapse and no toggle. The panel is the main interaction surface, not a settings drawer.",
    chose:
      "Directions, transport modes and POI filters sit permanently beside the map. No collapse, no toggle.",
    gaveUp:
      "map surface area, since the always-visible panel permanently takes some of the map",
    why: "The panel is the main interaction surface, not a settings drawer. Sessions are short and frequent, and a collapsible panel adds a discovery cost to every one. For a daily-use product, that cost compounds.",
    asset: videoAsset(
      `${IMG}/ex-left-panel-always-visible.mp4`,
      `${IMG}/ex-left-panel-always-visible-dark.mp4`,
      "Maps with the directions, transport and POI panel permanently visible beside the map",
    ),
  },
];

export const PHOTO_EDITOR_DECISIONS: readonly Decision[] = [
  {
    id: "photo-editor-decision-01",
    number: "01",
    chapter: PHOTO_EDITOR,
    headline: "Traditional and AI tools, separated everywhere",
    highlight: "separated everywhere",
    body: "Two entry points on the landing page, Edit My Photo and Create With AI. A two-column nav dropdown, Editing Tools and AI Tools. A left panel that leads with AI Tools and a Trending tab. The same two-way split everywhere means the architecture teaches itself.",
    chose:
      "Two entry points on the landing page (Edit My Photo, Create With AI). A two-column nav dropdown (Editing Tools, AI Tools). A left panel that leads with AI Tools and a Trending tab.",
    gaveUp: "one unified tool panel: every tool in a single list, sorted by category",
    why: "Corrective editing starts with a known problem. Generative editing starts with an intention. Using the same two-way split across landing, nav and panel means the architecture teaches itself.",
    asset: videoAsset(
      `${IMG}/ex-separated-traditional-and-ai-tools-at-every-touchpoint.mp4`,
      `${IMG}/ex-separated-traditional-and-ai-tools-at-every-touchpoint-dark.mp4`,
      "Photo editor with separate entry points, nav columns and panel sections for traditional and AI tools",
    ),
  },
];

export const MapsDecision01 = ({ active }: { active?: boolean }) => (
  <DecisionSlide decision={MAPS_DECISIONS[0]} active={active} />
);
export const MapsDecision02 = ({ active }: { active?: boolean }) => (
  <DecisionSlide decision={MAPS_DECISIONS[1]} active={active} />
);
export const MapsDecision03 = ({ active }: { active?: boolean }) => (
  <DecisionSlide decision={MAPS_DECISIONS[2]} active={active} />
);
export const PhotoEditorDecision01 = ({ active }: { active?: boolean }) => (
  <DecisionSlide decision={PHOTO_EDITOR_DECISIONS[0]} active={active} />
);
