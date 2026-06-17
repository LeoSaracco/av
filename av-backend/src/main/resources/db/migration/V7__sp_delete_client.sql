CREATE OR REPLACE FUNCTION sp_delete_client_by_email(target_email TEXT)
RETURNS TEXT AS $$
DECLARE
    target_client_id UUID;
    target_user_id UUID;
    contract_count INT;
    payment_count INT;
    onboarding_count INT;
    token_count INT;
    note_count INT;
    thread_count INT;
BEGIN
    SELECT id INTO target_client_id FROM clients WHERE email = target_email;
    IF target_client_id IS NULL THEN
        RETURN 'Cliente ' || target_email || ' no encontrado';
    END IF;

    SELECT id INTO target_user_id FROM users WHERE email = target_email;

    SELECT COUNT(*) INTO contract_count FROM plan_contracts WHERE email = target_email;
    DELETE FROM plan_contracts WHERE email = target_email;

    SELECT COUNT(*) INTO payment_count FROM payments WHERE client_id = target_client_id;
    DELETE FROM payments WHERE client_id = target_client_id;

    SELECT COUNT(*) INTO onboarding_count FROM onboarding_submissions WHERE client_id = target_client_id;
    DELETE FROM onboarding_submissions WHERE client_id = target_client_id;

    SELECT COUNT(*) INTO token_count FROM refresh_tokens WHERE user_id = target_user_id;
    IF target_user_id IS NOT NULL THEN
        DELETE FROM refresh_tokens WHERE user_id = target_user_id;
    END IF;

    DELETE FROM users WHERE email = target_email;

    SELECT COUNT(*) INTO note_count FROM notes WHERE client_id = target_client_id;
    SELECT COUNT(*) INTO thread_count FROM nutrition_threads WHERE client_id = target_client_id;

    DELETE FROM clients WHERE email = target_email;

    RETURN 'Cliente ' || target_email || ' eliminado. ' ||
           'Contracts: ' || contract_count || ', ' ||
           'Payments: ' || payment_count || ', ' ||
           'Onboardings: ' || onboarding_count || ', ' ||
           'Tokens: ' || token_count || ', ' ||
           'Notes: ' || note_count || ', ' ||
           'Threads: ' || thread_count;
END;
$$ LANGUAGE plpgsql;
