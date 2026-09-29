import type { MetadataRoute } from "next";

// First robots.ts in the project. Added with the gated /deck/* share links —
// those carry `robots: { index: false, follow: false }` in their own layout
// too, but a crawler that fetches /robots.txt and never fetches the page can
// only see this one.
//
// /lab/* is listed for the same reason its layout already opts out: it's a
// page of tuning sliders, not portfolio content.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/deck/", "/lab/"],
    },
  };
}
