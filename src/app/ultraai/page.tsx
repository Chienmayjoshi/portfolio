import SlidesDeck from "@/components/ultraai/SlidesDeck";

// UltraAI's case study — slide-deck format from the start (no vertical
// sticky-side-rail version exists or is planned, per CLAUDE.md's build-mode
// rule for every case study after FastRouter). Currently one slide (Hero);
// see SlidesDeck.tsx for why the full multi-slide deck mechanics aren't
// ported in yet.
export default function UltraAIPage() {
  return <SlidesDeck />;
}
