/** 0 = not for me, 1 = nice to have, 2 = must-have */
export type Interest = 0 | 1 | 2;

export interface SurveyAnswers {
  // 1 · About you
  name: string;
  ageRange: string;
  gender: string;
  region: string;
  occupation: string;
  // 2 · Fitness profile
  activityLevel: string;
  trainingExperience: string;
  sessionMinutes: number;
  goals: string[];
  trainingPlaces: string[];
  hasCoach: string;
  // 3 · Tracking today
  usesFitnessApp: "yes" | "no" | "";
  appsUsed: string[];
  appDropReasons: string[];
  trackingMethods: string[];
  measurementMethods: string[];
  trackingSatisfaction: number;
  biggestChallenge: string;
  // 4 · AI body scanning
  cameraComfort: number;
  scanMeasurements: string[];
  accuracyNeed: string;
  scanClothing: string;
  photoStorage: string;
  privacyImportance: number;
  scanFrequency: string;
  // 5 · AI coach
  coachStyle: string;
  checkInFrequency: string;
  aiTrust: number;
  motivators: string[];
  dietPreference: string[];
  // 6 · Features & expectations
  featureInterest: Record<string, Interest>;
  platforms: string[];
  dailyTime: string;
  pricing: string;
  // 7 · Final thoughts
  /** 0–10, null until answered */
  launchLikelihood: number | null;
  wishlist: string;
  feedback: string;
  earlyAccess: boolean;
  betaTester: boolean;
  email: string;
  consent: boolean;
  /** honeypot: real users never see or fill this */
  company: string;
}

export const initialAnswers: SurveyAnswers = {
  name: "",
  ageRange: "",
  gender: "",
  region: "",
  occupation: "",
  activityLevel: "",
  trainingExperience: "",
  sessionMinutes: 45,
  goals: [],
  trainingPlaces: [],
  hasCoach: "",
  usesFitnessApp: "",
  appsUsed: [],
  appDropReasons: [],
  trackingMethods: [],
  measurementMethods: [],
  trackingSatisfaction: 5,
  biggestChallenge: "",
  cameraComfort: 0,
  scanMeasurements: [],
  accuracyNeed: "",
  scanClothing: "",
  photoStorage: "",
  privacyImportance: 70,
  scanFrequency: "",
  coachStyle: "",
  checkInFrequency: "",
  aiTrust: 0,
  motivators: [],
  dietPreference: [],
  featureInterest: {},
  platforms: [],
  dailyTime: "",
  pricing: "",
  launchLikelihood: null,
  wishlist: "",
  feedback: "",
  earlyAccess: true,
  betaTester: false,
  email: "",
  consent: false,
  company: "",
};

export type Update = <K extends keyof SurveyAnswers>(key: K, value: SurveyAnswers[K]) => void;

export interface StepProps {
  answers: SurveyAnswers;
  update: Update;
}
