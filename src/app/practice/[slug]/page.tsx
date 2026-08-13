import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BuildDetail from "@/components/practice/BuildDetail";
import Footer from "@/components/practice/Footer";
import { buildPosts, getBuildPost } from "@/components/practice/posts";

// Not sourced from Figma — /practice has no Figma frames (see
// components/practice/posts.ts). First dynamic route in the repo: one
// Lighter Format detail page per vibe-coded build post, statically
// generated from the posts array (real routes, not modals, per spec).
// Unknown slugs 404 via notFound().
//
// Next 16: `params` is a Promise in page/generateMetadata props — must
// be awaited before use.
interface BuildPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return buildPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BuildPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBuildPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Practice — Chinmay Joshi`,
    description: post.pitch,
  };
}

export default async function BuildPage({ params }: BuildPageProps) {
  const { slug } = await params;
  const post = getBuildPost(slug);
  if (!post) notFound();

  return (
    <>
      <main className="flex flex-col w-full">
        <BuildDetail post={post} />
      </main>
      <Footer />
    </>
  );
}
