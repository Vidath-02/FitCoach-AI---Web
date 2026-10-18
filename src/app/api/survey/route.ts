import { NextResponse } from "next/server";

/**
 * Receives a survey response and forwards it to SURVEY_WEBHOOK_URL (if configured).
 * Kept intentionally thin — point the webhook at a Google Apps Script, Formspree,
 * Make/Zapier or your own database endpoint. Without a webhook the response is logged.
 */
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

  const answers = data.answers;
  if (!answers || typeof answers !== "object" || answers.consent !== true || typeof answers.ageRange !== "string") {
    return NextResponse.json({ error: "Some required answers are missing." }, { status: 422 });
  }

  const record = { answers, meta: data.meta ?? {}, receivedAt: new Date().toISOString() };
  const webhook = process.env.SURVEY_WEBHOOK_URL;

  if (!webhook) {
    console.info("[survey] response received (no SURVEY_WEBHOOK_URL set):", JSON.stringify(record));
    return NextResponse.json({ ok: true });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } catch (err) {
    console.error("[survey] forwarding failed:", err);
    return NextResponse.json({ error: "We couldn't save your response. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
