-- Drop existing tables if they exist (for clean migration)
drop table if exists public.game_feedback cascade;
drop table if exists public.games cascade;

-- Create games table for match/game management
create table public.games (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  opponent text not null,
  game_date timestamp with time zone not null,
  venue text not null,
  home_away text not null check (home_away in ('home', 'away')),
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  team_score integer,
  opponent_score integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  created_by uuid references public.users(id),
  updated_by uuid references public.users(id)
);

-- Create indexes for games table
create index games_team_id_idx on public.games(team_id);
create index games_game_date_idx on public.games(game_date);
create index games_status_idx on public.games(status);

-- Enable RLS on games
alter table public.games enable row level security;

-- Create game_feedback table for recording feedback on games
create table public.game_feedback (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  feedback_type text not null check (feedback_type in ('team', 'player')),
  player_id uuid references public.users(id),
  feedback_text text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  created_by uuid not null references public.users(id),
  updated_by uuid references public.users(id),
  
  -- Ensure player_id is provided when feedback_type is 'player'
  check (
    (feedback_type = 'team' and player_id is null) or
    (feedback_type = 'player' and player_id is not null)
  )
);

-- Create indexes for game_feedback table
create index game_feedback_game_id_idx on public.game_feedback(game_id);
create index game_feedback_team_id_idx on public.game_feedback(team_id);
create index game_feedback_player_id_idx on public.game_feedback(player_id);
create index game_feedback_created_by_idx on public.game_feedback(created_by);

-- Enable RLS on game_feedback
alter table public.game_feedback enable row level security;

-- RLS Policies for games table

-- Admins can see all games
create policy "Admins can view all games"
  on public.games
  for select
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role = 'admin'
    )
  );

-- Coaches can see games for teams they coach
create policy "Coaches can view their team games"
  on public.games
  for select
  to authenticated
  using (
    exists (
      select 1 from public.team_members
      where team_members.team_id = games.team_id
      and team_members.user_id = auth.uid()
      and team_members.role = 'coach'
    )
  );

-- Managers can see games for teams they manage
create policy "Managers can view their team games"
  on public.games
  for select
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role = 'manager'
      and exists (
        select 1 from public.team_members
        where team_members.team_id = games.team_id
        and team_members.user_id = auth.uid()
      )
    )
  );

-- Admins can manage all games
create policy "Admins can manage all games"
  on public.games
  for all
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role = 'admin'
    )
  );

-- Coaches and Managers can create games for their teams
create policy "Coaches and Managers can create games"
  on public.games
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.users
      join public.team_members on team_members.user_id = users.id
      where users.id = auth.uid()
      and users.role in ('coach', 'manager')
      and team_members.team_id = games.team_id
    )
  );

-- Coaches and Managers can update games for their teams
create policy "Coaches and Managers can update games"
  on public.games
  for update
  to authenticated
  using (
    exists (
      select 1 from public.users
      join public.team_members on team_members.user_id = users.id
      where users.id = auth.uid()
      and users.role in ('coach', 'manager')
      and team_members.team_id = games.team_id
    )
  );

-- RLS Policies for game_feedback table

-- Admins can see all feedback
create policy "Admins can view all game feedback"
  on public.game_feedback
  for select
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role = 'admin'
    )
  );

-- Coaches can see feedback for teams they coach
create policy "Coaches can view their team game feedback"
  on public.game_feedback
  for select
  to authenticated
  using (
    exists (
      select 1 from public.team_members
      where team_members.team_id = game_feedback.team_id
      and team_members.user_id = auth.uid()
      and team_members.role = 'coach'
    )
  );

-- Managers can see feedback for teams they manage
create policy "Managers can view their team game feedback"
  on public.game_feedback
  for select
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role = 'manager'
      and exists (
        select 1 from public.team_members
        where team_members.team_id = game_feedback.team_id
        and team_members.user_id = auth.uid()
      )
    )
  );

-- Admins can manage all feedback
create policy "Admins can manage all game feedback"
  on public.game_feedback
  for all
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role = 'admin'
    )
  );

-- Coaches and Managers can create feedback for their teams
create policy "Coaches and Managers can create game feedback"
  on public.game_feedback
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.users
      join public.team_members on team_members.user_id = users.id
      where users.id = auth.uid()
      and users.role in ('coach', 'manager')
      and team_members.team_id = game_feedback.team_id
    )
  );

-- Coaches and Managers can update their own feedback
create policy "Coaches and Managers can update their own game feedback"
  on public.game_feedback
  for update
  to authenticated
  using (
    game_feedback.created_by = auth.uid()
    and exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role in ('coach', 'manager')
    )
  );

-- Coaches and Managers can delete their own feedback
create policy "Coaches and Managers can delete their own game feedback"
  on public.game_feedback
  for delete
  to authenticated
  using (
    game_feedback.created_by = auth.uid()
    and exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role in ('coach', 'manager')
    )
  );
