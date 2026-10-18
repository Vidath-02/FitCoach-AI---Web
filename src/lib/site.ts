/**
 * Central place for copy, links and dates that are likely to change.
 * Update the roadmap dates here and every section (hero, roadmap, countdown) follows.
 */

export const site = {
  name: "FitCoach AI",
  tagline: "A new standard in fitness is coming.",
  description:
    "FitCoach AI uses computer vision to estimate body measurements from your phone camera and turns them into personalised, motivating fitness tracking. Help shape it by taking the pre-launch survey.",
  url: "https://fitcoach-ai.vercel.app",
  surveyMinutes: 5,
};

/** The person behind the project, shown in the About section and footer. */
export const creator = {
  name: "Vidath Kumarasiri",
  initials: "VK",
  role: "Final-year Software Engineering undergraduate",
  links: [
    { label: "GitHub", href: "https://github.com/Vidath-02" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/vidath-suweeraka" },
  ],
};

export const nav = [
  { id: "about", label: "About" },
  { id: "vision", label: "Vision" },
  { id: "roadmap", label: "Roadmap" },
  { id: "survey", label: "Survey" },
] as const;

/** Phase 1 target (first or second week of January). Used by the countdown. */
export const PHASE_ONE_DATE = new Date("2027-01-04T09:00:00+05:30");

export type MilestoneStatus = "active" | "upcoming" | "planned";

export const roadmap: {
  phase: string;
  title: string;
  when: string;
  status: MilestoneStatus;
  summary: string;
  items: string[];
}[] = [
  {
    phase: "Phase 0",
    title: "Research & Discovery",
    when: "Oct – Dec 2026",
    status: "active",
    summary:
      "Understanding real people's habits, expectations and concerns before a single feature ships.",
    items: [
      "Community survey (you're here)",
      "Measurement dataset & model research",
      "Requirements and UX prototyping",
    ],
  },
  {
    phase: "Phase 1",
    title: "First Release",
    when: "1st – 2nd week of January 2027",
    status: "upcoming",
    summary:
      "The core experience: scan with your phone camera, get your key body measurements and start tracking.",
    items: [
      "AI body-measurement estimation (front and side capture)",
      "Personal profile & measurement history",
      "Early-access group onboarding",
    ],
  },
  {
    phase: "Phase 2",
    title: "Complete Development",
    when: "Mid-March 2027",
    status: "planned",
    summary:
      "The full FitCoach AI platform, with refined models, rich progress insights and personalised guidance.",
    items: [
      "Progress analytics & visual body timeline",
      "Personalised workout recommendations",
      "Polished, production-ready release",
    ],
  },
];
