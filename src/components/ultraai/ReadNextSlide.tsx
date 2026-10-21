import ReadNextSlide, {
  ULTRAAI_NEXT,
} from "@/components/fastrouter-slides/ReadNextSlide";

// UltraAI's closing card: the same read-next slide FastRouter ends on,
// pointed at Analytics (its next case study, per direct instruction
// 2026-10-16). Layout, the six-second auto-advance and its guards, and the
// Figma notes all live on that component; the Analytics cover is still the
// shared placeholder until an asset exists.
export default function UltraAIReadNextSlide({
  active = false,
}: {
  active?: boolean;
}) {
  return <ReadNextSlide active={active} next={ULTRAAI_NEXT} />;
}
