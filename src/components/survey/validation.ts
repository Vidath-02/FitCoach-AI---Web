import type { SurveyAnswers } from "./types";

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/** Returns a friendly message for the first missing required answer on a step, or null. */
export const validators: ((a: SurveyAnswers) => string | null)[] = [
  (a) => (!a.ageRange ? "Please choose your age range." : null),
  (a) => {
    if (!a.activityLevel) return "Tell us how active you are right now.";
    if (a.goals.length === 0) return "Pick at least one goal.";
    return null;
  },
  (a) => {
    if (!a.usesFitnessApp) return "Let us know whether you use a fitness app.";
    if (a.trackingMethods.length === 0) return "Choose how you track progress (or “I don't track”).";
    return null;
  },
  (a) => (!a.cameraComfort ? "Pick how comfortable you'd feel with a camera scan." : null),
  (a) => {
    if (Object.keys(a.featureInterest).length < 3) return "Rate at least 3 features so we know what to prioritise.";
    if (!a.pricing) return "Choose the pricing model that feels fair.";
    return null;
  },
  (a) => {
    if (a.earlyAccess && !isEmail(a.email)) return "Add a valid email for early access, or switch it off.";
    if (!a.consent) return "Please confirm consent so we can use your responses.";
    return null;
  },
];
