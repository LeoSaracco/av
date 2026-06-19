# Mapa de codigo - Frontend y Backend

Actualizado: 2026-06-17

## Frontend

Puntos de entrada:

- `av-frontend/src/main.jsx`: monta React.
- `av-frontend/src/App.jsx`: define rutas publicas, coach y cliente.
- `av-frontend/src/api/apiClient.js`: unico cliente HTTP hacia backend.
- `av-frontend/src/context/AuthContext.jsx`: estado de auth, login, register y logout.
- `av-frontend/src/context/AppContext.jsx`: estado en memoria y operaciones de negocio.

Carga de datos:

- `AppContext` carga planes publicos al montar la app.
- `Store.jsx` y `ProductDetail.jsx` llaman `loadProducts()`.
- `CoachLayout.jsx` llama `loadCoachData()`.
- `ClientLayout.jsx` llama `loadClientData(user)`.

Regla importante:

- No agregar llamadas globales a `/api/coach/*` o `/api/me/*` desde `AppProvider`.
- No agregar `localStorage`/`sessionStorage` para auth o negocio.

## Backend

Puntos de entrada:

- `AvApplication.java`: bootstrap Spring Boot.
- `config/SecurityConfig.java`: autorizacion, CORS y rutas publicas/privadas.
- `config/JwtAuthFilter.java`: lectura de JWT desde cookie httpOnly.
- `controller/`: contratos REST.
- `service/`: casos de uso y reglas de negocio.
- `repository/`: acceso a datos.
- `model/`: entidades persistidas.
- `dto/`: contratos de entrada/salida.
- `src/main/resources/db/migration/`: migraciones Flyway.

Contratacion de plan:

- `PaymentSimulator.jsx` llama las APIs de `plan-contracts`.
- `PlanContractController` expone inicio, pago mock y cierre de onboarding.
- `PlanContractServiceImpl` crea `plan_contracts`, `payments`, `clients`, `users`, `onboarding_submissions` y `audit_events`.

Rutas operacionales:

- `/actuator/health`
- `/v3/api-docs`
- `/swagger-ui/index.html`

Regla importante:

- Controllers deben delegar logica a services.
- Services no deben depender de detalles HTTP.
- Repositories no deben exponer logica de negocio.
- Cambios de schema/datos iniciales deben ir por Flyway.

## Email

- EmailServiceImpl.java: envio via Resend API con RestTemplate, templates HTML dark mode.
- EmailVerificationService.java: generacion y validacion de codigos de 6 digitos, expiran en 10 min, limpieza programada de tokens expirados cada 1h.

## Auto-asignacion

- PlanContractServiceImpl.completeOnboarding(): al completar onboarding crea automaticamente rutina, dieta, hilo de nutricion y nota de bienvenida por defecto vinculados al nuevo cliente.

## Cliente self-service

- MeController.java: resolveClientId() resuelve userId del JWT a clientId via UserJpaRepository. PUT /api/me/progress/{id} permite editar peso existente.

## CI/CD

- Workflows: `.github/workflows/ci.yml` y `.github/workflows/deploy-railway.yml`.
- Rama productiva: `master`.
- Backend usa Maven Wrapper.
- Deploy usa Railway CLI con `--path-as-root`, `--project` y `--environment production`.

## Pendiente de documentacion de codigo

- Documentar controllers, services, DTOs, entidades y repositorios backend (COMPLETADO 2026-06-17).
- Priorizar codigo que define contratos publicos, autenticacion, pagos, integraciones externas, carga de datos y permisos por rol.
