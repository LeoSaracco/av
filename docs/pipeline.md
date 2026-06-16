# Pipeline y despliegue - Railway + GitHub Actions

Actualizado: 2026-06-16

## Repositorio

- GitHub: `https://github.com/LeoSaracco/av.git`
- Rama productiva esperada: `master`
- Estructura: monorepo con `av-frontend/` y `av-backend/`

## Railway

Proyecto: `av`

Project ID: `d4fdeffd-14ee-4284-b3aa-327f328e706d`

Servicios:

| Servicio | Tipo | URL |
|---|---|---|
| `av-frontend` | React + Vite + Nginx | `https://av-frontend-production.up.railway.app` |
| `av-backend` | Spring Boot | `https://av-backend-production.up.railway.app` |
| `Postgres` | PostgreSQL | interno Railway |

Estado operativo validado el 2026-06-16:

- Deploy manual de `av-frontend` enviado con `railway up`.
- Deploy manual de `av-backend` enviado con `railway up`.
- Frontend respondio `200` en `/`.
- Backend respondio `{"status":"UP","groups":["liveness","readiness"]}` en `/actuator/health`.
- Swagger y OpenAPI respondieron `200`.

Deploy manual:

```powershell
railway up ./av-frontend --path-as-root --project d4fdeffd-14ee-4284-b3aa-327f328e706d --environment production --service av-frontend --detach
railway up ./av-backend --path-as-root --project d4fdeffd-14ee-4284-b3aa-327f328e706d --environment production --service av-backend --detach
```

El flag `--path-as-root` es obligatorio porque cada app se despliega desde su carpeta como raiz de build.

Importante para agentes:

- Ejecutar los comandos desde la raiz del repo.
- No usar `railway.toml` en raiz; el repo despliega dos servicios separados por path.
- Si se usa CLI local, `railway whoami` solo valida la sesion local. GitHub Actions no usa esa sesion.
- GitHub Actions requiere el secret `RAILWAY_TOKEN`.

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
    branches: [master]
  pull_request:
    branches: [master]
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

- `push` a `master`
- `workflow_dispatch`

Pasos:

- instala Railway CLI
- despliega `av-frontend` con `--path-as-root`, `--project` y `--environment production`
- despliega `av-backend` con `--path-as-root`, `--project` y `--environment production`

Requisito:

- secret GitHub `RAILWAY_TOKEN`

El secret debe existir en el repo `LeoSaracco/av` con nombre exacto `RAILWAY_TOKEN`.
Para cargarlo:

```powershell
gh secret set RAILWAY_TOKEN --repo LeoSaracco/av
```

No pasar el token como nombre del secret. El comando correcto pide el valor por stdin/interactivo. Verificar:

```powershell
gh secret list --repo LeoSaracco/av
```

## Flujo esperado

```text
push/PR a master
  -> CI
  -> lint/build/tests/audit frontend
  -> tests/package backend
  -> si es push a master, deploy Railway
  -> verificar /actuator/health y frontend
```

## Verificacion remota pendiente despues del proximo push

```powershell
gh workflow list --repo LeoSaracco/av
gh run list --repo LeoSaracco/av
gh run view <run-id> --log-failed
```

Si deploy falla con `Unauthorized. Please check that your RAILWAY_TOKEN is valid...`:

1. Confirmar que existe `RAILWAY_TOKEN`:

```powershell
gh secret list --repo LeoSaracco/av
```

2. Si falta o fue cargado con nombre incorrecto, cargarlo de nuevo:

```powershell
gh secret set RAILWAY_TOKEN --repo LeoSaracco/av
```

3. Re-ejecutar el run:

```powershell
gh run rerun <run-id> --repo LeoSaracco/av
```

4. Si sigue fallando, generar un token nuevo en Railway con acceso al proyecto `av`.

## Rollback

- Railway conserva historial de deployments por servicio.
- Usar rollback desde Railway dashboard o CLI si un deploy falla funcionalmente.
- Las migraciones Flyway deben ser backward-compatible.
