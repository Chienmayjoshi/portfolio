import SlidesDeck from "@/components/ultraai/SlidesDeck";

// UltraAI's case study — slide-deck format from the start (no vertical
// sticky-side-rail version exists or is planned, per CLAUDE.md's build-mode
// rule for every case study after FastRouter). Built so far: Hero, Problem,
// The Shell intro; Product is skipped until its assets land.
export default function UltraAIPage() {
  return <SlidesDeck />;
}
