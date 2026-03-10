-- Create events table for schedule management
drop table if exists public.events cascade;

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_type text not null check (event_type in ('game', 'training', 'general')),
  event_date timestamp with time zone not null,
  location text not null,
  
  -- Game-specific fields
  opponent text,
  home_away text check (home_away in ('home', 'away')),
  
  -- Targeting (similar to announcements)
  target_teams uuid[] default '{}',
  target_roles text[] default '{}',
  target_divisions text[] default '{}',
  target_age_groups text[] default '{}',
  
  -- Metadata
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id),
  
  -- Constraints
  check (
    (event_type = 'game' and opponent is not null and home_away is not null) or
    (event_type != 'game')
  )
);

-- Create indexes
create index events_event_date_idx on public.events(event_date);
create index events_event_type_idx on public.events(event_type);
create index events_created_by_idx on public.events(created_by);
create index events_target_teams_idx on public.events using gin(target_teams);

-- Enable RLS
alter table public.events enable row level security;

-- RLS Policies

-- All authenticated users can view events targeted to them
create policy "Users can view events targeted to them"
  on public.events
  for select
  to authenticated
  using (
    -- Admin can see all
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role::text = 'admin'
    )
    or
    -- Event has no targeting (visible to all)
    (
      target_teams = '{}'
      and target_roles = '{}'
      and target_divisions = '{}'
      and target_age_groups = '{}'
    )
    or
    -- User's role matches target_roles
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role::text = any(target_roles)
    )
    or
    -- User is in one of the target teams
    exists (
      select 1 from public.team_members
      where team_members.user_id = auth.uid()
      and team_members.team_id = any(target_teams)
    )
    or
    -- User's team division matches target_divisions
    exists (
      select 1 from public.team_members
      join public.teams on teams.id = team_members.team_id
      where team_members.user_id = auth.uid()
      and teams.division = any(target_divisions)
    )
    or
    -- User's team age group matches target_age_groups
    exists (
      select 1 from public.team_members
      join public.teams on teams.id = team_members.team_id
      where team_members.user_id = auth.uid()
      and teams.age_group = any(target_age_groups)
    )
  );

-- Admins can manage all events
create policy "Admins can manage all events"
  on public.events
  for all
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role::text = 'admin'
    )
  );

-- Coaches and Managers can create events for their teams
create policy "Coaches and Managers can create events"
  on public.events
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role::text in ('coach', 'manager')
    )
    and
    -- All target teams must be teams they're assigned to
    (
      target_teams = '{}'
      or
      not exists (
        select 1 from unnest(target_teams) as team_id
        where team_id not in (
          select team_members.team_id
          from public.team_members
          where team_members.user_id = auth.uid()
        )
      )
    )
  );

-- Coaches and Managers can update their own events
create policy "Coaches and Managers can update their own events"
  on public.events
  for update
  to authenticated
  using (
    created_by = auth.uid()
    and exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role::text in ('coach', 'manager')
    )
  );

-- Coaches and Managers can delete their own events
create policy "Coaches and Managers can delete their own events"
  on public.events
  for delete
  to authenticated
  using (
    created_by = auth.uid()
    and exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role::text in ('coach', 'manager')
    )
  );

-- Create RSVP table for event attendance tracking
create table public.event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  status text not null check (status in ('going', 'not_going', 'maybe', 'no_response')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  unique(event_id, user_id)
);

-- Create indexes for RSVPs
create index event_rsvps_event_id_idx on public.event_rsvps(event_id);
create index event_rsvps_user_id_idx on public.event_rsvps(user_id);

-- Enable RLS on RSVPs
alter table public.event_rsvps enable row level security;

-- Users can view RSVPs for events they can see
create policy "Users can view RSVPs for visible events"
  on public.event_rsvps
  for select
  to authenticated
  using (
    exists (
      select 1 from public.events
      where events.id = event_rsvps.event_id
    )
  );

-- Users can manage their own RSVPs
create policy "Users can manage their own RSVPs"
  on public.event_rsvps
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
