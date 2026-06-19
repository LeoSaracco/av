-- V13: Clean up Leandro's test data so a fresh demo can be recorded.
-- Deletes the client, user, and all cascaded records (threads, notes,
-- assignments, progress, diet assignments, etc.)

-- First, delete the client (cascades to nutrition_threads, assignments,
-- notes, progress_entries, diet_assignments via ON DELETE CASCADE).
-- The users row is set to client_id=NULL via ON DELETE SET NULL (V9).
DELETE FROM clients WHERE email = 'leosaracco@gmail.com';

-- Then delete the orphan user (no longer linked to a client).
DELETE FROM users WHERE email = 'leosaracco@gmail.com';
