# Arquitectura - AV Fitness App

Actualizado: 2026-06-17

## Vista general

AV Fitness App es un monorepo con frontend React y backend Spring Boot. El backend es la fuente de verdad para datos persistidos; el frontend solo mantiene estado transitorio de UI y cache en memoria durante la sesion.

## Estructura

```text
av/
  av-frontend/
    src/
      api/apiClient.js
      context/AuthContext.jsx
      context/AppContext.jsx
      pages/
      components/
    Dockerfile
    nginx.conf
    vite.config.js
  av-backend/
    src/main/java/com/av/fitness/
      config/
      controller/
      dto/
      model/
      repository/
      service/
    src/main/resources/db/migration/
    Dockerfile
    pom.xml
    mvnw
  docs/
  .github/workflows/
```

## Frontend

- React 19 + Vite 8.
- Routing con `HashRouter`.
- Build Docker multi-stage: Node para build, Nginx para runtime.
- `VITE_API_URL` y `VITE_WS_URL` se inyectan en build con `ARG`/`ENV`.
- `vite.config.js` usa `base: '/'` para Railway.
- Nginx sirve assets reales bajo `/assets/*` y usa fallback SPA solo para rutas de app.

### Carga de datos

La carga esta separada por superficie:

| Superficie | Carga permitida |
|---|---|
| Home `/` | `GET /api/plans` |
| Store `/store` | `GET /api/products` |
| Coach | `/api/coach/*`, solo con usuario coach |
| Cliente | `/api/me/*`, solo con usuario cliente |

No debe haber llamadas globales a endpoints privados al montar la app publica.

## Backend

- Java 21 + Spring Boot.
- PostgreSQL en Railway.
- Flyway para migraciones y seed productivo.
- Spring Security + JWT en cookies httpOnly.
- Swagger/OpenAPI via Springdoc:
  - `/v3/api-docs`
  - `/swagger-ui/index.html`
- Actuator:
  - `/actuator/health`
- Auto-asignacion: Al completar onboarding, el backend crea rutina, dieta, hilo de nutricion y nota de bienvenida por defecto.

## Autenticacion

- Login/register/logout pasan por backend.
- El frontend no persiste tokens ni usuario en storage del navegador.
- Las requests usan `credentials: 'include'` para enviar cookies httpOnly.
- Rutas coach/cliente se protegen en frontend por rol y en backend por Spring Security.
- Verificacion de email: Se envia codigo de 6 digitos via Resend HTTPS API. Tokens expiran en 10 minutos. Endpoints: /api/auth/send-verification y /api/auth/verify-email.
- Cross-Origin: prod usa SameSite=None en cookies para que frontend (av-frontend-production.up.railway.app) y backend (av-backend-production.up.railway.app) compartan sesion.

## Persistencia

- Persistencia de negocio: PostgreSQL.
- Migraciones: `av-backend/src/main/resources/db/migration`.
- Frontend: no usa seed runtime ni storage para negocio.
- Carrito: estado transitorio en memoria hasta que se implemente checkout persistido.

## CI/CD

- CI y deploy corren desde `.github/workflows`.
- Rama productiva esperada: `master`.
- Deploy separado por servicio Railway con `--path-as-root`.
- GitHub Actions necesita el secret `RAILWAY_TOKEN`; no depende de la sesion local del Railway CLI.

Ver `docs/pipeline.md` y `docs/railway.md`.
