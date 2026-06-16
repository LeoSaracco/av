# Pipeline y despliegue - Railway + GitHub Actions

Actualizado: 2026-06-15

## Repositorio

- GitHub: `https://github.com/LeoSaracco/av.git`
- Rama productiva esperada: `main`
- Estructura: monorepo con `av-frontend/` y `av-backend/`

## Railway

Proyecto: `av`

Servicios:

| Servicio | Tipo | URL |
|---|---|---|
| `av-frontend` | React + Vite + Nginx | `https://av-frontend-production.up.railway.app` |
| `av-backend` | Spring Boot | `https://av-backend-production.up.railway.app` |
| `Postgres` | PostgreSQL | interno Railway |

Deploy manual:

```powershell
railway up ./av-frontend --path-as-root --project d4fdeffd-14ee-4284-b3aa-327f328e706d --environment production --service av-frontend --detach
railway up ./av-backend --path-as-root --project d4fdeffd-14ee-4284-b3aa-327f328e706d --environment production --service av-backend --detach
```

El flag `--path-as-root` es obligatorio porque cada app se despliega desde su carpeta como raiz de build.

## Variables Railway

Frontend:

| Variable | Valor |
|---|---|
| `VITE_API_URL` | `https://av-backend-production.up.railway.app/api` |
| `VITE_WS_URL` | `wss://av-backend-production.up.railway.app/ws` |

Backend:

| Variable | Uso |
|---|---|
| `SPRING_PROFILES_ACTIVE=production` | perfil productivo |
| `SPRING_DATASOURCE_URL` | JDBC URL a Postgres Railway |
| `SPRING_DATASOURCE_USERNAME` | usuario Postgres |
| `SPRING_DATASOURCE_PASSWORD` | password Postgres |
| `JWT_SECRET` | firma JWT |
| `CORS_ALLOWED_ORIGINS` | frontend productivo y localhost dev |
| `AUTH_COOKIE_SECURE=true` | cookies seguras en HTTPS |
| `MERCADOPAGO_ACCESS_TOKEN` | pendiente credencial real |
| `RESEND_API_KEY` | pendiente credencial real |
| `OPENAI_API_KEY` | pendiente credencial real |

## GitHub Actions

### CI

Archivo: `.github/workflows/ci.yml`

Disparadores:

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

Jobs:

- Frontend:
  - `npm ci`
  - `npm run lint`
  - `npm run build`
  - `npm test`
  - `npm audit --audit-level=high`
- Backend:
  - Postgres service `postgres:16-alpine`
  - `./mvnw --batch-mode test`
  - `./mvnw --batch-mode package -DskipTests`

### Deploy

Archivo: `.github/workflows/deploy-railway.yml`

Disparadores:

- `push` a `main`
- `workflow_dispatch`

Pasos:

- instala Railway CLI
- despliega `av-frontend` con `--path-as-root`, `--project` y `--environment production`
- despliega `av-backend` con `--path-as-root`, `--project` y `--environment production`

Requisito:

- secret GitHub `RAILWAY_TOKEN`

## Flujo esperado

```text
push/PR a main
  -> CI
  -> lint/build/tests/audit frontend
  -> tests/package backend
  -> si es push a main, deploy Railway
  -> verificar /actuator/health y frontend
```

## Verificacion remota pendiente despues del proximo push

```powershell
gh workflow list --repo LeoSaracco/av
gh run list --repo LeoSaracco/av
gh run view <run-id> --log-failed
```

## Rollback

- Railway conserva historial de deployments por servicio.
- Usar rollback desde Railway dashboard o CLI si un deploy falla funcionalmente.
- Las migraciones Flyway deben ser backward-compatible.
