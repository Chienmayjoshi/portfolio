import ProjectCard from "@/components/shared/ProjectCard";

// Source of truth: Figma node 6368:54374 (FastRouter file, per CLAUDE.md).
// "View case study →" links were hidden in Figma while Analytics/Extensions
// had no pages to point to. Both now exist (src/app/analytics,
// src/app/extensions), so these teaser cards are wired to real routes —
// only the destination changed, not any copy sourced from Figma.
const cards = [
  {
    category: "analytics",
    year: "2024",
    title: "Data that three types of users could actually trust",
    description:
      "50+ metrics, no taxonomy, and a formula builder that broke every time a dependency was missing.",
    href: "/analytics",
  },
  {
    category: "Extensions",
    year: "2025",
    title: "Seven extensions designed to stay installed",
    description:
      "The previous team designed for the install. I designed for every new tab after it.",
    href: "/extensions",
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
