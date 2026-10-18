import { Camera, Dumbbell, LineChart, MessageSquareHeart, Sparkles, UserRound, type LucideIcon } from "lucide-react";
import { AboutYouStep } from "./AboutYouStep";
import { FitnessStep } from "./FitnessStep";
import { TrackingStep } from "./TrackingStep";
import { BodyScanStep } from "./BodyScanStep";
import { FeaturesStep } from "./FeaturesStep";
import { FinalStep } from "./FinalStep";
import type { StepProps } from "../types";

export interface StepDef {
  id: string;
  title: string;
  subtitle: string;
  short: string;
  icon: LucideIcon;
  Component: React.ComponentType<StepProps & { showErrors: boolean }>;
}

/** Order here = order in the survey. Add/remove steps and update `validators` to match. */
export const steps: StepDef[] = [
  {
    id: "about",
    short: "About you",
    title: "First, a little about you.",
    subtitle: "Helps us understand who FitCoach AI is for.",
    icon: UserRound,
    Component: AboutYouStep,
  },
  {
    id: "fitness",
    short: "Fitness profile",
    title: "Your fitness, right now.",
    subtitle: "No judgement — every starting point is valid.",
    icon: Dumbbell,
    Component: FitnessStep,
  },
  {
    id: "tracking",
    short: "Tracking today",
    title: "How you track progress today.",
    subtitle: "This tells us what's broken in current tools.",
    icon: LineChart,
    Component: TrackingStep,
  },
  {
    id: "scan",
    short: "AI body scan",
    title: "Measuring your body with AI.",
    subtitle: "The heart of FitCoach AI — your honest take matters most here.",
    icon: Camera,
    Component: BodyScanStep,
  },
  {
    id: "features",
    short: "Features",
    title: "What should we build first?",
    subtitle: "Your ratings decide our Phase 1 and Phase 2 priorities.",
    icon: Sparkles,
    Component: FeaturesStep,
  },
  {
    id: "final",
    short: "Final thoughts",
    title: "Last step — your ideas.",
    subtitle: "Anything you share here goes straight to the team.",
    icon: MessageSquareHeart,
    Component: FinalStep,
  },
];
