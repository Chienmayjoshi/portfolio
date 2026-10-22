"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ADMIN_COOKIE,
  isAuthed,
  sessionValue,
  tokenMatches,
} from "@/app/admin/auth";
import { isCaseStudySlug, removeSubmission } from "@/app/api/feedback/data";

export async function login(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  if (!tokenMatches(token)) redirect("/admin/feedback?error=1");
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, sessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 14,
  });
  redirect("/admin/feedback");
}

export async function logout() {
  const jar = await cookies();
  jar.delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin/feedback");
}

export async function deleteResponse(formData: FormData) {
  if (!(await isAuthed())) return;
  const slug = String(formData.get("slug") ?? "");
  const responseId = String(formData.get("responseId") ?? "");
  if (!isCaseStudySlug(slug) || !responseId) return;
  await removeSubmission(slug, responseId);
  revalidatePath("/admin/feedback");
}
