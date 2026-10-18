import { NextResponse } from "next/server";
import { getSupabase, supabaseKeyType } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { cleanText, isEmail, sanitizeAnswers } from "@/lib/surveySanitize";

/**
 * Receives a survey response, checks where it came from, validates every answer
 * against the known options, and stores it in Supabase (`public.survey_responses`).
 * Suspicious submissions are saved with a flag rather than dropped, so no real
 * response is ever lost. Without Supabase env vars (local dev only) it just logs.
 */

const MAX_BODY_CHARS = 20_000;
const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };
/** Finishing all 7 steps faster than this is almost certainly automated. */
const MIN_HUMAN_SECONDS = 20;

const fail = (status: number, error: string, headers?: HeadersInit) =>
  NextResponse.json({ error }, { status, headers });

/** Health check: reports whether responses will be stored. Never exposes keys. */
export async function GET() {
  return NextResponse.json({ storage: getSupabase() ? "supabase" : "not-configured", key: supabaseKeyType() });
}

/** Rejects posts made from other websites. Requests without an Origin (e.g. curl) are allowed. */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return fail(403, "Forbidden.");
  if (!request.headers.get("content-type")?.includes("application/json")) return fail(415, "Unsupported content type.");

  const rl = rateLimit(`survey:${clientIp(request)}`, RATE_LIMIT.limit, RATE_LIMIT.windowMs);
  if (!rl.ok) {
    return fail(429, "Too many submissions from this device. Please try again later.", {
      "Retry-After": String(rl.retryAfterSec),
    });
  }

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_CHARS) return fail(413, "Response is too large.");
    body = JSON.parse(text);
  } catch {
    return fail(400, "Invalid request.");
  }
  if (!body || typeof body !== "object") return fail(400, "Invalid request.");

  const data = body as { answers?: unknown; meta?: unknown; company?: unknown };
  if (!data.answers || typeof data.answers !== "object") return fail(400, "Invalid request.");

  const a = sanitizeAnswers(data.answers as Record<string, unknown>);
  if (!a.consent || !a.ageRange || !a.activityLevel) return fail(422, "Some required answers are missing.");

  const wantsEmail = a.earlyAccess || a.betaTester;
  const email = wantsEmail ? a.email : "";
  if (wantsEmail && !isEmail(email)) return fail(422, "Please enter a valid email address.");

  const rawMeta = data.meta && typeof data.meta === "object" ? (data.meta as Record<string, unknown>) : {};
  const durationSeconds =
    typeof rawMeta.durationSeconds === "number" && Number.isFinite(rawMeta.durationSeconds)
      ? Math.min(86_400, Math.max(0, Math.round(rawMeta.durationSeconds)))
      : null;

  // Bot signals: flag, never drop. Browser autofill can trip the honeypot for real people.
  const suspectedBot = typeof data.company === "string" && data.company.trim() !== "";
  const fastSubmit = durationSeconds !== null && durationSeconds < MIN_HUMAN_SECONDS;

  // Email lives only in its own column, never inside `answers`.
  const { email: _omit, ...answers } = a;
  void _omit;

  const row = {
    age_range: a.ageRange,
    gender: (answers.gender as string) || null,
    occupation: (answers.occupation as string) || null,
    activity_level: a.activityLevel,
    goals: a.goals,
    uses_fitness_app: a.usesFitnessApp || null,
    camera_comfort: a.cameraComfort ? a.cameraComfort : null,
    privacy_importance: a.privacyImportance,
    pricing: a.pricing || null,
    early_access: a.earlyAccess,
    email: email || null,
    consent: true,
    answers,
    meta: {
      timezone: cleanText(rawMeta.timezone, 64) || null,
      locale: cleanText(rawMeta.locale, 32) || null,
      durationSeconds,
      submittedAt: cleanText(rawMeta.submittedAt, 40) || null,
      surveyVersion: cleanText(rawMeta.surveyVersion, 8) || null,
      suspectedBot,
      fastSubmit,
    },
  };

  const supabase = getSupabase();
  if (!supabase) {
    // Never report success on the live site when nothing would be saved.
    if (process.env.NODE_ENV === "production") {
      console.error("[survey] Supabase env vars missing; response NOT saved.");
      return fail(503, "Your response couldn't be saved. Please try again.");
    }
    console.info("[survey] Supabase not configured (dev), response logged only:", JSON.stringify(row));
    return NextResponse.json({ ok: true });
  }

  // No `.select()` after insert: with the publishable key the table is insert-only.
  const { error } = await supabase.from("survey_responses").insert(row);
  if (error) {
    console.error("[survey] Supabase insert failed:", error.code, error.message);
    return fail(502, "Your response couldn't be saved. Please try again.");
  }

  const flags = [suspectedBot && "suspectedBot", fastSubmit && "fastSubmit"].filter(Boolean).join(", ");
  console.info(`[survey] response saved (${row.meta.surveyVersion ?? "v1"}${flags ? `, ${flags}` : ""}).`);
  return NextResponse.json({ ok: true });
}
