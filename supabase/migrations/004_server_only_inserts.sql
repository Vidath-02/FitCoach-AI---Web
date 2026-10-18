-- FitCoach AI: only the server may write survey responses
--
-- ⚠ Run this ONLY after SUPABASE_SECRET_KEY is set in Vercel and redeployed, and
--   https://<your-site>/api/survey shows "key":"secret". Running it earlier makes
--   every survey submission fail.
--
-- Before: anyone holding the public (publishable) key could insert rows directly
--         through Supabase's REST API, skipping the website's validation.
-- After:  the public key can't read, insert, update or delete anything. Only the
--         API route, using the server-only secret key, can insert.

drop policy if exists "Public can submit survey responses" on public.survey_responses;

revoke all on public.survey_responses from anon, authenticated;

-- RLS stays enabled with no policies, so the public roles are denied by default.
alter table public.survey_responses enable row level security;

-- To undo (re-allow the publishable key to insert), run:
--   create policy "Public can submit survey responses" on public.survey_responses
--     for insert to anon, authenticated with check (consent = true);
--   grant insert on public.survey_responses to anon, authenticated;
