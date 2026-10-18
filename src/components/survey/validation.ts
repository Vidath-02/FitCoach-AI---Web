import { features } from "./options";
import type { SurveyAnswers } from "./types";

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

const MISSING = "Please answer the highlighted questions to continue.";

/**
 * One validator per step (same order as `steps`). Returns a message when a required
 * answer is missing, or null. Every question is required except the name and the two
 * open-text questions; sensitive ones offer "Prefer not to say" instead of being optional.
 */
export const validators: ((a: SurveyAnswers) => string | null)[] = [
  // 1 · About you (name stays optional so the survey remains anonymous)
  (a) => (!a.ageRange || !a.gender || !a.region || !a.occupation ? MISSING : null),
  // 2 · Fitness profile
  (a) =>
    !a.activityLevel || !a.trainingExperience || a.goals.length === 0 || a.trainingPlaces.length === 0 || !a.hasCoach
      ? MISSING
      : null,
  // 3 · Tracking today
  (a) =>
    !a.usesFitnessApp ||
    (a.usesFitnessApp === "yes" && a.appsUsed.length === 0) ||
    (a.usesFitnessApp === "no" && a.appDropReasons.length === 0) ||
    a.trackingMethods.length === 0 ||
    a.measurementMethods.length === 0 ||
    !a.biggestChallenge
      ? MISSING
      : null,
  // 4 · AI body scan
  (a) =>
    !a.cameraComfort || a.scanMeasurements.length === 0 || !a.accuracyNeed || !a.scanClothing || !a.photoStorage || !a.scanFrequency
      ? MISSING
      : null,
  // 5 · AI coach
  (a) =>
    !a.coachStyle || !a.checkInFrequency || !a.aiTrust || a.motivators.length === 0 || a.dietPreference.length === 0
      ? MISSING
      : null,
  // 6 · Features
  (a) =>
    features.some((f) => a.featureInterest[f.value] === undefined) || a.platforms.length === 0 || !a.dailyTime || !a.pricing
      ? MISSING
      : null,
  // 7 · Final thoughts
  (a) => {
    if (a.launchLikelihood === null) return MISSING;
    if ((a.earlyAccess || a.betaTester) && !isEmail(a.email)) return "Add a valid email, or turn off early access and beta testing.";
    if (!a.consent) return "Please confirm consent so your responses can be used in the research.";
    return null;
  },
];
