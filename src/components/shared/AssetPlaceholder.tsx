// Shared across Analytics/Extensions (2026-07-18) — Analytics and
// Extensions don't have real assets yet (in progress, in parallel per
// direct instruction), so every screenshot/video/illustration slot in both
// case studies needs a stand-in. Generalizes the exact placeholder
// treatment fastrouter/CockpitPlaceholder.tsx already established for a
// single instance (bracketed italic text, text-muted, centered, on a
// bg-light field) into a reusable component, since both new pages need
// this in far more slots (decision assets, feature hero images, card
// thumbnails) than FastRouter ever did.
//
// Designed to sit inside components that already define the box shape —
// DecisionAssetFrame (aspect-[720/460]) or ScreenshotFrame (aspectRatio
// prop) — so this defaults to filling its parent rather than setting its
// own aspect ratio. `aspectClassName` is only for the rare case where this
// is used bare, without an outer frame.
interface AssetPlaceholderProps {
  label: string;
  aspectClassName?: string;
  className?: string;
}

export default function AssetPlaceholder({
  label,
  aspectClassName,
  className,
}: AssetPlaceholderProps) {
  return (
    <div
      className={`flex size-full items-center justify-center bg-bg-light px-24px text-center ${aspectClassName ?? ""} ${className ?? ""}`}
    >
      <p
        className="font-ui font-normal italic text-text-muted text-[14px] leading-[21px]"
        style={{ fontVariationSettings: '"opsz" 14' }}
      >
        {label}
      </p>
    </div>
  );
}
