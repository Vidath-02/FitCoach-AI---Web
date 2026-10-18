import * as opt from "@/components/survey/options";
import type { Option } from "@/components/survey/options";

/**
 * Server-side allow-list for survey answers.
 * Only known questions are kept, choices must match a real option, numbers are
 * clamped to their scale, and free text is trimmed, length-limited and stripped of
 * control characters. Anything else a client sends is dropped before storage.
 */

const values = (list: Option[]) => new Set(list.map((o) => o.value));

const single: Record<string, Set<string>> = {
  ageRange: values(opt.ageRanges),
  gender: values(opt.genders),
  region: values(opt.regions),
  occupation: values(opt.occupations),
  activityLevel: values(opt.activityLevels),
  trainingExperience: values(opt.trainingExperience),
  hasCoach: values(opt.coachOptions),
  usesFitnessApp: values(opt.yesNo),
  biggestChallenge: values(opt.challenges),
  accuracyNeed: values(opt.accuracyNeeds),
  scanClothing: values(opt.scanClothing),
  photoStorage: values(opt.photoStorage),
  scanFrequency: values(opt.scanFrequencies),
  coachStyle: values(opt.coachStyles),
  checkInFrequency: values(opt.checkInFrequencies),
  dailyTime: values(opt.dailyTimes),
  pricing: values(opt.pricing),
};

const multi: Record<string, Set<string>> = {
  goals: values(opt.goals),
  trainingPlaces: values(opt.trainingPlaces),
  appsUsed: values(opt.appsUsed),
  appDropReasons: values(opt.appDropReasons),
  trackingMethods: values(opt.trackingMethods),
  measurementMethods: values(opt.measurementMethods),
  scanMeasurements: values(opt.scanMeasurements),
  motivators: values(opt.motivators),
  dietPreference: values(opt.dietPreferences),
  platforms: values(opt.platforms),
};

const numeric: Record<string, [min: number, max: number]> = {
  sessionMinutes: [0, 120],
  trackingSatisfaction: [1, 10],
  cameraComfort: [0, 5],
  privacyImportance: [0, 100],
  aiTrust: [0, 5],
};

const text: Record<string, number> = { name: 60, wishlist: 600, feedback: 600 };
const featureKeys = values(opt.features);

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function cleanText(v: unknown, max: number): string {
  return typeof v === "string" ? v.replace(CONTROL_CHARS, "").trim().slice(0, max) : "";
}

const clamp = (v: unknown, min: number, max: number): number | null =>
  typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : null;

export type CleanAnswers = Record<string, unknown> & {
  ageRange: string;
  activityLevel: string;
  goals: string[];
  usesFitnessApp: string;
  cameraComfort: number | null;
  privacyImportance: number | null;
  pricing: string;
  earlyAccess: boolean;
  betaTester: boolean;
  consent: boolean;
  email: string;
};

export function sanitizeAnswers(raw: Record<string, unknown>): CleanAnswers {
  const out: Record<string, unknown> = {};

  for (const [key, allowed] of Object.entries(single)) {
    const v = raw[key];
    out[key] = typeof v === "string" && allowed.has(v) ? v : "";
  }
  for (const [key, allowed] of Object.entries(multi)) {
    const v = raw[key];
    out[key] = Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === "string" && allowed.has(x)))] : [];
  }
  for (const [key, [min, max]] of Object.entries(numeric)) {
    out[key] = clamp(raw[key], min, max);
  }
  for (const [key, max] of Object.entries(text)) {
    out[key] = cleanText(raw[key], max);
  }

  const fi: Record<string, number> = {};
  if (raw.featureInterest && typeof raw.featureInterest === "object") {
    for (const [k, v] of Object.entries(raw.featureInterest as Record<string, unknown>)) {
      if (featureKeys.has(k) && (v === 0 || v === 1 || v === 2)) fi[k] = v;
    }
  }
  out.featureInterest = fi;

  out.launchLikelihood = raw.launchLikelihood === null ? null : clamp(raw.launchLikelihood, 0, 10);
  out.earlyAccess = raw.earlyAccess === true;
  out.betaTester = raw.betaTester === true;
  out.consent = raw.consent === true;
  out.email = cleanText(raw.email, 254).toLowerCase();

  return out as CleanAnswers;
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
