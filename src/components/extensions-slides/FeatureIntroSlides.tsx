import FeatureIntroSlide from "@/components/shared/FeatureIntroSlide";

// Extensions' two feature openers (Maps, Photo editor). Layout lives in
// shared/FeatureIntroSlide.tsx; copy is the Extensions Figma frame's (node
// 6408:8), with the "Problem:" prefixes dropped and long paragraphs split.

export const MapsIntro = () => (
  <FeatureIntroSlide
    id="maps"
    number="01"
    name="Maps"
    headline="Navigation-grade UX. Inside a browser tab."
    points={[
      "How do you make a map feel useful the instant it opens, full size and with no friction, on every single new tab?",
    ]}
  />
);

export const PhotoEditorIntro = () => (
  <FeatureIntroSlide
    id="photo-editor"
    number="02"
    name="Photo editor"
    headline="Two completely different tools. One panel. No way to tell them apart."
    points={[
      "Traditional editing starts with a known problem. AI editing starts with an intention. Put in one list, they force users to parse everything before they can start anything.",
      "Photo editors are built for big canvases, floating palettes and multi-panel layouts. An extension gets a fixed viewport, and users decide in the first few seconds whether it's worth using.",
    ]}
  />
);
