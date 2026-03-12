-- Migration 033: Team Messaging
-- Creates messages, message_recipients, message_read_receipts, message_reactions,
-- message_archives, and device_tokens tables with triggers, indexes, and RLS policies.

-- ============================================================================
-- 1. MESSAGES TABLE
-- ============================================================================

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.users(id),
  team_id uuid not null references public.teams(id),
  parent_message_id uuid references public.messages(id),
  title text not null,
  body text not null,
  created_at timestamp with time zone not null default now()
);

-- ============================================================================
-- 2. MESSAGE RECIPIENTS TABLE
-- ============================================================================

create table public.message_recipients (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  targeting_type text not null check (targeting_type in ('individual', 'whole_team', 'management_team', 'club_admin')),
  recipient_user_ids uuid[] not null,
  notification_pending boolean not null default true
);

-- ============================================================================
-- 3. MESSAGE READ RECEIPTS TABLE
-- ============================================================================

create table public.message_read_receipts (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references public.users(id),
  read_at timestamp with time zone not null default now(),
  unique (message_id, user_id)
);

-- ============================================================================
-- 4. MESSAGE REACTIONS TABLE
-- ============================================================================

create table public.message_reactions (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references public.users(id),
  emoji text not null,
  created_at timestamp with time zone not null default now(),
  unique (message_id, user_id, emoji)
);

-- ============================================================================
-- 5. MESSAGE ARCHIVES TABLE
-- ============================================================================

create table public.message_archives (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references public.users(id),
  archived_at timestamp with time zone not null default now(),
  unique (message_id, user_id)
);

-- ============================================================================
-- 6. DEVICE TOKENS TABLE
-- ============================================================================

create table public.device_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  device_token text not null,
  platform text not null check (platform in ('web', 'android', 'ios')),
  created_at timestamp with time zone not null default now(),
  unique (user_id, device_token)
);

-- ============================================================================
-- 7. TRIGGER: AUTO-CREATE READ RECEIPT FOR SENDER
-- ============================================================================

create or replace function public.fn_sender_auto_read()
returns trigger as $$
begin
  insert into public.message_read_receipts (message_id, user_id, read_at)
  values (NEW.id, NEW.sender_id, now());
  return NEW;
end;
$$ language plpgsql security definer;

create trigger trigger_sender_auto_read
  after insert on public.messages
  for each row
  execute function public.fn_sender_auto_read();

-- ============================================================================
-- 8. INDEXES
-- ============================================================================

-- messages indexes
create index messages_parent_message_id_idx on public.messages(parent_message_id);
create index messages_team_id_created_at_idx on public.messages(team_id, created_at desc);
create index messages_sender_id_idx on public.messages(sender_id);

-- message_recipients indexes
create index message_recipients_message_id_idx on public.message_recipients(message_id);
create index message_recipients_recipient_user_ids_idx on public.message_recipients using gin (recipient_user_ids);

-- message_read_receipts indexes
create index message_read_receipts_message_id_idx on public.message_read_receipts(message_id);
create index message_read_receipts_user_id_idx on public.message_read_receipts(user_id);

-- message_reactions indexes
create index message_reactions_message_id_idx on public.message_reactions(message_id);

-- message_archives indexes
create index message_archives_user_id_idx on public.message_archives(user_id);

-- ============================================================================
-- 9. ROW-LEVEL SECURITY
-- ============================================================================

-- ---------- messages ----------

alter table public.messages enable row level security;

-- SELECT: user can read if sender, in recipient set, or admin
create policy "Users can read messages they are involved in"
  on public.messages
  for select
  to authenticated
  using (
    sender_id = auth.uid()
    or exists (
      select 1 from public.message_recipients mr
      where mr.message_id = messages.id
      and auth.uid() = any(mr.recipient_user_ids)
    )
    or exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role::text = 'admin'
    )
  );

-- INSERT: user can insert if they are a member of the target team
create policy "Team members can send messages to their team"
  on public.messages
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.team_members
      where team_members.team_id = messages.team_id
      and team_members.user_id = auth.uid()
    )
    or exists (
      select 1 from public.user_teams
      where user_teams.team_id = messages.team_id
      and user_teams.user_id = auth.uid()
    )
    or exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role::text = 'admin'
    )
  );

-- ---------- message_recipients ----------

alter table public.message_recipients enable row level security;

-- SELECT: same visibility as messages — user can see recipients for messages they can access
create policy "Users can view recipients for accessible messages"
  on public.message_recipients
  for select
  to authenticated
  using (
    exists (
      select 1 from public.messages m
      where m.id = message_recipients.message_id
      and (
        m.sender_id = auth.uid()
        or auth.uid() = any(message_recipients.recipient_user_ids)
        or exists (
          select 1 from public.users
          where users.id = auth.uid()
          and users.role::text = 'admin'
        )
      )
    )
  );

-- INSERT: allow inserts alongside message creation (same team membership check)
create policy "Users can create recipients for their messages"
  on public.message_recipients
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.messages m
      where m.id = message_recipients.message_id
      and m.sender_id = auth.uid()
    )
  );

-- ---------- message_read_receipts ----------

alter table public.message_read_receipts enable row level security;

-- INSERT: user_id must equal auth.uid()
create policy "Users can only create their own read receipts"
  on public.message_read_receipts
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
  );

-- SELECT: same visibility as messages
create policy "Users can view read receipts for accessible messages"
  on public.message_read_receipts
  for select
  to authenticated
  using (
    exists (
      select 1 from public.messages m
      where m.id = message_read_receipts.message_id
      and (
        m.sender_id = auth.uid()
        or exists (
          select 1 from public.message_recipients mr
          where mr.message_id = m.id
          and auth.uid() = any(mr.recipient_user_ids)
        )
        or exists (
          select 1 from public.users
          where users.id = auth.uid()
          and users.role::text = 'admin'
        )
      )
    )
  );

-- ---------- message_reactions ----------

alter table public.message_reactions enable row level security;

-- INSERT: user_id = auth.uid() AND user is in recipient set or is sender
create policy "Users can add reactions to accessible messages"
  on public.message_reactions
  for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.messages m
      where m.id = message_reactions.message_id
      and (
        m.sender_id = auth.uid()
        or exists (
          select 1 from public.message_recipients mr
          where mr.message_id = m.id
          and auth.uid() = any(mr.recipient_user_ids)
        )
      )
    )
  );

-- DELETE: user_id = auth.uid() AND user is in recipient set or is sender
create policy "Users can remove their own reactions"
  on public.message_reactions
  for delete
  to authenticated
  using (
    user_id = auth.uid()
    and exists (
      select 1 from public.messages m
      where m.id = message_reactions.message_id
      and (
        m.sender_id = auth.uid()
        or exists (
          select 1 from public.message_recipients mr
          where mr.message_id = m.id
          and auth.uid() = any(mr.recipient_user_ids)
        )
      )
    )
  );

-- SELECT: same visibility as messages
create policy "Users can view reactions for accessible messages"
  on public.message_reactions
  for select
  to authenticated
  using (
    exists (
      select 1 from public.messages m
      where m.id = message_reactions.message_id
      and (
        m.sender_id = auth.uid()
        or exists (
          select 1 from public.message_recipients mr
          where mr.message_id = m.id
          and auth.uid() = any(mr.recipient_user_ids)
        )
        or exists (
          select 1 from public.users
          where users.id = auth.uid()
          and users.role::text = 'admin'
        )
      )
    )
  );

-- ---------- message_archives ----------

alter table public.message_archives enable row level security;

-- ALL: user_id = auth.uid()
create policy "Users can manage their own archives"
  on public.message_archives
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------- device_tokens ----------

alter table public.device_tokens enable row level security;

-- ALL: user_id = auth.uid()
create policy "Users can manage their own device tokens"
  on public.device_tokens
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
