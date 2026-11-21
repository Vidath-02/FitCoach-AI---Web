/**
 * Central place for copy, links and dates that are likely to change.
 * Update the roadmap dates here and every section (hero, roadmap, countdown) follows.
 * Content follows the project document "FitCoach AI — Research and Solution Explanation", v3 (21 Nov 2026).
 */

export const site = {
  name: "FitCoach AI",
  tagline: "Train with a plan. Progress with clarity.",
  description:
    "FitCoach AI is an adaptive web gym coach. Two phone photos give your body measurements and a body-fat estimate with an honest likely range, and your plan never changes without your OK. A final-year research project: help shape it by taking the survey.",
  url: "https://fit-coach-ai-web.vercel.app",
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
  { id: "features", label: "Features" },
  { id: "research", label: "Research" },
  { id: "roadmap", label: "Roadmap" },
  { id: "survey", label: "Survey" },
] as const;

/**
 * Milestones the roadmap countdown can point at. The countdown always shows the next one
 * that is still in the future (worked out in the browser), so it never goes stale.
 */
export const countdownMilestones = [
  { label: "Interim demo", date: new Date("2027-01-28T09:00:00+05:30") },
  { label: "Results frozen", date: new Date("2027-03-07T09:00:00+05:30") },
  { label: "Final submission", date: new Date("2027-04-05T09:00:00+05:30") },
];

export type MilestoneStatus = "done" | "active" | "upcoming" | "planned";

export const roadmap: {
  phase: string;
  title: string;
  when: string;
  status: MilestoneStatus;
  summary: string;
  items: { date: string; text: string }[];
}[] = [
  {
    phase: "Phase 0",
    title: "Research & design",
    when: "Oct – Dec 2026",
    status: "active",
    summary:
      "Defining the research gap, the questions and all 26 features, and listening to real gym-goers before building.",
    items: [
      { date: "Oct", text: "Community survey (you're here)" },
      { date: "Nov", text: "Full design: 26 features in five modules" },
      { date: "6 Dec", text: "Supervisor approval; BodyM and NHANES data downloaded" },
    ],
  },
  {
    phase: "Phase 1",
    title: "Baselines & a working body check",
    when: "December 2026",
    status: "upcoming",
    summary: "The two comparison models first, then the body check running end to end inside the app.",
    items: [
      { date: "20 Dec", text: "Model A (no photos) and Model B (standard photo model) built" },
      { date: "31 Dec", text: "Segmentation comparison (N1); body check working end to end" },
    ],
  },
  {
    phase: "Phase 2",
    title: "The new research parts",
    when: "Jan – Feb 2027",
    status: "planned",
    summary:
      "Making the body check robust on home photos, fairer for more body types and honest with checked ranges.",
    items: [
      { date: "24 Jan", text: "“Messy” training (N2) and checked likely ranges (N4)" },
      { date: "28 Jan", text: "Interim demo" },
      { date: "21 Feb", text: "3D body pre-training (N3); final Model C" },
    ],
  },
  {
    phase: "Phase 3",
    title: "Final test & submission",
    when: "Mar – Apr 2027",
    status: "planned",
    summary: "One final test on held-out data, a usability study with demo data, and the write-up.",
    items: [
      { date: "7 Mar", text: "Final test run once; results frozen" },
      { date: "Mid-Mar", text: "Usability study with demo data" },
      { date: "5 Apr", text: "Final submission" },
    ],
  },
];
