"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { accentForPath } from "@/components/shared/caseStudyAccent";

// Keeps <html data-accent> in step with the route on client-side navigation
// (the initial value is set before paint by ACCENT_INIT_SCRIPT). Renders nothing.
export default function AccentScope() {
  const pathname = usePathname();
  useLayoutEffect(() => {
    const accent = accentForPath(pathname);
    const root = document.documentElement;
    if (accent) root.setAttribute("data-accent", accent);
    else root.removeAttribute("data-accent");
  }, [pathname]);
  return null;
}
