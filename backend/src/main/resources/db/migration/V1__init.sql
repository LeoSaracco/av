CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    goal VARCHAR(500),
    status VARCHAR(20),
    join_date DATE,
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coaches (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS routine_templates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    goal VARCHAR(255),
    description TEXT,
    exercises JSONB,
    created_at VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS routines (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    goal VARCHAR(255),
    template_id VARCHAR(36) REFERENCES routine_templates(id),
    exercises JSONB,
    created_at VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS diet_templates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    goal VARCHAR(255),
    description TEXT,
    indications TEXT,
    meals JSONB,
    created_at VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS diets (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    goal VARCHAR(255),
    template_id VARCHAR(36) REFERENCES diet_templates(id),
    indications TEXT,
    meals JSONB,
    created_at VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS assignments (
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL REFERENCES clients(id),
    routine_id VARCHAR(36) REFERENCES routines(id),
    diet_id VARCHAR(36) REFERENCES diets(id),
    assigned_at TIMESTAMP DEFAULT NOW(),
    active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS notes (
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL REFERENCES clients(id),
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS progress (
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL REFERENCES clients(id),
    date DATE NOT NULL,
    weight DOUBLE PRECISION NOT NULL,
    comment TEXT
);

CREATE TABLE IF NOT EXISTS plans (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    price INTEGER NOT NULL,
    currency VARCHAR(10),
    features JSONB,
    featured BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36) REFERENCES clients(id),
    plan_id VARCHAR(36),
    preference_id VARCHAR(100),
    status VARCHAR(20),
    amount NUMERIC(10,2),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS onboarding_submissions (
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36) REFERENCES clients(id),
    plan_id VARCHAR(20),
    form_data JSONB,
    submitted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nutrition_threads (
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36) REFERENCES clients(id),
    messages JSONB
);

CREATE INDEX IF NOT EXISTS idx_assignments_client ON assignments(client_id);
CREATE INDEX IF NOT EXISTS idx_notes_client ON notes(client_id);
CREATE INDEX IF NOT EXISTS idx_progress_client ON progress(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_client ON payments(client_id);
