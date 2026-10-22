import { NextRequest, NextResponse } from "next/server";
import { applySubmission, getAggregate, isCaseStudySlug } from "@/app/api/feedback/data";
import {
  feedbackQuestions,
  type FeedbackSubmission,
} from "@/components/shared/feedbackQuestions";

// Backend notes (keys, edit-delta math, the Upstash / in-memory switch) live in
// data.ts, which the admin page shares.

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!isCaseStudySlug(slug)) {
    return NextResponse.json({ error: "invalid slug" }, { status: 400 });
  }
  return NextResponse.json(await getAggregate(slug));
}

export async function POST(request: NextRequest) {
  let body: FeedbackSubmission;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const { caseStudySlug, responseId, q1, q2, q3, comment, name, email } = body;
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

  if (
    (comment !== undefined && (typeof comment !== "string" || comment.length > 1000)) ||
    (name !== undefined && (typeof name !== "string" || name.length > 80)) ||
    (email !== undefined &&
      (typeof email !== "string" ||
        email.length > 120 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))
  ) {
    return NextResponse.json({ error: "invalid text field" }, { status: 400 });
  }

  const result = await applySubmission(caseStudySlug, responseId, {
    q1,
    q2,
    q3,
    comment,
    name,
    email,
  });
  return NextResponse.json(result);
}
