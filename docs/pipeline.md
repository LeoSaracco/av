# Pipeline y despliegue - Railway + GitHub Actions

Actualizado: 2026-06-19

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
- SonarQube:
  - depende de Frontend y Backend
  - usa checkout con `fetch-depth: 0` para preservar blame/historial
  - genera coverage frontend con `npm run test:coverage`
  - genera coverage backend con JaCoCo via Maven
  - ejecuta `SonarSource/sonarqube-scan-action`
  - usa `sonar.qualitygate.wait=true` y `sonar.qualitygate.timeout=600`
  - falla el CI si el Quality Gate de SonarQube queda en rojo

Requisitos SonarQube en GitHub:

| Nombre | Tipo | Uso |
|---|---|---|
| `SONAR_TOKEN` | secret | token de analisis del proyecto SonarQube |
| `SONAR_HOST_URL` | secret | URL publica del servidor SonarQube |
| `SONAR_PROJECT_KEY` | variable | project key existente en SonarQube |

Para cargarlos:

```powershell
gh secret set SONAR_TOKEN --repo LeoSaracco/av
gh secret set SONAR_HOST_URL --repo LeoSaracco/av
gh variable set SONAR_PROJECT_KEY --repo LeoSaracco/av --body "<project-key>"
```

Quality Gate exigente:

- El gate se configura y asigna desde SonarQube al proyecto indicado por `SONAR_PROJECT_KEY`.
- El pipeline no crea ni modifica el gate; solo bloquea el CI si SonarQube responde `FAILED`.
- Configuracion recomendada para este repo:
  - New code coverage >= 90%
  - New duplicated lines <= 3%
  - Reliability rating = A
  - Security rating = A
  - Maintainability rating = A
  - Security hotspots reviewed = 100%
  - No blocker/critical issues en new code

### Deploy

Archivo: `.github/workflows/deploy-railway.yml`

Disparadores:

- `workflow_run` cuando `CI` termina
- `workflow_dispatch`

Pasos:

- solo despliega automaticamente si `CI` termino exitoso para un `push` a `master`
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
  -> SonarQube scan + Quality Gate estricto
  -> si es push a master y CI queda verde, Deploy Railway via workflow_run
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
