-- Leaderboard foundation for the Interlagos-inspired circuit.
-- Race-session and score writes are performed by Edge Functions with the service role.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Driver'
    check (char_length(btrim(display_name)) between 1 and 80),
  role text not null default 'player'
    check (role in ('player', 'moderator', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.track_rules (
  id uuid primary key default gen_random_uuid(),
  track_id text not null
    check (char_length(btrim(track_id)) between 1 and 80),
  track_version text not null
    check (char_length(btrim(track_version)) between 1 and 40),
  physics_version text not null
    check (char_length(btrim(physics_version)) between 1 and 80),
  difficulty text not null
    check (difficulty in ('STANDARD', 'PRO')),
  min_lap_ms integer not null check (min_lap_ms > 0),
  min_checkpoint_ms integer not null check (min_checkpoint_ms > 0),
  max_forward_step_pct numeric(8, 6) not null
    check (max_forward_step_pct between 0 and 1),
  max_reverse_step_pct numeric(8, 6) not null
    check (max_reverse_step_pct between 0 and 1),
  max_reverse_progress numeric(8, 6) not null
    check (max_reverse_progress between 0 and 1),
  tolerance integer not null check (tolerance >= 0),
  checkpoint_rules jsonb not null
    check (
      jsonb_typeof(checkpoint_rules) = 'object'
      and checkpoint_rules ?& array['s1', 's2', 's3']
    ),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (track_id, track_version, physics_version, difficulty)
);

create unique index if not exists track_rules_one_active_per_difficulty
  on public.track_rules (track_id, difficulty)
  where active;

create table if not exists public.race_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  track_rule_id uuid not null references public.track_rules(id),
  session_token_hash text not null unique
    check (session_token_hash ~ '^[0-9a-f]{64}$'),
  track_rules_snapshot jsonb not null
    check (jsonb_typeof(track_rules_snapshot) = 'object'),
  status text not null default 'active'
    check (status in ('active', 'completed', 'expired', 'cancelled')),
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  check (expires_at > started_at),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id, track_rule_id)
);

create table if not exists public.score_submissions (
  id uuid primary key default gen_random_uuid(),
  race_session_id uuid not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  track_rule_id uuid not null references public.track_rules(id),
  lap_ms integer not null check (lap_ms > 0),
  checkpoint_times jsonb
    check (checkpoint_times is null or jsonb_typeof(checkpoint_times) = 'object'),
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object'),
  validation_status text not null default 'pending'
    check (validation_status in ('pending', 'accepted', 'flagged', 'rejected')),
  validation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint score_submissions_session_owner_rule_fkey
    foreign key (race_session_id, user_id, track_rule_id)
    references public.race_sessions (id, user_id, track_rule_id)
    on delete cascade
);

create index if not exists race_sessions_user_status_idx
  on public.race_sessions (user_id, status, expires_at);

create index if not exists score_submissions_leaderboard_idx
  on public.score_submissions (track_rule_id, validation_status, lap_ms, created_at);

create unique index if not exists score_submissions_one_per_session
  on public.score_submissions (race_session_id);

create or replace view public.leaderboard_entries as
select
  submission.id,
  submission.track_rule_id,
  rules.track_id,
  rules.track_version,
  rules.physics_version,
  rules.difficulty,
  coalesce(nullif(btrim(profile.display_name), ''), 'Driver') as player_name,
  submission.lap_ms as score,
  dense_rank() over (
    partition by submission.track_rule_id
    order by submission.lap_ms asc
  ) as rank,
   submission.created_at,
   jsonb_build_object(
     'trackId', rules.track_id,
     'trackVersion', rules.track_version,
     'physicsVersion', rules.physics_version,
     'difficulty', rules.difficulty
   ) as metadata
from public.score_submissions as submission
join public.profiles as profile on profile.id = submission.user_id
join public.track_rules as rules on rules.id = submission.track_rule_id
where submission.validation_status = 'accepted';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  fallback_name text;
begin
  fallback_name := left(
    coalesce(
      nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''),
      nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(btrim(new.raw_user_meta_data ->> 'name'), ''),
      nullif(btrim(split_part(coalesce(new.email, ''), '@', 1)), ''),
      'Driver'
    ),
    80
  );

  insert into public.profiles (id, display_name)
  values (new.id, fallback_name)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists track_rules_set_updated_at on public.track_rules;
create trigger track_rules_set_updated_at
before update on public.track_rules
for each row execute function public.set_updated_at();

drop trigger if exists race_sessions_set_updated_at on public.race_sessions;
create trigger race_sessions_set_updated_at
before update on public.race_sessions
for each row execute function public.set_updated_at();

drop trigger if exists score_submissions_set_updated_at on public.score_submissions;
create trigger score_submissions_set_updated_at
before update on public.score_submissions
for each row execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.track_rules enable row level security;
alter table public.race_sessions enable row level security;
alter table public.score_submissions enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists profiles_update_own_display_name on public.profiles;
create policy profiles_update_own_display_name
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists track_rules_read_active on public.track_rules;
create policy track_rules_read_active
on public.track_rules
for select
to anon, authenticated
using (active = true);

revoke all on public.profiles from anon, authenticated;
revoke all on public.track_rules from anon, authenticated;
revoke all on public.race_sessions from anon, authenticated;
revoke all on public.score_submissions from anon, authenticated;
revoke all on public.leaderboard_entries from anon, authenticated;

grant usage on schema public to anon, authenticated;
grant select on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;
grant select on public.track_rules to anon, authenticated;
grant select on public.leaderboard_entries to anon, authenticated;

insert into public.track_rules (
  track_id,
  track_version,
  physics_version,
  difficulty,
  min_lap_ms,
  min_checkpoint_ms,
  max_forward_step_pct,
  max_reverse_step_pct,
  max_reverse_progress,
  tolerance,
  checkpoint_rules,
  active
)
values
(
  'interlagos-inspired',
  'v2',
  'timed-v1',
  'STANDARD',
  10000,
  300,
  0.037,
  0.0123,
  0.035,
  40,
  '{"s1":{"startPct":0.28,"endPct":0.35},"s2":{"startPct":0.67,"endPct":0.74},"s3":{"startPct":0.79,"endPct":0.86}}'::jsonb,
  true
),
(
  'interlagos-inspired',
  'v2',
  'timed-v1',
  'PRO',
  10000,
  300,
  0.037,
  0.0123,
  0.035,
  32,
  '{"s1":{"startPct":0.28,"endPct":0.35},"s2":{"startPct":0.67,"endPct":0.74},"s3":{"startPct":0.79,"endPct":0.86}}'::jsonb,
  true
)
on conflict (track_id, track_version, physics_version, difficulty)
do update set
  min_lap_ms = excluded.min_lap_ms,
  min_checkpoint_ms = excluded.min_checkpoint_ms,
  max_forward_step_pct = excluded.max_forward_step_pct,
  max_reverse_step_pct = excluded.max_reverse_step_pct,
  max_reverse_progress = excluded.max_reverse_progress,
  tolerance = excluded.tolerance,
  checkpoint_rules = excluded.checkpoint_rules,
  active = excluded.active,
  updated_at = now();
