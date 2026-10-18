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
│  └─ api/survey/route.ts   # receives survey responses → optional webhook
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

## Collecting survey responses

Responses are POSTed to `/api/survey`. Set `SURVEY_WEBHOOK_URL` (see `.env.example`) to forward each response as JSON to any endpoint — e.g. a Google Apps Script web app writing to Google Sheets, Formspree, Make/Zapier, or your own database. Without it, responses are logged to the server console (useful for local testing).

The survey also saves an in-progress draft to `localStorage`, so visitors can refresh and resume.

## Deploying

- **Vercel:** import the repo — no config needed. Add `SURVEY_WEBHOOK_URL` under Project → Settings → Environment Variables.
- **Netlify:** `netlify.toml` is included (uses `@netlify/plugin-nextjs`). Add `SURVEY_WEBHOOK_URL` under Site settings → Environment variables.
