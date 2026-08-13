import AssetPlaceholder from "@/components/shared/AssetPlaceholder";

// Source of truth: Figma node 6408:473 (Extensions file, per CLAUDE.md).
//
// FLAGGED: this section's intro paragraph is word-for-word identical to
// Impact.tsx's own intro paragraph (see that file) — two sections doing
// the same job in the source Figma file. Built verbatim per direct
// instruction rather than differentiated or de-duplicated.
//
// New 5-card grid — no direct FastRouter precedent for this count/shape,
// so it reuses fastrouter/ReadNext.tsx's existing card visual
// (bg-bg-surface border-bg-light rounded-xl p-32px) rather than inventing
// a new card style, arranged in a grid that naturally wraps 5 items. No
// per-card asset node existed in the Figma metadata (card thumbnails are
// likely background fills not exposed there) — each card gets a small
// AssetPlaceholder thumbnail slot per direct instruction to placeholder
// every not-yet-created inline asset.
const cards = [
  {
    title: "Game Universe",
    category: "Gaming platform",
    description:
      "Open-source games rethemed to match the extension's visual identity using AI. Visual heaviness as a design requirement.",
  },
  {
    title: "Package Tracker",
    category: "Shipment tracking",
    description:
      "Multi-shipment dashboard tracking up to 50 parcels. Status, carrier, ETA at a glance across a dense list.",
  },
  {
    title: "Utility",
    category: "Widget dashboard",
    description:
      "Six widget types in a constrained viewport. Inter-widget connections: a note becomes an email, a to-do schedules to calendar.",
  },
  {
    title: "News",
    category: "News reader",
    description:
      "Article feed with category filters, AI summarisation, and weather + sports widgets alongside editorial content.",
  },
  {
    title: "Manual Hunt",
    category: "Product manuals",
    description:
      "Search by product, category, and brand. AI chatbot for faster troubleshooting. Search + browse in constrained viewport.",
  },
];

interface FiveMoreExtensionsProps {
  id?: string;
}

export default function FiveMoreExtensions({ id }: FiveMoreExtensionsProps) {
  return (
    <section id={id} className="w-full py-80px flex flex-col items-center">
      <div className="max-w-[var(--width-content)] mx-auto px-[var(--edge-padding)] md:px-40px flex flex-col gap-32px w-full">
        <div className="flex flex-col gap-24px items-start pb-32px border-b border-border-default w-full">
          <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
            FIVE MORE EXTENSIONS
          </span>
          <h2 className="max-w-[680px] font-display font-bold text-text-primary text-[32px] leading-[38px] tracking-[-0.32px] md:text-[48px] md:leading-[56px] md:tracking-[-0.48px]">
            Seven domains. One designer. No shared system.
          </h2>
          <p className="font-ui font-normal text-text-primary text-[16px] leading-[28px] tracking-[0.08px]">
            The project started with a single extension. It became seven
            because the quality of the first made the next ones a
            foregone conclusion. Stakeholders explicitly recognised the
            premium design and UX quality — and flagged delivery pace as a
            strength, not a trade-off.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-24px w-full">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-bg-surface border border-bg-light rounded-xl p-32px flex flex-col gap-12px"
            >
              <div className="rounded-md overflow-hidden aspect-[458/324] w-full">
                <AssetPlaceholder label={`[ Screenshot — ${card.title} ]`} />
              </div>
              <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
                {card.category}
              </span>
              <h3 className="font-ui font-semibold text-text-primary text-[20px] leading-[26px]">
                {card.title}
              </h3>
              <p className="font-ui font-normal text-text-muted text-[16px] leading-[28px] tracking-[0.08px]">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
