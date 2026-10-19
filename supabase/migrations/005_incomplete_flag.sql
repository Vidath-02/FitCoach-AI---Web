-- FitCoach AI: show the `incomplete` flag in the analysis view
-- Safe to run at any time. Run once in Supabase: SQL Editor → New query → paste → Run.
--
-- The API now marks a response `incomplete` when required answers are missing. The
-- website never sends one, so these come from direct API calls (or a very old cached
-- page). Filter them out alongside suspected_bot and fast_submit.
-- Same columns as 003 with one appended, so `create or replace` keeps existing exports working.

create or replace view public.survey_responses_flat
with (security_invoker = true) as
select
  id,
  created_at,
  coalesce(meta->>'surveyVersion', 'v1')              as survey_version,

  -- 1 · About you
  age_range,
  gender,
  answers->>'region'                                  as region,
  occupation,

  -- 2 · Fitness profile
  activity_level,
  answers->>'trainingExperience'                      as training_experience,
  (answers->>'sessionMinutes')::int                   as session_minutes,
  array_to_string(goals, ', ')                        as goals,
  (select string_agg(x, ', ') from jsonb_array_elements_text(answers->'trainingPlaces') x)     as training_places,
  answers->>'hasCoach'                                as has_coach,

  -- 3 · Tracking today
  uses_fitness_app,
  (select string_agg(x, ', ') from jsonb_array_elements_text(answers->'appsUsed') x)           as apps_used,
  (select string_agg(x, ', ') from jsonb_array_elements_text(answers->'appDropReasons') x)     as app_drop_reasons,
  (select string_agg(x, ', ') from jsonb_array_elements_text(answers->'trackingMethods') x)    as tracking_methods,
  (select string_agg(x, ', ') from jsonb_array_elements_text(answers->'measurementMethods') x) as measurement_methods,
  (answers->>'trackingSatisfaction')::int             as tracking_satisfaction,
  answers->>'biggestChallenge'                        as biggest_challenge,

  -- 4 · AI body scan
  camera_comfort,
  (select string_agg(x, ', ') from jsonb_array_elements_text(answers->'scanMeasurements') x)   as scan_measurements,
  answers->>'accuracyNeed'                            as accuracy_need,
  answers->>'scanClothing'                            as scan_clothing,
  answers->>'photoStorage'                            as photo_storage,
  privacy_importance,
  answers->>'scanFrequency'                           as scan_frequency,

  -- 5 · AI coach
  answers->>'coachStyle'                              as coach_style,
  answers->>'checkInFrequency'                        as check_in_frequency,
  nullif(answers->>'aiTrust', '0')::int               as ai_trust,
  (select string_agg(x, ', ') from jsonb_array_elements_text(answers->'motivators') x)         as motivators,
  (select string_agg(x, ', ') from jsonb_array_elements_text(answers->'dietPreference') x)     as diet_preference,

  -- 6 · Features (0 = skip, 1 = nice, 2 = must-have, null = not rated)
  (answers->'featureInterest'->>'body-measure')::int  as fi_body_measurements,
  (answers->'featureInterest'->>'progress-3d')::int   as fi_3d_progress,
  (answers->'featureInterest'->>'posture')::int       as fi_posture,
  (answers->'featureInterest'->>'workouts')::int      as fi_workouts,
  (answers->'featureInterest'->>'nutrition')::int     as fi_meal_planning,
  (answers->'featureInterest'->>'ai-coach')::int      as fi_ai_coach,
  (answers->'featureInterest'->>'wearables')::int     as fi_wearables,
  (answers->'featureInterest'->>'analytics')::int     as fi_analytics,
  (answers->'featureInterest'->>'reminders')::int     as fi_reminders,
  (answers->'featureInterest'->>'community')::int     as fi_community,
  (select string_agg(x, ', ') from jsonb_array_elements_text(answers->'platforms') x)          as platforms,
  answers->>'dailyTime'                               as daily_time,
  pricing,

  -- 7 · Final thoughts
  (answers->>'launchLikelihood')::int                 as launch_likelihood,
  answers->>'wishlist'                                as wishlist,
  answers->>'feedback'                                as feedback,
  early_access,
  coalesce((answers->>'betaTester')::boolean, false)  as beta_tester,

  (meta->>'durationSeconds')::int                     as duration_seconds,
  meta->>'timezone'                                   as timezone,
  coalesce((meta->>'suspectedBot')::boolean, false) as suspected_bot,
  coalesce((meta->>'fastSubmit')::boolean, false)   as fast_submit,
  coalesce((meta->>'incomplete')::boolean, false)   as incomplete
from public.survey_responses;

revoke all on public.survey_responses_flat from anon, authenticated;
