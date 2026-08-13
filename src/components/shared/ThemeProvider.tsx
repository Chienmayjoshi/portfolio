"use client";

import { createContext, useContext, useEffect, useState } from "react";

// First shared theme context in the app (2026-07-14) — previously only
// ThemeToggle.tsx tracked dark/light as isolated local state, fine when
// it was the only consumer. Now ThemeAwareVideo.tsx also needs to know
// the active theme (to pick which <video> src to render), so a shared
// source of truth is actually justified rather than speculative.
//
// Initializes by reading document.documentElement's class, same as
// ThemeToggle.tsx always did — the FOUC-avoiding blocking script in
// layout.tsx (next/script "beforeInteractive") already sets that class
// before hydration, this just reads what it decided rather than
// re-deciding anything.
interface ThemeContextValue {
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
