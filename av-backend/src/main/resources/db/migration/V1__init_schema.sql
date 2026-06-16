CREATE TABLE coaches (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE clients (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    goal TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    join_date DATE NOT NULL,
    avatar VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY,
    role VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    client_id UUID REFERENCES clients(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY (user_id, token)
);

CREATE TABLE routine_templates (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    goal TEXT,
    description TEXT,
    exercises JSONB NOT NULL DEFAULT '[]',
    created_at DATE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE routines (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    goal TEXT,
    template_id UUID REFERENCES routine_templates(id) ON DELETE SET NULL,
    exercises JSONB NOT NULL DEFAULT '[]',
    created_at DATE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE assignments (
    id UUID PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    routine_id UUID NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
    assigned_at DATE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assignments_client_active ON assignments(client_id, active);

CREATE TABLE notes (
    id UUID PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL,
    updated_at_tz TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notes_client_id ON notes(client_id);

CREATE TABLE progress_entries (
    id UUID PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_progress_client_date ON progress_entries(client_id, date);

CREATE TABLE diet_templates (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    goal TEXT,
    description TEXT,
    indications TEXT,
    meals JSONB NOT NULL DEFAULT '[]',
    created_at DATE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE diets (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    goal TEXT,
    template_id UUID REFERENCES diet_templates(id) ON DELETE SET NULL,
    indications TEXT,
    meals JSONB NOT NULL DEFAULT '[]',
    created_at DATE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE diet_assignments (
    id UUID PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    diet_id UUID NOT NULL REFERENCES diets(id) ON DELETE CASCADE,
    assigned_at DATE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_diet_assignments_client_active ON diet_assignments(client_id, active);

CREATE TABLE nutrition_threads (
    id UUID PRIMARY KEY,
    client_id UUID NOT NULL UNIQUE REFERENCES clients(id) ON DELETE CASCADE,
    messages JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE onboarding_submissions (
    id UUID PRIMARY KEY,
    plan_id VARCHAR(50) NOT NULL,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    form_data JSONB NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_onboarding_email ON onboarding_submissions((form_data->>'email'));

CREATE TABLE plans (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(5) NOT NULL DEFAULT 'ARS',
    features JSONB NOT NULL DEFAULT '[]',
    featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
    id UUID PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(500),
    sizes JSONB,
    colors JSONB,
    flavors JSONB,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE payments (
    id UUID PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    plan_id VARCHAR(50) NOT NULL,
    preference_id VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_preference ON payments(preference_id);
CREATE INDEX idx_payments_client ON payments(client_id);
