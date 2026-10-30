"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import SplashIntro from "@/components/shared/SplashIntro";
import { markSplashSeen } from "@/components/shared/splashSession";

// Mounts the splash on the very first load of "/" and never again: not on a
// reload (session flag), and not when the visitor's first page was somewhere
// else and they click through to home later (initial path is captured once).
// Lives in the root layout, so it persists across client navigations - hence
// the captured path rather than reading pathname on every render.
export default function SplashGate() {
  const pathname = usePathname();
  const [initialPath] = useState(pathname);
  const [done, setDone] = useState(false);

  if (initialPath !== "/" || done) return null;

  return (
    <SplashIntro
      oncePerSession
      onFinish={() => {
        markSplashSeen();
        setDone(true);
      }}
    />
  );
}
