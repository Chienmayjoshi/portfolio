import { NextResponse } from "next/server";
import { isAuthed } from "@/app/admin/auth";
import { listResponses } from "@/app/api/feedback/data";

// CSV of every indexed response. A cell that starts with = + - @ would run as
// a formula when opened in a spreadsheet, and name/email/comment are
// visitor-typed, so those get a leading apostrophe.
const cell = (v: unknown) => {
  let s = v === undefined || v === null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET() {
  if (!(await isAuthed())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const rows = await listResponses();
  const header = ["created", "case study", "clarity", "convincing", "could be better", "comment", "name", "email"];
  const lines = [
    header.map(cell).join(","),
    ...rows.map((r) =>
      [r.createdAt, r.slug, r.q1, r.q2, r.q3, r.comment, r.name, r.email]
        .map(cell)
        .join(",")
    ),
  ];
  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="feedback.csv"',
      "Cache-Control": "no-store",
    },
  });
}
