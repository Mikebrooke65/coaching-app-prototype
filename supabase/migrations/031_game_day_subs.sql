-- Migration 031: Game Day Subs
-- Creates event_attendance, game_times, and substitution_events tables
-- Adds game_players and half_duration to teams table
-- Sets default half_duration based on age_group

-- ============================================================================
-- 1. EVENT ATTENDANCE TABLE
-- ============================================================================

create table public.event_attendance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  guest_name text,
  attended boolean not null default true,
  recorded_at timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),

  -- One attendance record per rostered player per event
  constraint event_attendance_unique_user unique (event_id, user_id),
  -- Must identify either a rostered player or a guest
  constraint event_attendance_player_check check (user_id is not null or guest_name is not null)
);

-- Partial unique index: only enforce uniqueness where user_id is not null
-- (the table-level unique constraint already handles this, but we drop it and use a partial index instead)
alter table public.event_attendance drop constraint event_attendance_unique_user;
create unique index event_attendance_unique_user_idx
  on public.event_attendance (event_id, user_id)
  where user_id is not null;

-- Index for querying attendance by event
create index event_attendance_event_id_idx on public.event_attendance(event_id);


-- ============================================================================
-- 2. GAME TIMES TABLE
-- ============================================================================

create table public.game_times (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  kick_off_time timestamp with time zone,
  second_half_start_time timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),

  -- One game_times record per event
  constraint game_times_unique_event unique (event_id)
);

-- Index for querying game times by event
create index game_times_event_id_idx on public.game_times(event_id);

-- ============================================================================
-- 3. SUBSTITUTION EVENTS TABLE
-- ============================================================================

create table public.substitution_events (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  player_off_id uuid references public.users(id),
  player_off_guest_name text,
  player_on_id uuid references public.users(id),
  player_on_guest_name text,
  game_minute integer not null,
  half integer not null check (half in (1, 2)),
  strategy_used text not null check (strategy_used in ('random', 'coach')),
  recorded_at timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id)
);

-- Index for querying substitution events by event
create index substitution_events_event_id_idx on public.substitution_events(event_id);

-- ============================================================================
-- 4. ALTER TEAMS TABLE — add game_players and half_duration
-- ============================================================================

alter table public.teams
  add column game_players integer check (game_players >= 1),
  add column half_duration integer check (half_duration >= 1);

-- ============================================================================
-- 5. SET DEFAULT half_duration FOR EXISTING TEAMS
-- ============================================================================

update public.teams set half_duration = 15 where age_group in ('U4', 'U5', 'U6');
update public.teams set half_duration = 20 where age_group in ('U7', 'U8');
update public.teams set half_duration = 25 where age_group in ('U9', 'U10');
update public.teams set half_duration = 30 where age_group in ('U11', 'U12');
update public.teams set half_duration = 35 where age_group in ('U13', 'U14');
update public.teams set half_duration = 45 where age_group in ('U15', 'U16', 'U17', 'Senior');


-- ============================================================================
-- 6. RLS POLICIES
-- ============================================================================

-- ---------- event_attendance ----------

alter table public.event_attendance enable row level security;

-- Authenticated users can read attendance for events they can see
create policy "Users can view attendance for visible events"
  on public.event_attendance
  for select
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = event_attendance.event_id
    )
  );

-- Admins can manage all attendance records
create policy "Admins can manage all attendance"
  on public.event_attendance
  for all
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role::text = 'admin'
    )
  );

-- Coaches/managers can insert attendance records
create policy "Coaches and managers can insert attendance"
  on public.event_attendance
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role::text in ('coach', 'manager')
    )
  );

-- Coaches/managers can update attendance records
create policy "Coaches and managers can update attendance"
  on public.event_attendance
  for update
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role::text in ('coach', 'manager')
    )
  );

-- Coaches/managers can delete attendance records
create policy "Coaches and managers can delete attendance"
  on public.event_attendance
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role::text in ('coach', 'manager')
    )
  );

-- ---------- game_times ----------

alter table public.game_times enable row level security;

-- Authenticated users can read game times for events they can see
create policy "Users can view game times for visible events"
  on public.game_times
  for select
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = game_times.event_id
    )
  );

-- Admins can manage all game times
create policy "Admins can manage all game times"
  on public.game_times
  for all
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role::text = 'admin'
    )
  );

-- Coaches/managers can insert game times
create policy "Coaches and managers can insert game times"
  on public.game_times
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role::text in ('coach', 'manager')
    )
  );

-- Coaches/managers can update game times
create policy "Coaches and managers can update game times"
  on public.game_times
  for update
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role::text in ('coach', 'manager')
    )
  );

-- Coaches/managers can delete game times
create policy "Coaches and managers can delete game times"
  on public.game_times
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role::text in ('coach', 'manager')
    )
  );

-- ---------- substitution_events ----------

alter table public.substitution_events enable row level security;

-- Authenticated users can read substitution events for events they can see
create policy "Users can view substitution events for visible events"
  on public.substitution_events
  for select
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = substitution_events.event_id
    )
  );

-- Admins can manage all substitution events
create policy "Admins can manage all substitution events"
  on public.substitution_events
  for all
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role::text = 'admin'
    )
  );

-- Coaches/managers can insert substitution events
create policy "Coaches and managers can insert substitution events"
  on public.substitution_events
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role::text in ('coach', 'manager')
    )
  );

-- Coaches/managers can update substitution events
create policy "Coaches and managers can update substitution events"
  on public.substitution_events
  for update
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role::text in ('coach', 'manager')
    )
  );

-- Coaches/managers can delete substitution events
create policy "Coaches and managers can delete substitution events"
  on public.substitution_events
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role::text in ('coach', 'manager')
    )
  );
