import type { Metadata } from "next";
import PracticeFeed from "@/components/practice/PracticeFeed";
import Footer from "@/components/practice/Footer";
import { practicePosts } from "@/components/practice/posts";

// Not sourced from Figma — /practice has no Figma frames (see
// components/practice/posts.ts for the provenance note that covers the
// whole section). A mixed feed of art posts and vibe-coded build
// posts, deliberately separate from the three case studies: no
// SectionRail (nothing to jump between in a feed), no cross-links from
// the case study pages, quieter register.
//
// pt-80px matches the case-study pages' top rhythm (Hero sections all
// open with pt-80px); the feed's own internal spacing lives in
// PracticeFeed. Footer is the practice/ folder's own copy, per the
// per-case-study footer convention.
export const metadata: Metadata = {
  title: "Practice — Chinmay Joshi",
  description:
    "Creative work and vibe-coded side projects by Chinmay Joshi.",
};

export default function PracticePage() {
  return (
    <>
      <main className="flex flex-col w-full pt-80px pb-80px">
        <PracticeFeed posts={practicePosts} />
      </main>
      <Footer />
    </>
  );
}
