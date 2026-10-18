-- FitCoach AI — survey responses
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
--
-- Security model:
--   * The website inserts with the PUBLISHABLE key (role `anon`).
--   * `anon` may INSERT only. There is no SELECT/UPDATE/DELETE policy, so nobody
--     holding the public key can read, change or delete responses.
--   * You read the data in the Supabase dashboard (Table Editor / SQL Editor),
--     which runs with full privileges.

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
create table if not exists public.survey_responses (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),

  -- Frequently-filtered answers as real columns
  age_range          text not null,
  gender             text,
  occupation         text,
  activity_level     text not null,
  goals              text[] not null default '{}',
  uses_fitness_app   text,
  camera_comfort     smallint check (camera_comfort between 1 and 5),
  privacy_importance smallint check (privacy_importance between 0 and 100),
  pricing            text,
  early_access       boolean not null default false,
  email              text,
  consent            boolean not null,

  -- Every answer, exactly as submitted (email removed). Lets the survey change
  -- without schema migrations.
  answers            jsonb not null,
  -- Submission metadata: timezone, locale, time taken
  meta               jsonb not null default '{}'::jsonb,

  constraint consent_given   check (consent = true),
  constraint email_format    check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'),
  constraint answers_size    check (pg_column_size(answers) < 16000),
  constraint meta_size       check (pg_column_size(meta) < 2000),
  constraint text_lengths    check (
    length(age_range) <= 32 and
    coalesce(length(gender), 0) <= 32 and
    coalesce(length(occupation), 0) <= 32 and
    length(activity_level) <= 32 and
    coalesce(length(uses_fitness_app), 0) <= 8 and
    coalesce(length(pricing), 0) <= 32 and
    coalesce(length(email), 0) <= 254 and
    cardinality(goals) <= 10
  )
);

create index if not exists survey_responses_created_at_idx on public.survey_responses (created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security: insert-only for the public key
-- ---------------------------------------------------------------------------
alter table public.survey_responses enable row level security;

drop policy if exists "Public can submit survey responses" on public.survey_responses;
create policy "Public can submit survey responses"
  on public.survey_responses
  for insert
  to anon, authenticated
  with check (consent = true);

revoke all on public.survey_responses from anon, authenticated;
grant insert on public.survey_responses to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Analysis view: one column per answer, ready for CSV export
-- security_invoker = respects RLS, so the public key can't read through it.
-- ---------------------------------------------------------------------------
create or replace view public.survey_responses_flat
with (security_invoker = true) as
select
  id,
  created_at,
  answers->>'name'                                    as name,
  age_range,
  gender,
  occupation,
  activity_level,
  (answers->>'sessionMinutes')::int                   as session_minutes,
  array_to_string(goals, ', ')                        as goals,
  (select string_agg(x, ', ') from jsonb_array_elements_text(answers->'trainingPlaces') x)     as training_places,
  uses_fitness_app,
  (select string_agg(x, ', ') from jsonb_array_elements_text(answers->'trackingMethods') x)    as tracking_methods,
  (select string_agg(x, ', ') from jsonb_array_elements_text(answers->'measurementMethods') x) as measurement_methods,
  (answers->>'trackingSatisfaction')::int             as tracking_satisfaction,
  answers->>'biggestChallenge'                        as biggest_challenge,
  camera_comfort,
  privacy_importance,
  answers->>'scanFrequency'                           as scan_frequency,
  -- feature interest: 0 = skip, 1 = nice, 2 = must-have, null = not rated
  (answers->'featureInterest'->>'body-measure')::int  as fi_body_measurements,
  (answers->'featureInterest'->>'progress-3d')::int   as fi_3d_progress,
  (answers->'featureInterest'->>'posture')::int       as fi_posture,
  (answers->'featureInterest'->>'workouts')::int      as fi_workouts,
  (answers->'featureInterest'->>'nutrition')::int     as fi_nutrition,
  (answers->'featureInterest'->>'ai-coach')::int      as fi_ai_coach,
  (answers->'featureInterest'->>'wearables')::int     as fi_wearables,
  (answers->'featureInterest'->>'analytics')::int     as fi_analytics,
  (select string_agg(x, ', ') from jsonb_array_elements_text(answers->'platforms') x)          as platforms,
  pricing,
  answers->>'wishlist'                                as wishlist,
  answers->>'feedback'                                as feedback,
  early_access,
  email,
  (meta->>'durationSeconds')::int                     as duration_seconds,
  meta->>'timezone'                                   as timezone
from public.survey_responses;

revoke all on public.survey_responses_flat from anon, authenticated;
