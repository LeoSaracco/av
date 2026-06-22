# AV Fitness App

Monorepo productivo para la plataforma de entrenamiento de Adrian Vila.

**Ultima actualizacion:** 2026-06-17

## Path de trabajo

El repo Git local canonico es:

```text
C:\Users\Leandro\Documents\projects\av-final
```

Todo cambio, commit, push, validacion y documentacion debe hacerse desde ese path. No usar clones auxiliares como fuente de verdad salvo para recuperacion puntual.

## Estructura

```text
av/
  av-frontend/     React + Vite, servido por Nginx en Railway
  av-backend/      Spring Boot, PostgreSQL, Flyway, Swagger/OpenAPI
  docs/            arquitectura, frontend, backend, Railway, pipeline, seguridad y backlog
  .github/         CI/CD GitHub Actions
  db.bat / db.js   Herramientas CLI para consultas SQL
```

## URLs productivas

- Frontend: `https://av-frontend-production.up.railway.app`
- Backend: `https://av-backend-production.up.railway.app`
- Health: `https://av-backend-production.up.railway.app/actuator/health`
- Swagger: `https://av-backend-production.up.railway.app/swagger-ui/index.html`
- OpenAPI JSON: `https://av-backend-production.up.railway.app/v3/api-docs`

## Features

- **Planes de contratacion:** inicio de contrato, pago mock MercadoPago, formulario de onboarding, creacion de usuario/cliente, auditoria de eventos.
- **Auto-asignacion:** al completar onboarding se crean rutina, dieta, hilo de nutricion y nota de bienvenida por defecto.
- **Email verification:** codigos de 6 digitos via Resend HTTPS API. Templates HTML dark mode (#0a0a0a, #00FF00). Recupero de contrasena.
- **Auth:** JWT en cookies httpOnly con SameSite=None para cross-origin Railway.
- **Panel coach:** gestion de clientes, rutinas, dietas, templates, asignaciones, notas, progreso e hilo de mensajeria.
- **Panel cliente:** rutina, dieta, seguimiento de peso (CRUD con editar), notas del coach, chat nutricional IA.
- **Store:** catalogo de productos, carrito transitorio en memoria.
- **Swagger/OpenAPI:** docs de API publicos en `/swagger-ui/index.html`.

## Datos y autenticacion

El backend es la fuente de verdad para datos persistidos. El frontend no debe persistir auth ni datos de negocio en `localStorage` o `sessionStorage`.

- Home publico: solo carga planes desde `/api/plans`.
- Contratacion de plan: inicia en `/api/plan-contracts/start`, registra pago mock en `/api/plan-contracts/{id}/mock-payment` y completa usuario/formulario en `/api/plan-contracts/{id}/complete-onboarding`.
- Store publica: carga productos desde `/api/products` al entrar a tienda.
- Coach: carga endpoints `/api/coach/*` solo en rutas coach autenticadas.
- Cliente: carga endpoints `/api/me/*` solo en rutas cliente autenticadas.
- Auth: cookies httpOnly administradas por el backend.

## Herramientas CLI

```powershell
# Consultas SQL via Docker (interactivo)
.\db-docker.bat

# Consultas SQL via Node.js (una query)
node db.js "SELECT * FROM clients"

# Eliminar cliente de prueba con todo su rastro
node db.js "SELECT sp_delete_client_by_email('test@av.com')"
```

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

- `ci.yml`: corre en `push` y PR contra `master`.
- `deploy-railway.yml`: corre en `push` contra `master` y manualmente con `workflow_dispatch`.
- `zap-baseline.yml`: corre OWASP ZAP Baseline manualmente y cada lunes contra frontend/backend productivos.
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
- `docs/database.md`: conexion, queries utiles, SPs y migraciones.
- `docs/dod.md`: definition of done.
