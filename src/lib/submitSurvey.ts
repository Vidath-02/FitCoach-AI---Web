import type { SurveyAnswers } from "@/components/survey/types";

/** Bump when questions change, so responses can be told apart during analysis. */
export const SURVEY_VERSION = "v3";

export interface SurveySubmission {
  answers: Omit<SurveyAnswers, "company">;
  meta: {
    submittedAt: string;
    timezone: string;
    durationSeconds: number;
    locale: string;
    surveyVersion: string;
    deviceId: string;
  };
}

const DEVICE_KEY = "fc-device";
const SUBMIT_TIMEOUT_MS = 20_000;

/**
 * Random id for this browser tab, so the server can rate-limit per person even when many
 * people share one IP (campus Wi-Fi, mobile carriers). It's only held in server memory
 * for a few minutes and never stored with the response.
 */
function deviceId(): string {
  const fresh =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  try {
    const id = sessionStorage.getItem(DEVICE_KEY) ?? fresh;
    sessionStorage.setItem(DEVICE_KEY, id);
    return id;
  } catch {
    return fresh;
  }
}

export async function submitSurvey(answers: SurveyAnswers, startedAt: number): Promise<void> {
  const { company, ...rest } = answers;
  const payload: SurveySubmission & { company: string } = {
    answers: { ...rest, email: rest.earlyAccess || rest.betaTester ? rest.email.trim() : "" },
    meta: {
      submittedAt: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      durationSeconds: Math.round((Date.now() - startedAt) / 1000),
      locale: navigator.language,
      surveyVersion: SURVEY_VERSION,
      deviceId: deviceId(),
    },
    company,
  };

  // A stalled mobile connection would otherwise leave the button spinning forever.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch("/api/survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch {
    // Browsers word this differently ("Failed to fetch", "Load failed"…); say what it means.
    throw new Error("Couldn't reach the server. Check your connection and try again. Your answers are still here.");
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "Something went wrong. Please try again.");
  }
}
