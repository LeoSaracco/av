-- ── V1 — Schema inicial ─────────────────────────────────────────────────────
-- Tablas, índices y constraints para AV Fitness App
-- Se usa UUID como PK (VARCHAR 36) para compatibilidad con frontend

CREATE TABLE IF NOT EXISTS coaches (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    roles VARCHAR(100) DEFAULT 'ROLE_COACH'
);

CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    goal VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active',
    join_date DATE DEFAULT CURRENT_DATE,
    avatar VARCHAR(255),
    roles VARCHAR(100) DEFAULT 'ROLE_CLIENT',
    created_at TIMESTAMP DEFAULT NOW()
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
    coach_id VARCHAR(36) REFERENCES coaches(id),
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

CREATE TABLE IF NOT EXISTS nutrition_threads (
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL REFERENCES clients(id),
    messages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    image VARCHAR(255),
    category VARCHAR(100),
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36) NOT NULL REFERENCES clients(id),
    product_id VARCHAR(36) NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS plans (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    price INTEGER NOT NULL,
    currency VARCHAR(10) DEFAULT 'ARS',
    features JSONB,
    featured BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS onboarding_submissions (
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36) REFERENCES clients(id),
    plan_id VARCHAR(20),
    form_data JSONB,
    submitted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36) REFERENCES clients(id),
    plan_id VARCHAR(36),
    preference_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    amount NUMERIC(10,2),
    currency VARCHAR(10) DEFAULT 'ARS',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_threads (
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(36) REFERENCES clients(id),
    type VARCHAR(50) DEFAULT 'nutrition',
    messages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_coaches_email ON coaches(email);
CREATE INDEX IF NOT EXISTS idx_assignments_client ON assignments(client_id);
CREATE INDEX IF NOT EXISTS idx_assignments_active ON assignments(client_id, active);
CREATE INDEX IF NOT EXISTS idx_notes_client ON notes(client_id);
CREATE INDEX IF NOT EXISTS idx_progress_client ON progress(client_id);
CREATE INDEX IF NOT EXISTS idx_progress_client_date ON progress(client_id, date);
CREATE INDEX IF NOT EXISTS idx_payments_client ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_preference ON payments(preference_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_client ON cart_items(client_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_threads_client ON nutrition_threads(client_id);
CREATE INDEX IF NOT EXISTS idx_ai_threads_client ON ai_threads(client_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_client ON onboarding_submissions(client_id);
CREATE INDEX IF NOT EXISTS idx_routines_template ON routines(template_id);
CREATE INDEX IF NOT EXISTS idx_diets_template ON diets(template_id);
