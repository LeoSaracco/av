# Pipeline & Deployment — Railway + GitHub

## Overview

The AV Fitness App will be deployed on **Railway** with continuous deployment from **GitHub**. This document describes the complete CI/CD pipeline, infrastructure, and deployment workflow.

## Repository

- **GitHub:** `https://github.com/LeoSaracco/av.git`
- **Branch strategy:** `main` (production), feature branches via PRs
- **Protected branch:** `main` requires PR + 2 reviewers

## Infrastructure on Railway

```
┌──────────────────────────────────────────────────┐
│                    RAILWAY                        │
│                                                   │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────┐│
│  │ Frontend     │  │ Backend API  │  │ PostgreSQL ││
│  │ (Static Site)│  │ (Java/Kotlin)│  │ (DB)       ││
│  │ React + Vite │  │ Spring Boot  │  │ Port: 5432 ││
│  │ Port: 3000   │  │ Port: 8080   │  │            ││
│  └─────────────┘  └──────────────┘  └───────────┘│
│         │                │                │       │
│         └────────────────┴────────────────┘       │
│                        │                          │
│                  Internal Network                 │
│                  (Private URLs)                    │
└──────────────────────────────────────────────────┘
```

### Services

| Service | Type | Technology | Domain |
|---------|------|-----------|--------|
| `av-frontend` | Static Site | React + Vite | `av.railway.app` |
| `av-backend` | Web Service | Spring Boot 3.x | `api.av.railway.app` (internal) |
| `av-postgres` | Database | PostgreSQL 16 | Internal only |

### Railway Configuration

**Backend (`railway.toml`):**
```toml
# El backend usa builder DOCKERFILE. El Dockerfile se encarga
# de compilar con Maven (./mvnw package) y empaquetar la app.
[build]
builder = "DOCKERFILE"

[deploy]
healthcheckPath = "/api/actuator/health"
restartPolicyType = "ALWAYS"
restartPolicyMaxRetries = 3
```

**Frontend (`railway.toml`):**
```toml
[build]
builder = "NIXPACKS"
buildCommand = "npm ci && npm run build"

[deploy]
startCommand = "npx serve -s dist -l $PORT"
healthcheckPath = "/"
```

## CI/CD Pipeline (GitHub Actions)

### Workflow: `ci.yml` (Pull Requests)

```yaml
name: CI — Quality Gates

on:
  pull_request:
    branches: [main]

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npm run lint        # Quality Gate: 0 errors, 0 warnings
      - run: npm run build       # Quality Gate: build success

  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: 21
          distribution: 'temurin'
      - run: ./mvnw test --batch-mode     # Quality Gate: tests pass
      - run: ./mvnw package -DskipTests --batch-mode

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: SAST Scan
        uses: github/codeql-action/analyze@v3
      - name: Secret Scan
        uses: gitleaks/gitleaks-action@v2
      - name: Dependency Scan
        run: npm audit --audit-level=high  # Quality Gate: 0 high
```

### Workflow: `deploy.yml` (Main Branch)

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm i -g @railway/cli
          railway up --service=av-frontend --detach

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: ./mvnw package -DskipTests --batch-mode
      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm i -g @railway/cli
          railway up --service=av-backend --detach
```

## Environment Variables on Railway

### Frontend
| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://api.av.railway.app` |
| `VITE_BASE_PATH` | `/av/` |

### Backend
| Variable | Value |
|----------|-------|
| `SPRING_PROFILES_ACTIVE` | `production` |
| `DATABASE_URL` | `postgresql://...` (auto-provisioned by Railway) |
| `JWT_SECRET` | `[generated 256-bit key]` |
| `MERCADOPAGO_ACCESS_TOKEN` | `[MP production token]` |
| `MERCADOPAGO_WEBHOOK_SECRET` | `[MP webhook secret]` |
| `RESEND_API_KEY` | `[Resend API key]` |
| `OPENAI_API_KEY` | `[OpenAI API key]` |
| `CORS_ALLOWED_ORIGINS` | `https://av.railway.app` |

## Deployment Flow

```
Developer pushes to feature branch
  → Creates PR to main
  → GitHub Actions runs CI (lint, build, tests, security scans)
  → All quality gates must pass (blocking)
  → 2 reviewers approve
  → Merge to main
  → GitHub Actions triggers deploy
  → Railway builds and deploys frontend + backend
  → Health checks pass → Live
```

## Rollback Strategy

1. Railway keeps deployment history (last 5 deploys)
2. Immediate rollback: `railway rollback` or Railway dashboard one-click
3. Database migrations use Flyway with `UNDO` scripts for each migration
4. Backward-compatible API changes (don't break old frontend)

## Database Migrations (Flyway)

```sql
-- V1__init.sql
CREATE TABLE clients (...);
CREATE TABLE coaches (...);
CREATE TABLE routines (...);
-- etc.

-- V2__add_onboarding.sql
CREATE TABLE onboarding_submissions (...);

-- V3__add_payments.sql
CREATE TABLE payments (...);
```

Flyway runs automatically on backend startup via Spring Boot auto-configuration.

## Monorepo Considerations

When the backend is added, the repository will become a monorepo:

```
av/
├── frontend/            # Current React + Vite app
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── backend/             # Future Spring Boot app
│   ├── src/main/java/
│   ├── src/test/java/
│   ├── pom.xml
│   └── Dockerfile
├── docs/                # Context files (this directory)
│   ├── architecture.md
│   ├── frontend.md
│   ├── backend.md
│   ├── security.md
│   ├── pipeline.md
│   └── dod.md
├── railway.toml         # Railway monorepo config
└── .github/workflows/   # CI/CD pipelines
```

### Railway Monorepo Config

Railway maneja monorepos configurando el **Root Directory** de cada servicio
desde el dashboard, no desde `railway.toml`. Cada servicio tiene su propio
archivo `railway.toml` en su directorio raíz:

- **Frontend:** `railway.toml` (raíz del repo) — builder `NIXPACKS`
- **Backend:** `backend/railway.toml` — builder `DOCKERFILE`

Configuración en el dashboard de Railway:
```
Servicio        Root Directory    Builder
av-frontend     .                 NIXPACKS
av-backend      backend           DOCKERFILE
```

## GitHub Secrets Required

| Secret | Purpose |
|--------|---------|
| `RAILWAY_TOKEN` | Project Token del proyecto `av-fitness` (ver abajo) |
| `GITLEAKS_LICENSE` | Gitleaks license (optional) |
| `CODECOV_TOKEN` | Code coverage reporting (optional) |

### Project Token vs Account Token

Railway ofrece dos tipos de tokens:

| Tipo | Alcance | Recomendación |
|------|---------|---------------|
| **Account Token** | Todos los proyectos de la cuenta | Solo para desarrollo local |
| **Project Token** | Un solo proyecto específico | **Usar en CI/CD** (GitHub Secrets) |

Para GitHub Actions, crear un **Project Token** desde el dashboard de Railway
(**Project → Settings → Tokens**) y agregarlo como `RAILWAY_TOKEN` en los secrets
del repositorio. Esto limita el acceso únicamente al proyecto `av-fitness`.
