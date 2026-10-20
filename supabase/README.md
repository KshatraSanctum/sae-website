# Supabase backend

This directory contains the database migration and Edge Functions for the
optional race leaderboard. The browser only receives the public project URL and
publishable key; the service-role/secret key must stay in Supabase's server-side
function environment.

## Deploy after linking the project

From the repository root, with the Supabase CLI installed and authenticated:

```bash
supabase link --project-ref <development-project-ref>
supabase db push
supabase functions deploy start-race
supabase functions deploy submit-score
supabase functions deploy get-leaderboard
```

The migration seeds the current circuit rules for `interlagos-inspired` / `v2` /
`timed-v1` in both `STANDARD` and `PRO` modes. `start-race` and `submit-score`
validate the signed-in user and race-session token in the function boundary;
`get-leaderboard` is a public read of accepted submissions.

## Function secrets

Supabase supplies the project URL and public key environment values to deployed
functions. Keep any service-role or secret key in the Supabase project secrets;
never place it in `.env`, a `VITE_` variable, this repository, or the browser.

## Local smoke path

1. Sign in through Google OAuth in the development frontend.
2. Call `start-race` with the selected difficulty.
3. Complete a valid local lap and submit the returned session token with the
   lap time and checkpoint times.
4. Read `get-leaderboard` and confirm only `accepted` submissions appear.

The `/track` page now renders the auth and leaderboard panel below the race
arena. A signed-in user starts a remote session when the existing hover + Space
race begins and submits the lap/checkpoint trace when a clean lap finishes.
Local personal-best storage remains available when the remote service is absent
or unavailable.
