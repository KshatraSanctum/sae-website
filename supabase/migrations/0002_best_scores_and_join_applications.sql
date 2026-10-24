-- Keep one visible best score per Google account and persist authenticated
-- society applications behind an Edge Function boundary.

create index if not exists score_submissions_player_rule_idx
  on public.score_submissions (user_id, track_rule_id, validation_status, lap_ms, created_at);

create or replace view public.leaderboard_entries as
with best_per_player as (
  select distinct on (submission.user_id, submission.track_rule_id)
    submission.id,
    submission.user_id,
    submission.track_rule_id,
    submission.lap_ms,
    submission.created_at,
    rules.track_id,
    rules.track_version,
    rules.physics_version,
    rules.difficulty,
    coalesce(nullif(btrim(profile.display_name), ''), 'Driver') as player_name
  from public.score_submissions as submission
  join public.profiles as profile on profile.id = submission.user_id
  join public.track_rules as rules on rules.id = submission.track_rule_id
  where submission.validation_status = 'accepted'
  order by
    submission.user_id,
    submission.track_rule_id,
    submission.lap_ms asc,
    submission.created_at asc,
    submission.id asc
)
select
  best.id,
  best.track_rule_id,
  best.track_id,
  best.track_version,
  best.physics_version,
  best.difficulty,
  best.player_name,
  best.lap_ms as score,
  dense_rank() over (
    partition by best.track_rule_id
    order by best.lap_ms asc
  ) as rank,
  best.created_at,
  jsonb_build_object(
    'trackId', best.track_id,
    'trackVersion', best.track_version,
    'physicsVersion', best.physics_version,
    'difficulty', best.difficulty
  ) as metadata
from best_per_player as best;

create table if not exists public.join_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 2 and 120),
  roll text not null check (char_length(btrim(roll)) between 1 and 80),
  branch text not null check (char_length(btrim(branch)) between 1 and 100),
  year text not null check (char_length(btrim(year)) between 1 and 100),
  email text not null check (char_length(btrim(email)) between 3 and 254),
  phone text not null check (char_length(btrim(phone)) between 5 and 40),
  crew text not null check (char_length(btrim(crew)) between 1 and 120),
  subdomain text not null default '' check (char_length(btrim(subdomain)) <= 120),
  motivation text not null check (char_length(btrim(motivation)) between 20 and 3000),
  status text not null default 'pending'
    check (status in ('pending', 'shortlisted', 'rejected', 'accepted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists join_applications_set_updated_at on public.join_applications;
create trigger join_applications_set_updated_at
before update on public.join_applications
for each row execute function public.set_updated_at();

alter table public.join_applications enable row level security;
revoke all on public.join_applications from anon, authenticated;
