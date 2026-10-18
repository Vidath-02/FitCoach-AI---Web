import {
  Bike,
  Briefcase,
  Building2,
  Camera,
  ChartLine,
  Dumbbell,
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
  Sparkles,
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
  { value: "nutrition", label: "Nutrition guidance", description: "Simple, goal-based eating tips", icon: Salad },
  { value: "ai-coach", label: "AI coach chat", description: "Ask questions, get instant answers", icon: MessageCircle },
  { value: "wearables", label: "Wearable sync", description: "Connect your watch or fitness band", icon: Watch },
  { value: "analytics", label: "Progress analytics", description: "Trends, streaks and insights", icon: ChartLine },
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

export const labelOf = (list: Option[], value: string) => list.find((o) => o.value === value)?.label ?? value;
