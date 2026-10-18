import {
  Bell,
  Bike,
  Briefcase,
  Building2,
  Camera,
  ChartLine,
  Cloud,
  Dumbbell,
  EyeOff,
  Flame,
  Footprints,
  GraduationCap,
  HeartPulse,
  House,
  Layers,
  MessageCircle,
  Mountain,
  PersonStanding,
  Salad,
  ShieldCheck,
  Shirt,
  Smartphone,
  Sparkles,
  Trash2,
  Trophy,
  Users,
  Watch,
  type LucideIcon,
} from "lucide-react";

export interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  emoji?: string;
}

export const ageRanges: Option[] = [
  { value: "under-18", label: "Under 18" },
  { value: "18-24", label: "18 – 24" },
  { value: "25-34", label: "25 – 34" },
  { value: "35-44", label: "35 – 44" },
  { value: "45-54", label: "45 – 54" },
  { value: "55+", label: "55 +" },
];

export const genders: Option[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not", label: "Prefer not to say" },
];

export const occupations: Option[] = [
  { value: "student", label: "Student", icon: GraduationCap },
  { value: "professional", label: "Working professional", icon: Briefcase },
  { value: "self-employed", label: "Self-employed", icon: Building2 },
  { value: "other", label: "Something else", icon: Sparkles },
  { value: "prefer-not", label: "Prefer not to say", icon: EyeOff },
];

export const activityLevels: Option[] = [
  { value: "starting", label: "Just starting", description: "I rarely exercise right now", icon: Footprints },
  { value: "light", label: "Lightly active", description: "1 – 2 workouts a week", icon: Bike },
  { value: "active", label: "Active", description: "3 – 4 workouts a week", icon: Dumbbell },
  { value: "athlete", label: "Athlete", description: "5+ sessions, training seriously", icon: Flame },
];

export const goals: Option[] = [
  { value: "lose-fat", label: "Lose body fat", icon: Flame },
  { value: "build-muscle", label: "Build muscle", icon: Dumbbell },
  { value: "endurance", label: "Improve fitness & stamina", icon: HeartPulse },
  { value: "posture", label: "Better posture", icon: PersonStanding },
  { value: "health", label: "Stay healthy", icon: ShieldCheck },
  { value: "performance", label: "Sport performance", icon: Trophy },
];

export const trainingPlaces: Option[] = [
  { value: "gym", label: "Gym", icon: Dumbbell },
  { value: "home", label: "Home", icon: House },
  { value: "outdoors", label: "Outdoors", icon: Mountain },
  { value: "club", label: "Sports club", icon: Trophy },
  { value: "classes", label: "Classes / studio", icon: Users },
  { value: "none", label: "I don't train yet" },
];

export const yesNo: Option[] = [
  { value: "yes", label: "Yes, I do", description: "I use at least one fitness app", emoji: "📱" },
  { value: "no", label: "Not really", description: "I don't use any fitness app", emoji: "🙅" },
];

export const trackingMethods: Option[] = [
  { value: "app", label: "Fitness app" },
  { value: "wearable", label: "Smartwatch / band" },
  { value: "smart-scale", label: "Smart scale" },
  { value: "notes", label: "Notes / spreadsheet" },
  { value: "photos", label: "Progress photos" },
  { value: "none", label: "I don't track" },
];

export const measurementMethods: Option[] = [
  { value: "tape", label: "Tape measure" },
  { value: "scale", label: "Bathroom scale" },
  { value: "smart-scale", label: "Smart / body-fat scale" },
  { value: "trainer", label: "Personal trainer" },
  { value: "calipers", label: "Skinfold calipers" },
  { value: "never", label: "I never measure" },
];

export const challenges: Option[] = [
  { value: "motivation", label: "Staying motivated", emoji: "🔋" },
  { value: "no-progress", label: "Not seeing progress", emoji: "📉" },
  { value: "time", label: "Lack of time", emoji: "⏱️" },
  { value: "guidance", label: "Not knowing what to do", emoji: "🧭" },
  { value: "cost", label: "Cost of gyms / trainers", emoji: "💸" },
];

export const comfortScale: Option[] = [
  { value: "1", label: "Not at all", emoji: "😟" },
  { value: "2", label: "Hesitant", emoji: "😕" },
  { value: "3", label: "Neutral", emoji: "😐" },
  { value: "4", label: "Comfortable", emoji: "🙂" },
  { value: "5", label: "Love it", emoji: "🤩" },
];

export const scanFrequencies: Option[] = [
  { value: "weekly", label: "Every week" },
  { value: "biweekly", label: "Every 2 weeks" },
  { value: "monthly", label: "Once a month" },
  { value: "occasionally", label: "Only occasionally" },
];

export const features: Option[] = [
  { value: "body-measure", label: "AI body measurements", description: "Chest, waist, hips & more from photos", icon: Camera },
  { value: "progress-3d", label: "3D progress timeline", description: "See your body change over time", icon: Layers },
  { value: "posture", label: "Posture analysis", description: "Spot imbalances and get fixes", icon: PersonStanding },
  { value: "workouts", label: "Personalised workouts", description: "Plans built from your measurements", icon: Dumbbell },
  { value: "nutrition", label: "Meal planning", description: "Simple, goal-based meal plans and tips", icon: Salad },
  { value: "ai-coach", label: "AI coach chat", description: "Ask questions, get instant answers", icon: MessageCircle },
  { value: "wearables", label: "Wearable sync", description: "Connect your watch or fitness band", icon: Watch },
  { value: "analytics", label: "Progress analytics", description: "Trends, streaks and insights", icon: ChartLine },
  { value: "reminders", label: "Smart reminders", description: "Nudges at the times that suit you", icon: Bell },
  { value: "community", label: "Challenges & community", description: "Compete and train with friends", icon: Users },
];

export const platforms: Option[] = [
  { value: "android", label: "Android" },
  { value: "ios", label: "iPhone (iOS)" },
  { value: "web", label: "Web browser" },
];

export const pricing: Option[] = [
  { value: "free", label: "Free only", description: "I wouldn't pay for a fitness app" },
  { value: "freemium", label: "Free + optional premium", description: "Pay only for advanced features" },
  { value: "subscription", label: "Low-cost subscription", description: "A small monthly fee is fine" },
  { value: "one-time", label: "One-time purchase", description: "Pay once, own it" },
];

/* ---------------- About you ---------------- */

export const regions: Option[] = [
  { value: "sri-lanka", label: "Sri Lanka" },
  { value: "south-asia", label: "Elsewhere in South Asia" },
  { value: "middle-east", label: "Middle East" },
  { value: "europe", label: "Europe" },
  { value: "north-america", label: "North America" },
  { value: "other", label: "Somewhere else" },
  { value: "prefer-not", label: "Prefer not to say" },
];

/* ---------------- Fitness profile ---------------- */

export const trainingExperience: Option[] = [
  { value: "none", label: "Not started yet" },
  { value: "under-6m", label: "Under 6 months" },
  { value: "6-12m", label: "6 – 12 months" },
  { value: "1-3y", label: "1 – 3 years" },
  { value: "3y+", label: "3+ years" },
];

export const coachOptions: Option[] = [
  { value: "in-person", label: "Yes, in person" },
  { value: "online", label: "Yes, online" },
  { value: "used-to", label: "I used to" },
  { value: "never", label: "Never" },
];

/* ---------------- Tracking today ---------------- */

export const appsUsed: Option[] = [
  { value: "google-fit", label: "Google Fit" },
  { value: "samsung-health", label: "Samsung Health" },
  { value: "apple-health", label: "Apple Health" },
  { value: "myfitnesspal", label: "MyFitnessPal" },
  { value: "strava", label: "Strava" },
  { value: "fitbit-garmin", label: "Fitbit / Garmin" },
  { value: "other", label: "Something else" },
];

export const appDropReasons: Option[] = [
  { value: "complicated", label: "Too complicated" },
  { value: "motivation", label: "Lost motivation" },
  { value: "no-results", label: "Didn't see results" },
  { value: "expensive", label: "Too expensive" },
  { value: "privacy", label: "Privacy concerns" },
  { value: "never-tried", label: "Never tried one" },
];

/* ---------------- AI body scan ---------------- */

export const scanMeasurements: Option[] = [
  { value: "chest", label: "Chest" },
  { value: "waist", label: "Waist" },
  { value: "hips", label: "Hips" },
  { value: "shoulders", label: "Shoulders" },
  { value: "arms", label: "Arms" },
  { value: "thighs", label: "Thighs" },
  { value: "neck", label: "Neck" },
  { value: "body-fat", label: "Body fat %" },
  { value: "posture", label: "Posture" },
];

export const accuracyNeeds: Option[] = [
  { value: "1cm", label: "Very precise", description: "Within about 1 cm of a tape measure" },
  { value: "2-3cm", label: "Close enough", description: "Within 2 – 3 cm is fine" },
  { value: "trend", label: "Trend only", description: "I care about change over time, not exact numbers" },
  { value: "unsure", label: "Not sure yet", description: "I'd decide after trying it" },
];

export const scanClothing: Option[] = [
  { value: "fitted", label: "Fitted gym wear", icon: Shirt },
  { value: "regular", label: "Regular clothes", icon: Shirt },
  { value: "minimal", label: "Minimal clothing, in private", icon: ShieldCheck },
  { value: "wouldnt", label: "I wouldn't scan", icon: Sparkles },
];

export const photoStorage: Option[] = [
  { value: "on-device", label: "On my phone only", description: "Photos never leave my device", icon: Smartphone },
  { value: "cloud", label: "Encrypted cloud", description: "So my history is backed up", icon: Cloud },
  { value: "delete", label: "Deleted after measuring", description: "Keep only the numbers", icon: Trash2 },
  { value: "no-preference", label: "No preference", description: "Whatever works best", icon: Sparkles },
];

/* ---------------- AI coach ---------------- */

export const coachStyles: Option[] = [
  { value: "encouraging", label: "Encouraging", description: "Friendly, celebrates small wins", emoji: "🤗" },
  { value: "direct", label: "Direct", description: "Straight to the point", emoji: "🎯" },
  { value: "analytical", label: "Analytical", description: "Data, charts and details", emoji: "📊" },
  { value: "minimal", label: "Minimal", description: "Only speaks when I ask", emoji: "🤫" },
];

export const checkInFrequencies: Option[] = [
  { value: "daily", label: "Daily" },
  { value: "few-weekly", label: "A few times a week" },
  { value: "weekly", label: "Weekly" },
  { value: "on-demand", label: "Only when I ask" },
];

export const trustScale: Option[] = [
  { value: "1", label: "Wouldn't trust it", emoji: "🚫" },
  { value: "2", label: "Sceptical", emoji: "🤨" },
  { value: "3", label: "Depends", emoji: "🤔" },
  { value: "4", label: "Mostly trust", emoji: "👍" },
  { value: "5", label: "Fully trust", emoji: "💯" },
];

export const motivators: Option[] = [
  { value: "streaks", label: "Streaks" },
  { value: "body-changes", label: "Seeing body changes" },
  { value: "reminders", label: "Reminders" },
  { value: "friends", label: "Challenges with friends" },
  { value: "rewards", label: "Badges & rewards" },
  { value: "coach-feedback", label: "Coach feedback" },
  { value: "records", label: "Personal records" },
  { value: "unsure", label: "Not sure yet" },
];

export const dietPreferences: Option[] = [
  { value: "none", label: "No preference" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "halal", label: "Halal" },
  { value: "high-protein", label: "High protein" },
  { value: "low-carb", label: "Low carb" },
];

/* ---------------- Features ---------------- */

export const dailyTimes: Option[] = [
  { value: "under-5", label: "Under 5 min" },
  { value: "5-15", label: "5 – 15 min" },
  { value: "15-30", label: "15 – 30 min" },
  { value: "30+", label: "30+ min" },
];

export const labelOf =(list: Option[], value: string) => list.find((o) => o.value === value)?.label ?? value;
