-- FitCoach AI: survey v4 columns in the analysis view
-- Safe to run at any time. Run once in Supabase: SQL Editor -> New query -> paste -> Run.
--
-- Survey v4 (Nov 2026) follows the v3 project document: it adds three questions
-- (result format, AI coach authority, sharing with a human coach) and replaces the
-- feature list with the planned 26-feature app. Same columns as 005, with new ones
-- appended, so `create or replace` keeps existing exports working.
-- v3 and v4 rows live in the same table: filter on survey_version when comparing.
-- Old feature columns (fi_posture, fi_wearables, ...) stay, and are empty for v4 rows.

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
  coalesce((meta->>'incomplete')::boolean, false)   as incomplete,

  -- v4 additions (appended so existing exports keep their column order)
  answers->>'resultFormat'                            as result_format,
  answers->>'coachAuthority'                          as coach_authority,
  answers->>'humanCoach'                              as human_coach,
  (answers->'featureInterest'->>'body-check')::int        as fi_body_check,
  (answers->'featureInterest'->>'weekly-plan')::int       as fi_weekly_plan,
  (answers->'featureInterest'->>'guided-sessions')::int   as fi_guided_sessions,
  (answers->'featureInterest'->>'set-logging')::int       as fi_set_logging,
  (answers->'featureInterest'->>'plate-calculator')::int  as fi_plate_calculator,
  (answers->'featureInterest'->>'meal-journal')::int      as fi_meal_journal,
  (answers->'featureInterest'->>'recovery')::int          as fi_recovery,
  (answers->'featureInterest'->>'forecasts')::int         as fi_forecasts,
  (answers->'featureInterest'->>'human-coach')::int       as fi_human_coach,
  (answers->'featureInterest'->>'csv-import')::int        as fi_csv_import
from public.survey_responses;

revoke all on public.survey_responses_flat from anon, authenticated;
