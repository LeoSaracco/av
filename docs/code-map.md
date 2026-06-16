# Mapa de codigo - Frontend y Backend

Actualizado: 2026-06-16

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

Rutas operacionales:

- `/actuator/health`
- `/v3/api-docs`
- `/swagger-ui/index.html`

Regla importante:

- Controllers deben delegar logica a services.
- Services no deben depender de detalles HTTP.
- Repositories no deben exponer logica de negocio.
- Cambios de schema/datos iniciales deben ir por Flyway.

## CI/CD

- Workflows: `.github/workflows/ci.yml` y `.github/workflows/deploy-railway.yml`.
- Rama productiva: `main`.
- Backend usa Maven Wrapper.
- Deploy usa Railway CLI con `--path-as-root`, `--project` y `--environment production`.

## Pendiente de documentacion de codigo

- Completar documentacion interna de componentes, servicios, DTOs, entidades, repositorios y flujos criticos.
- Priorizar codigo que define contratos publicos, autenticacion, pagos, integraciones externas, carga de datos y permisos por rol.
