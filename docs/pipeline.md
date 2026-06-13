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
[build]
builder = "nixpacks"
buildCommand = "./gradlew build -x test"

[deploy]
startCommand = "java -jar build/libs/av-api-0.0.1-SNAPSHOT.jar"
healthcheckPath = "/actuator/health"
restartPolicyMaxRetries = 3

[service]
port = 8080

[variable]
SPRING_PROFILES_ACTIVE = "production"
```

**Frontend (`railway.toml`):**
```toml
[build]
builder = "nixpacks"
buildCommand = "npm ci && npm run build"

[deploy]
startCommand = "npx serve -s dist -l 3000"

[service]
port = 3000
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
      - run: ./gradlew check     # Quality Gate: tests pass
      - run: ./gradlew build -x test

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
      - uses: railwayapp/railway-deploy@v1
        with:
          service: av-frontend
          railway_token: ${{ secrets.RAILWAY_TOKEN }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: ./gradlew build -x test
      - uses: railwayapp/railway-deploy@v1
        with:
          service: av-backend
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
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
│   ├── build.gradle
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

```toml
# railway.toml (root)
[build]
builder = "nixpacks"

[monorepo]
root = "."

[[services]]
name = "av-frontend"
path = "frontend"

[[services]]
name = "av-backend"
path = "backend"
```

## GitHub Secrets Required

| Secret | Purpose |
|--------|---------|
| `RAILWAY_TOKEN` | Railway CLI authentication |
| `GITLEAKS_LICENSE` | Gitleaks license (optional) |
| `CODECOV_TOKEN` | Code coverage reporting (optional) |
