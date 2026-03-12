-- Migration 035: Fix RLS infinite recursion across ALL messaging tables
--
-- Problem: Multiple policies check messages → message_recipients → messages,
-- causing infinite recursion when PostgREST evaluates embedded joins.
--
-- Fix: Replace all "messages → message_recipients" checks with
-- "messages → team_members" (team membership) to break the cycle.
-- message_recipients SELECT is made permissive (real access control is on messages).

-- ============================================================================
-- messages: SELECT uses team_members instead of message_recipients
-- ============================================================================
drop policy if exists "Users can read messages they are involved in" on public.messages;
drop policy if exists "Users can view messages they sent or received" on public.messages;
drop policy if exists "Users can read messages in their teams" on public.messages;

create policy "Users can read messages in their teams"
  on public.messages
  for select
  to authenticated
  using (
    sender_id = auth.uid()
    or exists (
      select 1 from public.team_members
      where team_members.team_id = messages.team_id
      and team_members.user_id = auth.uid()
    )
    or exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role::text = 'admin'
    )
  );

-- ============================================================================
-- message_recipients: permissive SELECT (no cross-table reference)
-- ============================================================================
drop policy if exists "Users can view recipients for accessible messages" on public.message_recipients;
drop policy if exists "Users can view recipients they belong to" on public.message_recipients;
drop policy if exists "Authenticated users can view message recipients" on public.message_recipients;
drop policy if exists "Users can view message recipients" on public.message_recipients;

create policy "Authenticated users can view message recipients"
  on public.message_recipients
  for select
  to authenticated
  using (true);

-- ============================================================================
-- message_read_receipts: SELECT uses team_members via messages
-- ============================================================================
drop policy if exists "Users can view read receipts for accessible messages" on public.message_read_receipts;

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
          select 1 from public.team_members
          where team_members.team_id = m.team_id
          and team_members.user_id = auth.uid()
        )
        or exists (
          select 1 from public.users
          where users.id = auth.uid()
          and users.role::text = 'admin'
        )
      )
    )
  );

-- ============================================================================
-- message_reactions: SELECT, INSERT, DELETE use team_members via messages
-- ============================================================================
drop policy if exists "Users can view reactions for accessible messages" on public.message_reactions;

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
          select 1 from public.team_members
          where team_members.team_id = m.team_id
          and team_members.user_id = auth.uid()
        )
        or exists (
          select 1 from public.users
          where users.id = auth.uid()
          and users.role::text = 'admin'
        )
      )
    )
  );

drop policy if exists "Users can add reactions to accessible messages" on public.message_reactions;

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
          select 1 from public.team_members
          where team_members.team_id = m.team_id
          and team_members.user_id = auth.uid()
        )
      )
    )
  );

drop policy if exists "Users can remove their own reactions" on public.message_reactions;

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
          select 1 from public.team_members
          where team_members.team_id = m.team_id
          and team_members.user_id = auth.uid()
        )
      )
    )
  );
