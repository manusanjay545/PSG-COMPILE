create table if not exists public.course_chapter_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  course_slug text not null,
  chapter_index integer not null check (chapter_index >= 0),
  mcq_score smallint not null check (mcq_score = 5),
  coding_passed boolean not null default true check (coding_passed),
  completed_at timestamptz not null default now(),
  primary key (user_id, course_slug, chapter_index)
);

create table if not exists public.course_certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_slug text not null,
  course_title text not null,
  certificate_code uuid not null unique default gen_random_uuid(),
  learner_name text,
  roll_number text,
  college_name text,
  department_name text,
  academic_year text,
  issued_at timestamptz not null default now(),
  unique (user_id, course_slug)
);

create index if not exists course_chapter_progress_user_course_idx
  on public.course_chapter_progress (user_id, course_slug, chapter_index);
create index if not exists course_certificates_user_issued_idx
  on public.course_certificates (user_id, issued_at desc);

alter table public.course_chapter_progress enable row level security;
alter table public.course_certificates enable row level security;

drop policy if exists "Users can view their own course progress" on public.course_chapter_progress;
create policy "Users can view their own course progress"
  on public.course_chapter_progress for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can view their own course certificates" on public.course_certificates;
create policy "Users can view their own course certificates"
  on public.course_certificates for select to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.course_chapter_progress from anon, authenticated;
grant select on public.course_chapter_progress to authenticated;
grant all on public.course_chapter_progress to service_role;
revoke all on public.course_certificates from anon, authenticated;
grant select on public.course_certificates to authenticated;
grant all on public.course_certificates to service_role;
