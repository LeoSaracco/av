-- V11: Add last_read_at to nutrition_threads so the coach notification
-- system can determine unread messages (updated_at > last_read_at).

ALTER TABLE nutrition_threads
  ADD COLUMN IF NOT EXISTS last_read_at TIMESTAMPTZ;
