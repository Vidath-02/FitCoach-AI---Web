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
│  ├─ api/survey/route.ts   # origin + rate limit + validation → Supabase insert
│  └─ privacy/page.tsx      # plain-language privacy notice
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
   ├─ surveySanitize.ts     # allow-list validation for every answer
   ├─ rateLimit.ts          # in-memory per-device rate limiter
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

1. Supabase Dashboard → **SQL Editor** → run `001`, `002`, `003` and `005` from [`supabase/migrations/`](supabase/migrations/) in order. Paste each file's contents into a new query and click **Run**.
2. Copy `.env.example` to `.env.local` and fill in the Supabase URL and keys (Project Settings → API Keys).

**Reading the data**

- `survey_responses_flat`: one column per answer, anonymous (no name or email). Use this for analysis and *Export → CSV*. Filter `survey_version = 'v2'` for the 7-step survey and check `suspected_bot` / `fast_submit`.
- `survey_contacts`: only people who opted in to early access or beta testing. Export it separately and keep it private.

Without Supabase env vars, responses are only logged in local dev; in production the API refuses to report success. Unfinished answers are saved only in the visitor's browser (`localStorage`) and cleared on submit.

## Security and data protection

| Layer | What it does |
| --- | --- |
| Security headers (`next.config.ts`) | Content Security Policy, no framing (clickjacking), `nosniff`, strict referrer, camera/mic/location disabled, HSTS |
| API route (`src/app/api/survey/route.ts`) | Same-origin check, JSON only, 20 KB body cap, rate limits on stored responses (5 per browser tab and 150 per IP per 10 min, so shared campus or mobile IPs still work), no caching |
| Validation (`src/lib/surveySanitize.ts`) | Allow-list: unknown fields dropped, choices must match real options, numbers clamped, text length-limited and stripped of control characters |
| Bot handling | Hidden honeypot field, a minimum completion time and a server-side completeness check. Suspicious responses are **saved with a flag (`suspected_bot`, `fast_submit`, `incomplete`), never dropped** |
| Database (Supabase RLS) | The public key can never read data. After migration 004 it can't write either: only the server can insert |
| Data minimisation | Emails stored only on opt-in, kept out of the analysis view; IPs never stored; no cookies or trackers |
| Privacy notice | Plain-language page at `/privacy`, linked from the consent box and footer |

**Hardening the database (do these in order):**

1. Supabase → Project Settings → API Keys → copy the **secret** key (`sb_secret_...`).
2. Add it in Vercel as `SUPABASE_SECRET_KEY` (Project → Settings → Environment Variables), then redeploy.
3. Open `https://<your-site>/api/survey` and confirm it shows `"key":"secret"`.
4. Only then run `supabase/migrations/004_server_only_inserts.sql`. Running it before step 3 makes submissions fail.

## Deploying

Add the same Supabase env vars to your host (including `SUPABASE_SECRET_KEY`):

- **Vercel:** import the repo, then Project → Settings → Environment Variables.
- **Netlify:** `netlify.toml` is included (uses `@netlify/plugin-nextjs`); Site settings → Environment variables.
