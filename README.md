# AV Fitness App

Monorepo productivo para la plataforma de entrenamiento de Adrian Vila.

## Estructura

```text
av/
  av-frontend/     React + Vite, servido por Nginx en Railway
  av-backend/      Spring Boot, PostgreSQL, Flyway, Swagger/OpenAPI
  docs/            arquitectura, frontend, backend, Railway, pipeline, seguridad y backlog
  .github/         CI/CD GitHub Actions
```

## URLs productivas

- Frontend: `https://av-frontend-production.up.railway.app`
- Backend: `https://av-backend-production.up.railway.app`
- Health: `https://av-backend-production.up.railway.app/actuator/health`
- Swagger: `https://av-backend-production.up.railway.app/swagger-ui/index.html`
- OpenAPI JSON: `https://av-backend-production.up.railway.app/v3/api-docs`

## Datos y autenticacion

El backend es la fuente de verdad para datos persistidos. El frontend no debe persistir auth ni datos de negocio en `localStorage` o `sessionStorage`.

- Home publico: solo carga planes desde `/api/plans`.
- Store publica: carga productos desde `/api/products` al entrar a tienda.
- Coach: carga endpoints `/api/coach/*` solo en rutas coach autenticadas.
- Cliente: carga endpoints `/api/me/*` solo en rutas cliente autenticadas.
- Auth: cookies httpOnly administradas por el backend.

## Desarrollo local

```powershell
# Base de datos
docker compose up -d

# Backend
cd av-backend
.\mvnw.cmd spring-boot:run

# Frontend
cd ..\av-frontend
npm ci
npm run dev
```

Variables locales:

- raiz: `.env.example`
- frontend: `av-frontend/.env.local.example`
- backend: `av-backend/.env.local.example`

## Validacion

```powershell
cd av-frontend
npm run lint
npm run build
npm test
npm audit --audit-level=high

cd ..\av-backend
.\mvnw.cmd test --batch-mode
.\mvnw.cmd package -DskipTests --batch-mode
```

## CI/CD

Los workflows viven en `.github/workflows/`.

- `ci.yml`: corre en `push` y PR contra `main`.
- `deploy-railway.yml`: corre en `push` contra `main` y manualmente con `workflow_dispatch`.
- Secret requerido en GitHub Actions: `RAILWAY_TOKEN`.

Deploy Railway:

```powershell
railway up ./av-frontend --path-as-root --project d4fdeffd-14ee-4284-b3aa-327f328e706d --environment production --service av-frontend --detach
railway up ./av-backend --path-as-root --project d4fdeffd-14ee-4284-b3aa-327f328e706d --environment production --service av-backend --detach
```

## Documentacion

- `docs/backlog.md`: hecho, validado y pendiente.
- `docs/architecture.md`: arquitectura general del monorepo.
- `docs/frontend.md`: lineamientos frontend.
- `docs/backend.md`: lineamientos backend.
- `docs/code-map.md`: mapa de codigo frontend/backend.
- `docs/railway.md`: estado Railway, servicios, variables, deploy y troubleshooting.
- `docs/pipeline.md`: CI/CD y Railway.
- `docs/security.md`: lineamientos de seguridad.
- `docs/dod.md`: definition of done.
