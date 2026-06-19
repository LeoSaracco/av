-- V12: Add client_last_read_at to nutrition_threads so the client
-- notification system can determine unread coach messages.

ALTER TABLE nutrition_threads
  ADD COLUMN IF NOT EXISTS client_last_read_at TIMESTAMPTZ;
