import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { memoryStore, type FeedbackStore } from "@/app/api/feedback/store";
import {
  caseStudySlugs,
  feedbackQuestions,
  type CaseStudySlug,
  type FeedbackAggregateData,
  type FeedbackAnswers,
  type FeedbackSubmission,
} from "@/components/shared/feedbackQuestions";

// Not sourced from Figma — backend for the Case Study Feedback Section
// (see CaseStudyFeedback.tsx). First API route in the repo. Upstash Redis
// chosen per direct decision: one small dependency, zero schema, atomic
// per-command increments are enough for these aggregates.
//
// Revision 2 (per direct request): submissions are now editable — a
// visitor can reopen and change their own answer, which must update the
// aggregate rather than double-count a second respondent. That turns
// "responses" from an append-only, non-addressable list into an
// addressable-by-responseId hash, and turns each write from a blind
// increment into a read-modify-write against the visitor's own prior
// record (see applySubmission below).
//
// Keys per case study slug:
// - feedback:{slug}:count            — INCR'd only on a true first-time create, never on an edit
// - feedback:{slug}:q1:sum / :q1:n   — delta-adjusted; avg = sum/n at read time
// - feedback:{slug}:q2:sum / :q2:n   — same shape as q1
// - feedback:{slug}:q3               — hash (option -> count), delta-adjusted
// - feedback:{slug}:response:{id}    — hash { q1, q2, q3, comment, createdAt, updatedAt },
//                                       the addressable per-response record read on every
//                                       write to tell create apart from edit and to compute deltas
//
// Accepted race condition: this is read-then-write, not a single atomic
// command — two concurrent edits of the SAME responseId (only plausible
// if one visitor has two tabs open editing at once; ids are per-visitor,
// never shared) could read the same stale record and both apply deltas
// against it, drifting sums slightly. Accepted as-is at this traffic
// scale — no Lua script/transaction for v1.
//
// Backend selection: real Upstash Redis when both env vars are set,
// otherwise an in-memory fake (store.ts) — see that file for why. GET/POST
// operate unconditionally on `store`, no more null-check/503 branch.
const store: FeedbackStore =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : memoryStore;

function isCaseStudySlug(value: unknown): value is CaseStudySlug {
  return (
    typeof value === "string" &&
    caseStudySlugs.includes(value as CaseStudySlug)
  );
}

const countKey = (slug: CaseStudySlug) => `feedback:${slug}:count`;
const q1SumKey = (slug: CaseStudySlug) => `feedback:${slug}:q1:sum`;
const q1NKey = (slug: CaseStudySlug) => `feedback:${slug}:q1:n`;
const q2SumKey = (slug: CaseStudySlug) => `feedback:${slug}:q2:sum`;
const q2NKey = (slug: CaseStudySlug) => `feedback:${slug}:q2:n`;
const q3Key = (slug: CaseStudySlug) => `feedback:${slug}:q3`;
const responseKey = (slug: CaseStudySlug, responseId: string) =>
  `feedback:${slug}:response:${responseId}`;

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!isCaseStudySlug(slug)) {
    return NextResponse.json({ error: "invalid slug" }, { status: 400 });
  }

  const [count, q1Sum, q1N, q2Sum, q2N, q3Counts] = await Promise.all([
    store.get(countKey(slug)),
    store.get(q1SumKey(slug)),
    store.get(q1NKey(slug)),
    store.get(q2SumKey(slug)),
    store.get(q2NKey(slug)),
    store.hgetall<Record<string, string>>(q3Key(slug)),
  ]);

  const q3Total = Object.values(q3Counts ?? {}).reduce(
    (sum, n) => sum + Number(n),
    0
  );
  const q3Breakdown: Record<string, number> = {};
  if (q3Counts && q3Total > 0) {
    for (const [option, n] of Object.entries(q3Counts)) {
      q3Breakdown[option] = Math.round((Number(n) / q3Total) * 100);
    }
  }

  const aggregate: FeedbackAggregateData = {
    count: count ?? 0,
    q1Avg: q1N ? (q1Sum ?? 0) / q1N : null,
    q2Avg: q2N ? (q2Sum ?? 0) / q2N : null,
    q3Breakdown,
  };
  return NextResponse.json(aggregate);
}

/** Create-or-edit, decided by whether a record already exists under
 *  responseKey. Only touches sum/n/hash for the actual transition that
 *  occurred (nothing -> value, value -> different value, value ->
 *  nothing), so re-running this with identical answers is a harmless
 *  no-op rather than double-counting. */
async function applySubmission(
  slug: CaseStudySlug,
  responseId: string,
  next: FeedbackAnswers
) {
  const existing = await store.hgetall<Record<string, string>>(
    responseKey(slug, responseId)
  );
  const isEdit = existing !== null;
  if (!isEdit) {
    await store.incr(countKey(slug));
  }

  const oldQ1 = existing?.q1 !== undefined ? Number(existing.q1) : undefined;
  if (next.q1 !== undefined && oldQ1 === undefined) {
    await Promise.all([
      store.incrby(q1SumKey(slug), next.q1),
      store.incr(q1NKey(slug)),
    ]);
  } else if (next.q1 !== undefined && oldQ1 !== undefined && next.q1 !== oldQ1) {
    await store.incrby(q1SumKey(slug), next.q1 - oldQ1);
  } else if (next.q1 === undefined && oldQ1 !== undefined) {
    await Promise.all([
      store.incrby(q1SumKey(slug), -oldQ1),
      store.incrby(q1NKey(slug), -1),
    ]);
  }

  const oldQ2 = existing?.q2 !== undefined ? Number(existing.q2) : undefined;
  if (next.q2 !== undefined && oldQ2 === undefined) {
    await Promise.all([
      store.incrby(q2SumKey(slug), next.q2),
      store.incr(q2NKey(slug)),
    ]);
  } else if (next.q2 !== undefined && oldQ2 !== undefined && next.q2 !== oldQ2) {
    await store.incrby(q2SumKey(slug), next.q2 - oldQ2);
  } else if (next.q2 === undefined && oldQ2 !== undefined) {
    await Promise.all([
      store.incrby(q2SumKey(slug), -oldQ2),
      store.incrby(q2NKey(slug), -1),
    ]);
  }

  const oldQ3 = existing?.q3;
  if (oldQ3 !== next.q3) {
    if (oldQ3) await store.hincrby(q3Key(slug), oldQ3, -1);
    if (next.q3) await store.hincrby(q3Key(slug), next.q3, 1);
  }

  await store.hset(responseKey(slug, responseId), {
    ...(next.q1 !== undefined && { q1: next.q1 }),
    ...(next.q2 !== undefined && { q2: next.q2 }),
    ...(next.q3 !== undefined && { q3: next.q3 }),
    ...(next.comment !== undefined && { comment: next.comment }),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return { ok: true, responseId };
}

export async function POST(request: NextRequest) {
  let body: FeedbackSubmission;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const { caseStudySlug, responseId, q1, q2, q3, comment } = body;
  if (!isCaseStudySlug(caseStudySlug)) {
    return NextResponse.json({ error: "invalid slug" }, { status: 400 });
  }
  if (typeof responseId !== "string" || responseId.length === 0) {
    return NextResponse.json({ error: "invalid responseId" }, { status: 400 });
  }
  if (q3 !== undefined && !feedbackQuestions[caseStudySlug].options.includes(q3)) {
    return NextResponse.json({ error: "invalid q3 option" }, { status: 400 });
  }
  if (
    (q1 !== undefined && (typeof q1 !== "number" || q1 < 1 || q1 > 5)) ||
    (q2 !== undefined && (typeof q2 !== "number" || q2 < 1 || q2 > 5))
  ) {
    return NextResponse.json({ error: "invalid scale value" }, { status: 400 });
  }

  const result = await applySubmission(caseStudySlug, responseId, {
    q1,
    q2,
    q3,
    comment,
  });
  return NextResponse.json(result);
}
