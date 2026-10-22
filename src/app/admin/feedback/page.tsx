import { adminConfigured, isAuthed } from "@/app/admin/auth";
import { getAggregate, listResponses } from "@/app/api/feedback/data";
import { login, logout, deleteResponse } from "@/app/admin/feedback/actions";
import {
  caseStudySlugs,
  feedbackQuestions,
  type CaseStudySlug,
} from "@/components/shared/feedbackQuestions";

// The feedback inbox: every stepper response across the four case studies,
// newest first, with the per-case aggregates the readers see. Not from Figma —
// an internal page, so it stays plain: tokens, no illustration.
//
// Gate: `ADMIN_TOKEN` env var, sent through a form and kept as an httpOnly
// cookie (auth.ts); the token is never in a URL. Reads the same store the
// stepper writes (Upstash in production, in-memory under `next dev`).
export const dynamic = "force-dynamic";

const LABELS: Record<CaseStudySlug, string> = {
  fastrouter: "FastRouter",
  analytics: "Analytics",
  extensions: "Extensions",
  ultraai: "UltraAI",
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const shell =
  "mx-auto flex w-full max-w-[1100px] flex-col gap-32px px-20px pt-[120px] pb-[80px] md:px-80px";

const field =
  "rounded-md border border-border-default bg-bg-primary px-12px py-8px font-ui text-[14px] text-text-primary outline-none focus:border-text-accent";

const button =
  "rounded-md border border-text-accent px-16px py-8px font-ui font-semibold text-[14px] text-text-accent hover:bg-text-accent hover:text-white transition-colors";

export default async function AdminFeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; slug?: string; q3?: string }>;
}) {
  const params = await searchParams;

  if (!(await isAuthed())) {
    return (
      <main className={shell}>
        <h1 className="font-display text-[32px] text-text-primary">Feedback inbox</h1>
        {!adminConfigured() ? (
          <p className="font-ui text-[16px] text-text-muted">
            Set the ADMIN_TOKEN environment variable to open this page.
          </p>
        ) : (
          <form action={login} className="flex max-w-[360px] flex-col gap-12px">
            <label htmlFor="token" className="font-ui text-[14px] text-text-primary">
              Admin token
            </label>
            <input id="token" name="token" type="password" autoComplete="current-password" required className={field} />
            {params.error && (
              <p className="font-ui text-[13px] text-text-error">That token is wrong.</p>
            )}
            <button type="submit" className={button}>
              Open
            </button>
          </form>
        )}
      </main>
    );
  }

  const [all, aggregates] = await Promise.all([
    listResponses(),
    Promise.all(caseStudySlugs.map(async (s) => [s, await getAggregate(s)] as const)),
  ]);

  const slugFilter = caseStudySlugs.find((s) => s === params.slug);
  const q3Options = Array.from(
    new Set(caseStudySlugs.flatMap((s) => feedbackQuestions[s].options))
  );
  const rows = all.filter(
    (r) => (!slugFilter || r.slug === slugFilter) && (!params.q3 || r.q3 === params.q3)
  );

  return (
    <main className={shell}>
      <div className="flex flex-wrap items-center justify-between gap-16px">
        <h1 className="font-display text-[32px] text-text-primary">Feedback inbox</h1>
        <div className="flex gap-12px">
          <a href="/admin/feedback/export" className={button}>
            Export CSV
          </a>
          {adminConfigured() && (
            <form action={logout}>
              <button type="submit" className={button}>
                Log out
              </button>
            </form>
          )}
        </div>
      </div>

      <section aria-label="Totals" className="grid grid-cols-2 gap-12px md:grid-cols-4">
        {aggregates.map(([slug, a]) => (
          <div key={slug} className="flex flex-col gap-4px rounded-md border border-border-default bg-bg-surface p-16px">
            <span className="font-mono text-[12px] uppercase tracking-[0.78px] text-text-muted">
              {LABELS[slug]}
            </span>
            <span className="font-ui font-semibold text-[24px] text-text-primary">{a.count}</span>
            <span className="font-ui text-[13px] text-text-muted">
              {a.q1Avg !== null ? `clarity ${a.q1Avg.toFixed(1)}` : "no scores yet"}
              {a.q2Avg !== null ? ` · convincing ${a.q2Avg.toFixed(1)}` : ""}
            </span>
          </div>
        ))}
      </section>

      <form method="get" className="flex flex-wrap items-center gap-12px">
        <select name="slug" defaultValue={slugFilter ?? ""} className={field} aria-label="Case study">
          <option value="">All case studies</option>
          {caseStudySlugs.map((s) => (
            <option key={s} value={s}>{LABELS[s]}</option>
          ))}
        </select>
        <select name="q3" defaultValue={params.q3 ?? ""} className={field} aria-label="Could be better">
          <option value="">Any pick</option>
          {q3Options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <button type="submit" className={button}>Filter</button>
        <span className="font-ui text-[13px] text-text-muted">
          {rows.length} of {all.length}
        </span>
      </form>

      {rows.length === 0 ? (
        <p className="font-ui text-[16px] text-text-muted">
          Nothing here yet. Responses sent before this inbox existed are counted in the totals but not listed.
        </p>
      ) : (
        <ul className="flex flex-col gap-12px">
          {rows.map((r) => (
            <li key={`${r.slug}:${r.responseId}`} className="flex flex-col gap-12px rounded-md border border-border-default bg-bg-surface p-16px">
              <div className="flex flex-wrap items-center justify-between gap-8px">
                <span className="font-ui text-[13px] text-text-muted">
                  {LABELS[r.slug]} · {fmtDate(r.createdAt)}
                </span>
                <form action={deleteResponse}>
                  <input type="hidden" name="slug" value={r.slug} />
                  <input type="hidden" name="responseId" value={r.responseId} />
                  <button type="submit" className="font-ui text-[13px] text-text-muted hover:text-text-error transition-colors">
                    Delete
                  </button>
                </form>
              </div>
              <div className="flex flex-wrap gap-8px font-ui text-[13px] text-text-primary">
                {r.q1 !== undefined && <span className="rounded-full border border-border-default px-12px py-4px">Clarity {r.q1}/5</span>}
                {r.q2 !== undefined && <span className="rounded-full border border-border-default px-12px py-4px">Convincing {r.q2}/5</span>}
                {r.q3 && <span className="rounded-full border border-text-accent px-12px py-4px text-text-accent">{r.q3}</span>}
              </div>
              {r.comment && (
                <p className="whitespace-pre-wrap font-ui text-[15px] leading-[22px] text-text-primary">{r.comment}</p>
              )}
              {(r.name || r.email) && (
                <p className="font-ui text-[13px] text-text-muted">
                  {r.name}
                  {r.name && r.email ? " · " : ""}
                  {r.email && (
                    <a href={`mailto:${r.email}`} className="underline">{r.email}</a>
                  )}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
