-- V9: Fix FK cascade on users.client_id to allow client deletion.
-- V1 defined this without ON DELETE CASCADE, so deleting a client
-- fails with a foreign key violation if a users row references it.
-- This sets the client_id to NULL on client deletion, matching
-- the plan_contracts behavior from V3.

ALTER TABLE users
  DROP CONSTRAINT users_client_id_fkey,
  ADD CONSTRAINT users_client_id_fkey
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL;
