-- Create team_members table for managing team rosters
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null check (role in ('player', 'coach')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  -- Ensure a user can only be in a team once
  unique(team_id, user_id)
);

-- Create indexes for better query performance
create index if not exists team_members_team_id_idx on public.team_members(team_id);
create index if not exists team_members_user_id_idx on public.team_members(user_id);

-- Enable RLS
alter table public.team_members enable row level security;

-- RLS Policies
-- Allow authenticated users to read team members
create policy "Allow authenticated users to read team members"
  on public.team_members
  for select
  to authenticated
  using (true);

-- Allow admins and coaches to manage team members
create policy "Allow admins to manage team members"
  on public.team_members
  for all
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role in ('admin', 'coach')
    )
  );
