import SlidesDeck from "@/components/fastrouter-slides/SlidesDeck";

// The public FastRouter deck. The deck itself moved to SlidesDeck.tsx when the
// gated share link (/deck/fastrouter) was added — two routes, one deck, one
// `variant` prop deciding which slides and which chrome. This route is
// unchanged for the reader: all 24 slides, ending on the read-next card.
export default function FastRouterSlidesPage() {
  return <SlidesDeck variant="full" />;
}
