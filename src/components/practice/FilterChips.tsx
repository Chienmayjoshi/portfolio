"use client";

// Not sourced from Figma — /practice has no Figma frames (see posts.ts).
// Optional secondary filter for the feed — an opt-in narrow, not primary
// nav (spec). Pure client state, no URL sync, no reflow animation: the
// CSS-columns masonry re-lays-out instantly on filter change, and FLIP
// animation across column reflow is explicitly out of scope.
//
// PracticeFeed only renders this row when the feed actually contains both
// post types — with build posts alone (current phase-1 content) a filter
// would offer an empty "Art" view, so the row stays hidden until art
// posts land.
export type PracticeFilter = "all" | "art" | "build";

const options: { value: PracticeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "art", label: "Art" },
  { value: "build", label: "Builds" },
];

interface FilterChipsProps {
  value: PracticeFilter;
  onChange: (value: PracticeFilter) => void;
}

export default function FilterChips({ value, onChange }: FilterChipsProps) {
  return (
    <div className="flex gap-8px items-center">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-full border px-16px py-6px font-ui font-medium text-[13px] uppercase tracking-[0.78px] transition-colors ${
            value === option.value
              ? "border-border-frame text-text-primary"
              : "border-border-default text-text-muted hover:text-text-primary"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
