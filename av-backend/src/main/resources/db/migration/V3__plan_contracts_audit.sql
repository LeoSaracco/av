CREATE TABLE plan_contracts (
    id UUID PRIMARY KEY,
    plan_id VARCHAR(50) NOT NULL,
    payment_id UUID,
    onboarding_id UUID,
    user_id UUID,
    client_id UUID,
    email VARCHAR(255),
    status VARCHAR(40) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_plan_contracts_status ON plan_contracts(status);
CREATE INDEX idx_plan_contracts_email ON plan_contracts(email);
CREATE INDEX idx_plan_contracts_client ON plan_contracts(client_id);

ALTER TABLE payments ALTER COLUMN client_id DROP NOT NULL;
ALTER TABLE payments ADD COLUMN contract_id UUID REFERENCES plan_contracts(id) ON DELETE SET NULL;
ALTER TABLE payments ADD COLUMN provider VARCHAR(40) NOT NULL DEFAULT 'MERCADOPAGO';
ALTER TABLE payments ADD COLUMN provider_mode VARCHAR(20) NOT NULL DEFAULT 'MOCK';
ALTER TABLE payments ADD COLUMN currency VARCHAR(5) NOT NULL DEFAULT 'ARS';
ALTER TABLE payments ADD COLUMN external_reference VARCHAR(100);
ALTER TABLE payments ADD COLUMN init_point TEXT;
ALTER TABLE payments ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();
ALTER TABLE payments ADD COLUMN raw_provider_payload JSONB NOT NULL DEFAULT '{}';

CREATE INDEX idx_payments_contract ON payments(contract_id);
CREATE INDEX idx_payments_external_reference ON payments(external_reference);

ALTER TABLE plan_contracts
    ADD CONSTRAINT fk_plan_contracts_payment
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL;
ALTER TABLE plan_contracts
    ADD CONSTRAINT fk_plan_contracts_onboarding
    FOREIGN KEY (onboarding_id) REFERENCES onboarding_submissions(id) ON DELETE SET NULL;
ALTER TABLE plan_contracts
    ADD CONSTRAINT fk_plan_contracts_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE plan_contracts
    ADD CONSTRAINT fk_plan_contracts_client
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL;

CREATE TABLE audit_events (
    id UUID PRIMARY KEY,
    event_type VARCHAR(80) NOT NULL,
    aggregate_type VARCHAR(80) NOT NULL,
    aggregate_id UUID,
    actor_user_id UUID,
    client_id UUID,
    request_id VARCHAR(120),
    payload JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_events_type_created ON audit_events(event_type, created_at);
CREATE INDEX idx_audit_events_aggregate ON audit_events(aggregate_type, aggregate_id);
CREATE INDEX idx_audit_events_client ON audit_events(client_id);
