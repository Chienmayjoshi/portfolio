import Image from "next/image";
import ThemeSwap from "@/components/shared/ThemeSwap";

// Light/dark pair provided directly (public/images/ultraai/ua-logo.svg +
// ua-logo-dark.svg) — flat single-color marks, unlike FastRouterLogomark's
// inline currentColor/CSS-var approach, so a plain ThemeSwap pair is enough:
// no chapter-intro-invert surface exists for UltraAI yet, just the two
// global-theme states.
interface UltraAILogomarkProps {
  className?: string;
}

export default function UltraAILogomark({ className }: UltraAILogomarkProps) {
  return (
    <ThemeSwap
      light={
        <Image
          src="/images/ultraai/ua-logo.svg"
          alt="UltraAI"
          width={72}
          height={16}
          className={className}
          priority
        />
      }
      dark={
        <Image
          src="/images/ultraai/ua-logo-dark.svg"
          alt="UltraAI"
          width={72}
          height={16}
          className={className}
          priority
        />
      }
    />
  );
}
