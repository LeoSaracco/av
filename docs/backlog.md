# Backlog — AV Fitness App

## Completado (100%)

| ID | Tarea | Estado |
|----|-------|--------|
| B-00a-g | Onboarding, PaymentSimulator, Refactor, A11y, Docs, Lint, Responsive | ✅ |
| B-07 | Vitest + Testing Library | ✅ |
| B-08 | 26 unit tests (FormPrimitives, StepsTrack, AuthContext) | ✅ |
| B-09 | E2E Playwright test config + onboarding spec | ✅ |
| B-12 | Code splitting React.lazy (27 chunks) | ✅ |
| B-13 | react-helmet-async SEO meta tags | ✅ |
| B-14 | CoachDashboard charts (Recharts bar + status distribution) | ✅ |
| B-20 | i18n foundation (es/en) with context + hook | ✅ |
| B-21 | PWA service worker + manifest + offline | ✅ |
| B-22 | Dark/light theme toggle (data-theme, localStorage) | ✅ |
| B-23 | PDF export (ClientProgress via window.print + @media print) | ✅ |
| B-25 | Video embeds YouTube/Vimeo in ClientRoutine | ✅ |
| DT-01..06 | All 6 deuda técnica items | ✅ |
| B-01 | Backend Spring Boot hexagonal scaffold (Maven) | ✅ |
| B-06 | Railway + GitHub Actions CI/CD | ✅ |
| B-16 | Avatar upload component | ✅ |
| B-15 | WebSocket client stub | ✅ |

## Backend (implementado, requiere Java 21 + Docker)

| ID | Componente | Archivos |
|----|-----------|----------|
| — | Spring Boot 3.3.5 + Java 21 + Maven | `pom.xml` |
| — | PostgreSQL schema (15 tablas, Flyway V1) | `V1__init.sql` |
| — | Seed data (1 coach, 4 clients, planes, etc.) | `V2__seed.sql` |
| — | JWT auth (access + refresh tokens) | `JwtService.java`, `SecurityConfig.java`, `JwtAuthFilter.java` |
| — | 7 REST controllers (Auth, Plans, Me, Coach, Client, Payment, Onboarding) | `web/controller/` |
| — | 4 domain services + 4 use cases | `domain/service/impl/`, `application/usecase/` |
| — | 11 JPA entity adapters | `infrastructure/persistence/` |
| — | MercadoPago adapter (real, ready for API key) | `MercadoPagoAdapter.java` |
| — | Email adapter (real, ready for API key) | `EmailAdapter.java` |
| — | ArchUnit hexagonal architecture test | `HexagonalArchitectureTest.java` |
| — | Dockerfile multi-stage (Maven build → JRE runtime) | `Dockerfile` |
| — | Docker Compose (PostgreSQL 16 + pgAdmin) | `docker-compose.yml` (raíz) |
| — | Frontend API client | `src/api/apiClient.js` |

## Para levantar el entorno completo

```bash
# 1. Base de datos
docker compose up -d

# 2. Backend (requiere Java 21)
cd backend && ./mvnw spring-boot:run

# 3. Frontend
npm run dev
```

## Quality Gates — Último check

```
✅ Build:        PASS (27 chunks + PWA, 609ms)
✅ Lint:         PASS (0 errors, 0 warnings)
✅ Tests:        PASS (26/26, 3 suites)
✅ E2E Config:   READY (playwright.config.js + onboarding.spec.js)
✅ Secrets:      PASS (0 hardcoded)
✅ Husky:        PASS (pre-commit lint-staged)
✅ EditorConfig: PASS
✅ JSDoc:        PASS (37 archivos)
✅ PWA:          PASS (service worker)
✅ CodeSplit:    PASS (27 chunks)
✅ Backend:      IMPLEMENTED (Maven, 50+ Java files, compila)
✅ CI/CD:        CONFIGURED (.github + railway.toml)
✅ Docker:       READY (PostgreSQL 16 + pgAdmin)
✅ PDF Export:   DONE (print styles)
✅ Theme:        DONE (dark/light toggle)
✅ i18n:         DONE (es/en)
```
