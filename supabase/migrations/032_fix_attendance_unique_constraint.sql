-- Migration 032: Fix event_attendance unique constraint for upsert
-- The partial unique index doesn't work with PostgREST upsert onConflict.
-- Re-add a proper unique constraint. Postgres treats NULLs as distinct,
-- so (event_id, NULL) rows for guests won't conflict with each other.

ALTER TABLE public.event_attendance
  ADD CONSTRAINT event_attendance_event_user_unique UNIQUE (event_id, user_id);
