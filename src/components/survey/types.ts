/** 0 = not for me, 1 = nice to have, 2 = must-have */
export type Interest = 0 | 1 | 2;

export interface SurveyAnswers {
  // 1 · About you
  name: string;
  ageRange: string;
  gender: string;
  occupation: string;
  // 2 · Fitness profile
  activityLevel: string;
  sessionMinutes: number;
  goals: string[];
  trainingPlaces: string[];
  // 3 · Tracking today
  usesFitnessApp: "yes" | "no" | "";
  trackingMethods: string[];
  measurementMethods: string[];
  trackingSatisfaction: number;
  biggestChallenge: string;
  // 4 · AI body scanning
  cameraComfort: number;
  privacyImportance: number;
  scanFrequency: string;
  // 5 · Features & expectations
  featureInterest: Record<string, Interest>;
  platforms: string[];
  pricing: string;
  // 6 · Final thoughts
  wishlist: string;
  feedback: string;
  earlyAccess: boolean;
  email: string;
  consent: boolean;
  /** honeypot: real users never see or fill this */
  company: string;
}

export const initialAnswers: SurveyAnswers = {
  name: "",
  ageRange: "",
  gender: "",
  occupation: "",
  activityLevel: "",
  sessionMinutes: 45,
  goals: [],
  trainingPlaces: [],
  usesFitnessApp: "",
  trackingMethods: [],
  measurementMethods: [],
  trackingSatisfaction: 5,
  biggestChallenge: "",
  cameraComfort: 0,
  privacyImportance: 70,
  scanFrequency: "",
  featureInterest: {},
  platforms: [],
  pricing: "",
  wishlist: "",
  feedback: "",
  earlyAccess: true,
  email: "",
  consent: false,
  company: "",
};

export type Update = <K extends keyof SurveyAnswers>(key: K, value: SurveyAnswers[K]) => void;

export interface StepProps {
  answers: SurveyAnswers;
  update: Update;
}
