import ProjectCard from "@/components/shared/ProjectCard";

// Source of truth: Figma node 6408:788 (Extensions file, per CLAUDE.md).
// "View case study →" links were hidden in Figma while the other case
// studies had no pages to point to (same as fastrouter/ReadNext.tsx). All
// three pages now exist, so these teaser cards are wired to real routes —
// only the destination changed, not any copy.
const cards = [
  {
    category: "Fastrouter",
    year: "2026",
    title: "Enterprise AI teams were flying blind on every model decision.",
    description:
      "No existing pattern, 4 weeks, one novel architecture that the industry validated 6 months later.",
    href: "/fastrouter",
  },
  {
    category: "analytics",
    year: "2024",
    title: "Data that three types of users could actually trust",
    description:
      "50+ metrics, no taxonomy, and a formula builder that broke every time a dependency was missing.",
    href: "/analytics",
  },
];

export default function ReadNext() {
  return (
    <section className="w-full py-80px flex flex-col items-center gap-32px">
      <div className="max-w-[var(--width-content)] w-full px-[var(--edge-padding)] md:px-40px">
        <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
          read next
        </span>
      </div>

      <div className="max-w-[var(--width-content)] w-full px-[var(--edge-padding)] md:px-40px flex flex-col md:flex-row gap-24px items-stretch">
        {cards.map((card) => (
          <ProjectCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}
