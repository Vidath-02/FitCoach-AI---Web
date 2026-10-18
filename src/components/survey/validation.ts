import type { SurveyAnswers } from "./types";

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/**
 * One validator per step (same order as `steps`). Returns a friendly message for the
 * first missing required answer, or null. Everything not checked here is optional.
 */
export const validators: ((a: SurveyAnswers) => string | null)[] = [
  // 1 · About you
  (a) => (!a.ageRange ? "Please choose your age range." : null),
  // 2 · Fitness profile
  (a) => {
    if (!a.activityLevel) return "Pick how active you are right now.";
    if (a.goals.length === 0) return "Pick at least one goal.";
    return null;
  },
  // 3 · Tracking today
  (a) => {
    if (!a.usesFitnessApp) return "Choose whether you use a fitness app.";
    if (a.trackingMethods.length === 0) return "Choose how you track progress (or “I don't track”).";
    return null;
  },
  // 4 · AI body scan
  (a) => {
    if (!a.cameraComfort) return "Pick how comfortable you'd feel with a camera scan.";
    if (a.scanMeasurements.length === 0) return "Pick at least one measurement you'd want.";
    if (!a.accuracyNeed) return "Choose how accurate the estimates would need to be.";
    if (!a.photoStorage) return "Choose what should happen to your scan photos.";
    return null;
  },
  // 5 · AI coach
  (a) => {
    if (!a.coachStyle) return "Pick a coaching style.";
    if (!a.aiTrust) return "Pick how much you'd trust AI advice.";
    return null;
  },
  // 6 · Features
  (a) => {
    if (Object.keys(a.featureInterest).length < 3) return "Rate at least 3 features so priorities are clear.";
    if (!a.pricing) return "Choose the pricing model that feels fair.";
    return null;
  },
  // 7 · Final thoughts
  (a) => {
    if (a.launchLikelihood === null) return "Pick how likely you are to try FitCoach AI.";
    if ((a.earlyAccess || a.betaTester) && !isEmail(a.email)) return "Add a valid email, or turn off early access and beta testing.";
    if (!a.consent) return "Please confirm consent so your responses can be used in the research.";
    return null;
  },
];
