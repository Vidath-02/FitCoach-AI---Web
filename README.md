# FitCoach AI — Pre-launch Web

Pre-launch landing page and interactive research survey for **FitCoach AI**, an AI-powered platform for computer-vision body measurement and fitness tracking (final-year university research project).

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · React Three Fiber / Three.js · Lenis smooth scrolling

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck
```

> `npm run dev` uses webpack (`next dev --webpack`) because Turbopack's dev server currently fails to load `next/font/google` files in some paths. Production builds use Turbopack as normal.

## Project structure

```
src/
├─ app/
│  ├─ layout.tsx            # fonts, metadata, smooth scroll provider
│  ├─ page.tsx              # section composition
│  ├─ globals.css           # design tokens (@theme), utilities, slider styles
│  └─ api/survey/route.ts   # validates survey responses → Supabase insert
├─ components/
│  ├─ layout/               # Navbar, Footer, ScrollProgress, AmbientBackground, SmoothScroll
│  ├─ sections/             # Hero, KeywordMarquee, About, VisionMission, Roadmap, SurveySection
│  ├─ survey/
│  │  ├─ Survey.tsx         # state, persistence, transitions, validation, submit
│  │  ├─ controls.tsx       # OptionCards, Chips, RangeSlider, EmojiScale, FeatureRating, Toggle…
│  │  ├─ options.ts         # all answer options (edit questions here)
│  │  ├─ steps/             # one file per step + steps/index.ts (order & titles)
│  │  ├─ validation.ts      # required-answer rules per step
│  │  └─ types.ts           # SurveyAnswers shape + defaults
│  ├─ three/
│  │  ├─ SceneCanvas.tsx    # lazy, client-only, pauses off-screen, WebGL fallback
│  │  ├─ BodyScanScene.tsx  # R3F scene: point-cloud body + GLSL scan beam
│  │  └─ bodyPoints.ts      # procedural human point sampler (swap for a GLTF later)
│  └─ ui/                   # Button (magnetic), Reveal/SplitText, SpotlightCard, ScrollText, Countdown…
└─ lib/
   ├─ site.ts               # copy, nav, roadmap dates, Phase 1 countdown target
   ├─ submitSurvey.ts       # client → /api/survey
   ├─ supabase/server.ts    # server-only Supabase client
   └─ useScrollTo.ts        # Lenis-aware section scrolling
```

## Common edits

| Want to change… | Edit |
| --- | --- |
| Roadmap dates / countdown target | `src/lib/site.ts` (`roadmap`, `PHASE_ONE_DATE`) |
| Survey questions or options | `src/components/survey/options.ts` and the matching file in `steps/` |
| Which answers are required | `src/components/survey/validation.ts` |
| Colours, fonts, animation tokens | `@theme` block in `src/app/globals.css` |
| Add another 3D element | create a scene in `components/three/` and load it via `dynamic()` like `SceneCanvas.tsx` |

## Collecting survey responses (Supabase)

Responses are POSTed to `/api/survey`, validated on the server, and inserted into the Supabase table `public.survey_responses`.

**One-time setup**

1. Supabase Dashboard → **SQL Editor** → run each file in [`supabase/migrations/`](supabase/migrations/) in order (`001_…`, then `002_…`). Paste the file contents into a new query and click **Run**.
2. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (Project Settings → API Keys).

**Security:** the publishable key can only **insert** rows (Row Level Security, no read/update/delete policy), so nobody can read responses through the public API. Optionally set the server-only `SUPABASE_SECRET_KEY`; the API route then uses it instead.

**Reading the data:** Table Editor → `survey_responses` for raw rows, or query the `survey_responses_flat` view in the SQL Editor (one column per answer, feature ratings as 0/1/2, and a `survey_version` column so v1 and v2 responses can be separated) and use *Export → CSV* for analysis.

Without Supabase env vars, responses are only logged to the server console (handy for local testing). The survey also saves an in-progress draft to `localStorage`, so visitors can refresh and resume.

## Deploying

Add the same Supabase env vars to your host:

- **Vercel:** import the repo, then Project → Settings → Environment Variables.
- **Netlify:** `netlify.toml` is included (uses `@netlify/plugin-nextjs`); Site settings → Environment variables.
