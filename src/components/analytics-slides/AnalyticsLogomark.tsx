// Inlined from public/images/analytics/analytics-logomark.svg, so it can sit in
// the header pill and the hero eyebrow like the other two case studies' marks
// (FastRouterLogomark, UltraAILogomark). The file is the icon alone, with a
// fixed brand red (#CE4444) that reads on both themes and on the inverted
// header, so unlike those two there is no surface-keyed `--fill-0` to resolve.
// The name is set beside it as live text, since the mark carries none.
interface AnalyticsLogomarkProps {
  className?: string;
  /** Show the "Analytics" name beside the icon. */
  withName?: boolean;
}

export default function AnalyticsLogomark({
  className,
  withName = true,
}: AnalyticsLogomarkProps) {
  return (
    <span className={`inline-flex items-center gap-8px ${className ?? ""}`}>
      <svg
        width={28}
        height={18}
        viewBox="0 0 28 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role={withName ? undefined : "img"}
        aria-label={withName ? undefined : "Analytics"}
        aria-hidden={withName ? true : undefined}
        className="shrink-0"
      >
        <path
          d="M9.71973 0C12.0834 -1.03321e-07 14.4246 0.465596 16.6084 1.37012C18.7921 2.27467 20.7759 3.60115 22.4473 5.27246C24.1186 6.94381 25.445 8.92762 26.3496 11.1113C27.2542 13.2952 27.7197 15.6362 27.7197 18H19.3535C19.3535 16.7349 19.1042 15.4823 18.6201 14.3135C18.136 13.1446 17.4268 12.0821 16.5322 11.1875C15.6376 10.2929 14.5751 9.58375 13.4062 9.09961C12.2375 8.61554 10.9848 8.36621 9.71973 8.36621V18H0C0 16.7236 0.251759 15.4596 0.740234 14.2803C1.22868 13.1011 1.9442 12.0295 2.84668 11.127C3.74923 10.2244 4.82077 9.50801 6 9.01953C7.1792 8.53109 8.44337 8.28031 9.71973 8.28027V0Z"
          fill="#CE4444"
        />
      </svg>
      {withName && (
        <span className="font-ui font-semibold text-[14px] text-text-primary leading-[20px]">
          Analytics
        </span>
      )}
    </span>
  );
}
