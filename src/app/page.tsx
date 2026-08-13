import Link from "next/link";
import ProjectCard, {
  type ProjectCardData,
} from "@/components/shared/ProjectCard";

// TEMPORARY project index — not sourced from Figma (per CLAUDE.md, nothing
// in the connected Figma files positions a root/index page; only the three
// case studies exist there). Placeholder so `backHref="/"` on every case
// study's SectionRail lands somewhere real instead of the create-next-app
// scaffold. Reuses ProjectCard (src/components/shared/ProjectCard.tsx),
// the same card each case study's ReadNext.tsx renders, in a 3-up grid —
// per direct request to reuse that component rather than building a
// second card style.
//
// Copy below isn't invented: title/description text for each card is
// copied verbatim from wherever it already appears identically across at
// least two of the three ReadNext.tsx files (cross-referenced, not
// authored fresh). One exception worth flagging: FastRouter's own year is
// inconsistent between sources — analytics/ReadNext.tsx says "2024",
// extensions/ReadNext.tsx says "2026". Went with 2026 here since it
// matches MetaBar.tsx's "4 Weeks 2025-26" timeline and Footer's "© 2026";
// worth reconciling analytics/ReadNext.tsx to match once someone can
// confirm which is right.
const projects: ProjectCardData[] = [
  {
    category: "FastRouter",
    year: "2026",
    title: "Enterprise AI teams were flying blind on every model decision.",
    description:
      "No existing pattern, 4 weeks, one novel architecture that the industry validated 6 months later.",
    href: "/fastrouter",
  },
  {
    category: "Analytics",
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

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center w-full">
      <main className="w-full max-w-[var(--width-content)] px-[var(--edge-padding)] md:px-40px py-80px flex flex-col gap-48px">
        <div className="flex flex-col gap-12px">
          <span className="font-ui font-medium text-text-muted text-[13px] uppercase tracking-[0.78px]">
            selected work
          </span>
          <h1 className="font-display font-bold text-text-primary text-[36px] leading-[42px] tracking-[-0.5px] md:text-[52px] md:leading-[58px] md:tracking-[-0.8px]">
            Chinmay Joshi
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-24px items-stretch">
          {projects.map((project) => (
            <ProjectCard key={project.href} {...project} />
          ))}
        </div>

        {/* Quiet pointer to /practice (per the approved practice-page
            plan) — deliberately one muted line after the case study
            grid, not a fourth card: side-project content stays visually
            subordinate to the three case studies. */}
        <Link
          href="/practice"
          className="self-start font-ui font-normal text-[14px] leading-[20px] text-text-muted hover:text-text-primary transition-colors"
        >
          Also building →
        </Link>
      </main>
    </div>
  );
}
