-- V14: DBA optimisations — improved SPs, materialised views, performance indexes,
--       and immediate cleanup of orphan records.

-- =============================================================================
-- 1. STORED PROCEDURES
-- =============================================================================

-- 1.1 Improved sp_delete_client_by_email (replaces V7).
--     Now also removes audit_events and email_verification_tokens.
CREATE OR REPLACE FUNCTION sp_delete_client_by_email(target_email TEXT)
RETURNS TEXT AS $$
DECLARE
    target_client_id UUID;
    target_user_id UUID;
    contract_count INT;
    payment_count   INT;
    onboarding_count INT;
    token_count     INT;
    note_count      INT;
    thread_count    INT;
    audit_count     INT;
    email_token_count INT;
BEGIN
    SELECT id INTO target_client_id FROM clients WHERE email = target_email;
    IF target_client_id IS NULL THEN
        RETURN 'Cliente ' || target_email || ' no encontrado';
    END IF;

    SELECT id INTO target_user_id FROM users WHERE email = target_email;

    -- plan_contracts: email has no FK, explicit delete
    SELECT COUNT(*) INTO contract_count FROM plan_contracts WHERE email = target_email;
    DELETE FROM plan_contracts WHERE email = target_email;

    -- payments (cascade exists, explicit for counting)
    SELECT COUNT(*) INTO payment_count FROM payments WHERE client_id = target_client_id;
    DELETE FROM payments WHERE client_id = target_client_id;

    -- onboarding_submissions (cascade exists, explicit for counting)
    SELECT COUNT(*) INTO onboarding_count FROM onboarding_submissions WHERE client_id = target_client_id;
    DELETE FROM onboarding_submissions WHERE client_id = target_client_id;

    -- refresh_tokens
    SELECT COUNT(*) INTO token_count FROM refresh_tokens WHERE user_id = target_user_id;
    IF target_user_id IS NOT NULL THEN
        DELETE FROM refresh_tokens WHERE user_id = target_user_id;
    END IF;

    -- audit_events — no FK, explicit cleanup
    SELECT COUNT(*) INTO audit_count FROM audit_events
        WHERE client_id = target_client_id OR actor_user_id = target_user_id;
    DELETE FROM audit_events WHERE client_id = target_client_id OR actor_user_id = target_user_id;

    -- email_verification_tokens — no FK, explicit cleanup
    SELECT COUNT(*) INTO email_token_count FROM email_verification_tokens WHERE email = target_email;
    DELETE FROM email_verification_tokens WHERE email = target_email;

    -- users (SET NULL FK, explicit delete needed)
    DELETE FROM users WHERE email = target_email;

    -- count before cascade
    SELECT COUNT(*) INTO note_count FROM notes WHERE client_id = target_client_id;
    SELECT COUNT(*) INTO thread_count FROM nutrition_threads WHERE client_id = target_client_id;

    -- clients (cascade handles assignments, notes, progress, diet_assignments, threads, onboarding, payments)
    DELETE FROM clients WHERE email = target_email;

    RETURN 'Cliente ' || target_email || ' eliminado. ' ||
           'Contracts: ' || contract_count || ', ' ||
           'Payments: ' || payment_count || ', ' ||
           'Onboardings: ' || onboarding_count || ', ' ||
           'Tokens: ' || token_count || ', ' ||
           'AuditEvents: ' || audit_count || ', ' ||
           'EmailTokens: ' || email_token_count || ', ' ||
           'Notes: ' || note_count || ', ' ||
           'Threads: ' || thread_count;
END;
$$ LANGUAGE plpgsql;

-- 1.2 Cleanup orphan audit_events (no FK constraint).
CREATE OR REPLACE FUNCTION sp_cleanup_orphan_audits()
RETURNS TEXT AS $$
DECLARE
    cnt INT;
BEGIN
    DELETE FROM audit_events
        WHERE client_id IS NOT NULL
          AND client_id NOT IN (SELECT id FROM clients);
    GET DIAGNOSTICS cnt = ROW_COUNT;
    RETURN cnt || ' audit_events huérfanos eliminados';
END;
$$ LANGUAGE plpgsql;

-- 1.3 Cleanup orphan email_verification_tokens.
CREATE OR REPLACE FUNCTION sp_cleanup_orphan_tokens()
RETURNS TEXT AS $$
DECLARE
    cnt INT;
BEGIN
    DELETE FROM email_verification_tokens
        WHERE email NOT IN (SELECT email FROM users UNION SELECT email FROM coaches);
    GET DIAGNOSTICS cnt = ROW_COUNT;
    RETURN cnt || ' tokens huérfanos eliminados';
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 2. VIEWS
-- =============================================================================

-- 2.1 Unified client summary (avoids N+1 in CoachServiceImpl.getNotifications).
CREATE OR REPLACE VIEW v_client_summary AS
SELECT
    c.id            AS client_id,
    c.name          AS client_name,
    c.email         AS client_email,
    c.phone,
    c.goal,
    c.status,
    c.join_date,
    a.routine_id,
    r.name          AS routine_name,
    da.diet_id,
    d.name          AS diet_name,
    nt.id           AS thread_id,
    nt.messages     AS thread_messages,
    nt.updated_at   AS thread_updated_at,
    nt.last_read_at AS thread_last_read_at,
    nt.client_last_read_at
FROM clients c
LEFT JOIN assignments a   ON a.client_id = c.id AND a.active = true
LEFT JOIN routines r      ON r.id = a.routine_id
LEFT JOIN diet_assignments da ON da.client_id = c.id AND da.active = true
LEFT JOIN diets d         ON d.id = da.diet_id
LEFT JOIN nutrition_threads nt ON nt.client_id = c.id;

-- 2.2 Unread threads for the coach notification bell.
CREATE OR REPLACE VIEW v_unread_threads AS
SELECT
    c.name          AS client_name,
    c.email,
    nt.client_id,
    nt.updated_at,
    nt.last_read_at,
    (nt.updated_at > COALESCE(nt.last_read_at, '1970-01-01'::timestamptz)) AS has_unread
FROM nutrition_threads nt
JOIN clients c ON c.id = nt.client_id
ORDER BY nt.updated_at DESC;

-- =============================================================================
-- 3. INDEXES
-- =============================================================================

-- 3.1 Notes ordered by creation date (findByClientIdOrderByCreatedAtDesc).
CREATE INDEX IF NOT EXISTS idx_notes_client_created
    ON notes (client_id, created_at DESC);

-- 3.2 Email verification lookup including expires_at filter.
DROP INDEX IF EXISTS idx_email_verification_lookup;
CREATE INDEX idx_email_verif_lookup_v2
    ON email_verification_tokens (email, code, used, expires_at);

-- =============================================================================
-- 4. IMMEDIATE CLEANUP (Leandro's orphan data from V13)
-- =============================================================================
SELECT sp_cleanup_orphan_audits();
SELECT sp_cleanup_orphan_tokens();
