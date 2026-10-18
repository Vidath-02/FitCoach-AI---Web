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
  };
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
    },
    company,
  };

  const res = await fetch("/api/survey", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "Something went wrong. Please try again.");
  }
}
