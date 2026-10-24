-- Capture the additional information needed for induction planning and contact consent.

alter table public.join_applications
  add column if not exists skills text not null default '',
  add column if not exists availability text not null default 'Depends on academic schedule',
  add column if not exists whatsapp_consent boolean not null default false;

alter table public.join_applications
  add constraint join_applications_availability_check
  check (availability in (
    '2-4 hours per week',
    '5-8 hours per week',
    '8+ hours per week',
    'Depends on academic schedule'
  ));

alter table public.join_applications
  add constraint join_applications_skills_length_check
  check (char_length(btrim(skills)) <= 3000);
