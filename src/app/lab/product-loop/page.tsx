import ProductLoopSlide from "@/components/fastrouter-slides/ProductLoopSlide";

// Experiment: the Product slide with a looping request through the frame. Not
// wired into the deck yet; merge into ProductSlide once signed off.
export default function ProductLoopLab() {
  return (
    <div className="h-dvh w-full">
      <ProductLoopSlide />
    </div>
  );
}
