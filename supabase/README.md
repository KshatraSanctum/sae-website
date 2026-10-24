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
supabase functions deploy submit-join-application
```

The migration seeds the current circuit rules for `interlagos-inspired` / `v2` /
`timed-v1` in both `STANDARD` and `PRO` modes. `start-race` and `submit-score`
validate the signed-in user and race-session token in the function boundary;
`get-leaderboard` is a public read of accepted submissions. The leaderboard view
keeps only the fastest accepted score for each signed-in user and track rule, so
one driver cannot occupy multiple rows with slower attempts. The join form uses
`submit-join-application`, which requires a Google-authenticated session and
upserts one current application per Google account.

## Function secrets

Supabase supplies the project URL and public key environment values to deployed
functions. Keep any service-role or secret key in the Supabase project secrets;
never place it in `.env`, a `VITE_` variable, this repository, or the browser.

## Google OAuth redirect configuration

The frontend now completes OAuth through the local callback route
`/auth/callback`. Configure both the Supabase project and Google Cloud before
testing sign-in:

1. In **Supabase → Authentication → URL Configuration**, set the production
   **Site URL** to the deployed site origin.
2. Add these **Redirect URLs**:
   - `https://<your-production-domain>/auth/callback`
   - `http://localhost:5173/auth/callback`
3. In **Supabase → Authentication → Providers → Google**, make sure the Google
   client ID and secret are enabled.
4. In **Google Cloud → APIs & Services → Credentials**, add Supabase's provider
   callback as an authorized redirect URI:
   `https://<project-ref>.supabase.co/auth/v1/callback`

Do not use the Google Cloud callback URI as the frontend redirect URL. Google
redirects to Supabase first; Supabase then redirects the browser to the
frontend `/auth/callback` route. A missing frontend redirect URL commonly sends
the user back to the app without an active session.

## Local smoke path

1. Sign in through Google OAuth in the development frontend.
2. Call `start-race` with the selected difficulty.
3. Complete a valid local lap and submit the returned session token with the
   lap time and checkpoint times.
4. Read `get-leaderboard` and confirm only `accepted` submissions appear.
5. Visit `/join`, sign in with Google, submit a valid application, and confirm
   the row appears in `public.join_applications`.

The `/track` page now renders the auth and leaderboard panel below the race
arena. A signed-in user starts a remote session when the existing hover + Space
race begins and submits the lap/checkpoint trace when a clean lap finishes.
Local personal-best storage remains available when the remote service is absent
or unavailable.
