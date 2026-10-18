import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

/**
 * Receives a survey response, validates it, and stores it in Supabase
 * (`public.survey_responses`, see supabase/migrations/001_survey_responses.sql).
 * Without Supabase env vars the response is only logged, which is handy for local dev.
 */

const str = (v: unknown, max: number) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);
const strArray = (v: unknown, maxItems = 10, maxLen = 32) =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, maxItems).map((x) => x.slice(0, maxLen)) : [];
const int = (v: unknown, min: number, max: number) =>
  typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : null;
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

/** Health check: reports whether responses will be stored. Never exposes keys. */
export async function GET() {
  return NextResponse.json(
    { storage: getSupabase() ? "supabase" : "not-configured" },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > 20_000) {
      return NextResponse.json({ error: "Response is too large." }, { status: 413 });
    }
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const data = body as { answers?: Record<string, unknown>; meta?: Record<string, unknown>; company?: string };

  // Honeypot filled → silently accept and drop.
  if (data.company) return NextResponse.json({ ok: true });

  const a = data.answers;
  if (!a || typeof a !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const ageRange = str(a.ageRange, 32);
  const activityLevel = str(a.activityLevel, 32);
  if (a.consent !== true || !ageRange || !activityLevel) {
    return NextResponse.json({ error: "Some required answers are missing." }, { status: 422 });
  }

  const earlyAccess = a.earlyAccess === true;
  const betaTester = a.betaTester === true;
  const email = earlyAccess || betaTester ? str(a.email, 254) : null;
  if ((earlyAccess || betaTester) && (!email || !isEmail(email))) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
  }

  // Email lives only in its own column, not duplicated inside `answers`.
  const { email: _omit, ...answers } = a;
  void _omit;

  const meta = data.meta && typeof data.meta === "object" ? data.meta : {};
  const row = {
    age_range: ageRange,
    gender: str(a.gender, 32),
    occupation: str(a.occupation, 32),
    activity_level: activityLevel,
    goals: strArray(a.goals),
    uses_fitness_app: str(a.usesFitnessApp, 8),
    camera_comfort: int(a.cameraComfort, 1, 5),
    privacy_importance: int(a.privacyImportance, 0, 100),
    pricing: str(a.pricing, 32),
    early_access: earlyAccess,
    email,
    consent: true,
    answers,
    meta: {
      timezone: str(meta.timezone, 64),
      locale: str(meta.locale, 32),
      durationSeconds: int(meta.durationSeconds, 0, 86_400),
      submittedAt: str(meta.submittedAt, 40),
      surveyVersion: str(meta.surveyVersion, 8),
    },
  };

  const supabase = getSupabase();
  if (!supabase) {
    // Never report success on the live site when nothing would be saved.
    if (process.env.NODE_ENV === "production") {
      console.error("[survey] Supabase env vars missing; response NOT saved.");
      return NextResponse.json({ error: "Your response couldn't be saved. Please try again." }, { status: 503 });
    }
    console.info("[survey] Supabase not configured (dev), response logged only:", JSON.stringify(row));
    return NextResponse.json({ ok: true });
  }

  // No `.select()` after insert: the public key is insert-only and can't read rows back.
  const { error } = await supabase.from("survey_responses").insert(row);
  if (error) {
    console.error("[survey] Supabase insert failed:", error.code, error.message);
    return NextResponse.json({ error: "Your response couldn't be saved. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
