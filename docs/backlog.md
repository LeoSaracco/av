# Backlog - AV Fitness App

Actualizado: 2026-06-16

## Hecho

- Estructura monorepo normalizada:
  - `av-frontend/`: React + Vite.
  - `av-backend/`: Spring Boot + PostgreSQL + Flyway.
  - raiz: docs, GitHub Actions, compose/env examples y orquestacion Railway.
- Railway configurado en proyecto `av`:
  - servicio `av-frontend`
  - servicio `av-backend`
  - servicio `Postgres`
- Deploy productivo verificado:
  - Frontend: `https://av-frontend-production.up.railway.app`
  - Backend: `https://av-backend-production.up.railway.app`
  - Health: `/actuator/health`
- Swagger/OpenAPI agregado al backend:
  - `/v3/api-docs`
  - `/swagger-ui/index.html`
- Frontend alineado con backend:
  - `VITE_API_URL` y `VITE_WS_URL` pasan al build Docker.
  - `vite.config.js` usa `base: '/'`.
  - Nginx sirve `/assets/*` como archivos reales y evita fallback HTML para assets.
  - Home carga solo `GET /api/plans`.
  - Store carga `GET /api/products` solo al entrar a tienda.
  - Panel coach carga `/api/coach/*` solo al entrar a rutas coach autenticadas.
  - Panel cliente carga `/api/me/*` solo al entrar a rutas cliente autenticadas.
- Persistencia de negocio movida al backend:
  - Sin seed runtime de negocio en frontend.
  - Sin `MOCK_USERS`.
  - Auth por cookies httpOnly desde backend.
  - `localStorage`/`sessionStorage` no se usan para auth ni datos de negocio.
- Backend corregido para Railway:
  - `server.port=${PORT:8080}`.
  - datasource por variables `SPRING_DATASOURCE_*`.
  - cookie secure configurable con `AUTH_COOKIE_SECURE`.
  - Flyway como fuente de datos iniciales.
- Maven Wrapper agregado en `av-backend/`:
  - `mvnw`
  - `mvnw.cmd`
  - `.mvn/wrapper/maven-wrapper.properties`
- CI/CD actualizado:
  - `ci.yml` corre en `push` y PR contra `main`.
  - `deploy-railway.yml` corre en `push` contra `main` y manual `workflow_dispatch`.
  - CI usa `working-directory` correcto para `av-frontend` y `av-backend`.
  - Backend CI usa `./mvnw`.
  - Deploy usa `railway up ./av-frontend --path-as-root` y `railway up ./av-backend --path-as-root`.
- GitHub Actions:
  - `RAILWAY_TOKEN` configurado como secret del repo.
  - El error `Unauthorized` de Railway se resolvio cargando el secret con nombre correcto.
- Contratacion de plan persistente:
  - inicio de contrato por API.
  - pago mock MercadoPago persistido en `payments`.
  - formulario, usuario y cliente creados al completar onboarding.
  - auditoria de eventos clave en `audit_events`.

## Validado

- Frontend:
  - `npm run lint`: OK
  - `npm run build`: OK
  - `npm test`: 25 tests OK
  - bundle productivo sin `localhost:8080`
- Backend:
  - Docker build OK
  - `/actuator/health` OK
  - `/v3/api-docs` OK
  - `/swagger-ui/index.html` OK
- Railway:
  - deploy backend OK
  - deploy frontend OK
  - servicios separados dentro del proyecto `av`
- GitHub:
  - PR de migracion a monorepo mergeado en `main`.
  - CI remoto en `main` OK.

## Pendiente

- Confirmar en GitHub que `main` sea la rama protegida y productiva.
- Configurar branch protection para `main`:
  - PR obligatorio.
  - CI requerido.
  - bloqueo de push directo si aplica.
- Mantener verificacion de workflows remotos despues de cambios de pipeline:
  - `gh workflow list --repo LeoSaracco/av`
  - `gh run list --repo LeoSaracco/av`
  - `gh run view <run-id> --log-failed`
- Completar integraciones productivas con credenciales reales:
  - MercadoPago
  - Resend
  - OpenAI
- Documentar el codigo:
  - componentes y contextos frontend.
  - controllers, services, repositories, DTOs y entidades backend.
  - flujos de auth, pagos, onboarding, coach, cliente y store.
- Integrar MercadoPago real reemplazando el mock persistido.
- Mejorar cobertura backend con tests de controller/service/repository.
- Agregar prueba E2E que verifique que el home no llama endpoints privados.
- Resolver vulnerabilidades de `npm audit --audit-level=high` si siguen presentes en CI.
- Revisar Swagger en produccion: hoy es publico; decidir si debe quedar publico o restringido.
