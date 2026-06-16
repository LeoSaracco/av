# Railway - Estado operativo y guia para agentes

Actualizado: 2026-06-16

## Estado actual

El repo `LeoSaracco/av` despliega dos servicios Railway desde un monorepo:

| Servicio | Path repo | Railway service | URL |
|---|---|---|---|
| Frontend | `av-frontend/` | `av-frontend` | `https://av-frontend-production.up.railway.app` |
| Backend | `av-backend/` | `av-backend` | `https://av-backend-production.up.railway.app` |
| DB | Railway managed | `Postgres` | interno Railway |

Proyecto Railway:

- Nombre: `av`
- Project ID: `d4fdeffd-14ee-4284-b3aa-327f328e706d`
- Environment: `production`

## Que se hizo en Railway

- Se dejaron servicios separados para frontend y backend dentro del proyecto `av`.
- El frontend se despliega desde `av-frontend/` como raiz de build.
- El backend se despliega desde `av-backend/` como raiz de build.
- Se usa PostgreSQL administrado por Railway para persistencia productiva.
- Se verifico deploy manual de ambos servicios con Railway CLI.
- Se verifico backend health en produccion:

```text
GET https://av-backend-production.up.railway.app/actuator/health
-> {"status":"UP","groups":["liveness","readiness"]}
```

- Se verifico frontend en produccion:

```text
GET https://av-frontend-production.up.railway.app/
-> 200
```

- Se verifico Swagger/OpenAPI:

```text
GET https://av-backend-production.up.railway.app/swagger-ui/index.html
GET https://av-backend-production.up.railway.app/v3/api-docs
-> 200
```

## Deploy manual

Ejecutar desde la raiz del repo:

```powershell
railway up ./av-frontend --path-as-root --project d4fdeffd-14ee-4284-b3aa-327f328e706d --environment production --service av-frontend --detach
railway up ./av-backend --path-as-root --project d4fdeffd-14ee-4284-b3aa-327f328e706d --environment production --service av-backend --detach
```

`--path-as-root` es obligatorio. Cada servicio debe ver su carpeta como raiz para encontrar su propio `Dockerfile`, `package.json` o `pom.xml`.

## Deploy automatico por GitHub Actions

Workflow:

- `.github/workflows/deploy-railway.yml`

Triggers:

- `push` a `main`
- `workflow_dispatch`

Secret requerido:

- `RAILWAY_TOKEN`

El secret debe estar en GitHub, repo `LeoSaracco/av`. La sesion local de `railway whoami` no sirve dentro de GitHub Actions.

Comando correcto para cargar el secret:

```powershell
gh secret set RAILWAY_TOKEN --repo LeoSaracco/av
```

Luego pegar el valor del token cuando `gh` lo pida. No usar el token como nombre del secret.

Verificacion:

```powershell
gh secret list --repo LeoSaracco/av
gh run list --repo LeoSaracco/av --workflow "Deploy Railway" --limit 5
```

## Variables Railway esperadas

Frontend:

| Variable | Valor |
|---|---|
| `VITE_API_URL` | `https://av-backend-production.up.railway.app/api` |
| `VITE_WS_URL` | `wss://av-backend-production.up.railway.app/ws` |

Backend:

| Variable | Uso |
|---|---|
| `SPRING_PROFILES_ACTIVE=production` | perfil productivo |
| `SPRING_DATASOURCE_URL` | JDBC URL Railway Postgres |
| `SPRING_DATASOURCE_USERNAME` | usuario Postgres |
| `SPRING_DATASOURCE_PASSWORD` | password Postgres |
| `JWT_SECRET` | firma de tokens |
| `CORS_ALLOWED_ORIGINS` | frontend productivo y localhost dev |
| `AUTH_COOKIE_SECURE=true` | cookies seguras HTTPS |
| `MERCADOPAGO_ACCESS_TOKEN` | credencial real pendiente |
| `RESEND_API_KEY` | credencial real pendiente |
| `OPENAI_API_KEY` | credencial real pendiente |

No documentar valores secretos en Git.

## Troubleshooting

### `Unauthorized. Please check that your RAILWAY_TOKEN is valid`

Causa probable:

- `RAILWAY_TOKEN` no existe en GitHub.
- El secret fue creado con nombre incorrecto.
- El token no tiene acceso al proyecto Railway `av`.
- El token fue revocado o expiro.

Pasos:

```powershell
gh secret list --repo LeoSaracco/av
gh secret set RAILWAY_TOKEN --repo LeoSaracco/av
gh run rerun <run-id> --repo LeoSaracco/av
```

Si sigue fallando, crear un token nuevo desde Railway con acceso al proyecto `av` y reemplazar el secret.

### Deploy manual funciona pero Actions falla

Esto significa que la sesion local de Railway existe, pero GitHub Actions no tiene token valido. Revisar `RAILWAY_TOKEN`.

### Frontend despliega pero llama mal al backend

Revisar `VITE_API_URL` y `VITE_WS_URL` en variables del servicio `av-frontend`. Las variables Vite se inyectan durante build, por lo que hay que redeployar frontend despues de corregirlas.

### Backend no levanta

Revisar:

- `SPRING_PROFILES_ACTIVE=production`
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- logs del servicio `av-backend`

## Checklist para agentes

1. Trabajar desde `C:\Users\Leandro\Documents\projects\av-final`.
2. Confirmar que el repo local apunta al remoto correcto:

```powershell
git remote -v
git status --short --branch
```

El remoto esperado es `https://github.com/LeoSaracco/av`.

3. Trabajar contra `main` actualizado.
4. Mantener estructura `av-frontend/` y `av-backend/`.
5. No recrear `railway.toml` en raiz para deploy monorepo.
6. No subir `.env`, `.env.production`, `node_modules`, `dist` ni `target`.
7. Confirmar `av-backend/mvnw` como executable en Git si se toca:

```powershell
git update-index --chmod=+x av-backend/mvnw
```

8. Validar CI local antes de push:

```powershell
cd av-frontend
npm ci
npm run lint
npm run build
npm test
npm audit --audit-level=high

cd ..\av-backend
.\mvnw.cmd test --batch-mode
.\mvnw.cmd package -DskipTests --batch-mode
```

9. Despues de push a `main`, revisar:

```powershell
gh run list --repo LeoSaracco/av --limit 5
```

10. Verificar produccion:

```powershell
Invoke-RestMethod https://av-backend-production.up.railway.app/actuator/health
Invoke-WebRequest https://av-frontend-production.up.railway.app/ -UseBasicParsing
```

## Queries de validacion en base

Usar estas consultas contra PostgreSQL de Railway para confirmar que el flujo `Plan -> Pago mock -> Formulario -> Usuario` persistio correctamente.

### Ultimos contratos

```sql
SELECT
  id,
  plan_id,
  payment_id,
  onboarding_id,
  user_id,
  client_id,
  email,
  status,
  created_at,
  updated_at,
  completed_at
FROM plan_contracts
ORDER BY created_at DESC
LIMIT 20;
```

### Pagos mock MercadoPago preparados para integracion real

```sql
SELECT
  id,
  contract_id,
  client_id,
  plan_id,
  preference_id,
  status,
  amount,
  currency,
  provider,
  provider_mode,
  external_reference,
  init_point,
  created_at,
  updated_at
FROM payments
ORDER BY created_at DESC
LIMIT 20;
```

Valores esperados hoy:

- `provider = 'MERCADOPAGO'`
- `provider_mode = 'MOCK'`
- `status = 'APPROVED'` despues del mock payment

### Formularios guardados

```sql
SELECT
  id,
  plan_id,
  client_id,
  form_data->>'email' AS email,
  form_data->>'name' AS name,
  form_data->>'purpose' AS goal,
  submitted_at
FROM onboarding_submissions
ORDER BY submitted_at DESC
LIMIT 20;
```

### Usuario y cliente creados

```sql
SELECT
  u.id AS user_id,
  u.email,
  u.role,
  u.client_id,
  c.name,
  c.phone,
  c.goal,
  c.status,
  c.join_date
FROM users u
JOIN clients c ON c.id = u.client_id
ORDER BY u.created_at DESC
LIMIT 20;
```

### Auditoria del flujo

```sql
SELECT
  event_type,
  aggregate_type,
  aggregate_id,
  actor_user_id,
  client_id,
  payload,
  created_at
FROM audit_events
ORDER BY created_at DESC
LIMIT 50;
```

Eventos esperados para una contratacion completa:

- `CONTRACT_STARTED`
- `PAYMENT_MOCK_CREATED`
- `PAYMENT_MOCK_APPROVED`
- `ONBOARDING_SUBMITTED`
- `USER_CREATED`
- `CONTRACT_COMPLETED`

### Validacion por email puntual

Reemplazar `mail@ejemplo.com` por el email usado en el formulario.

```sql
SELECT
  id,
  plan_id,
  payment_id,
  onboarding_id,
  user_id,
  client_id,
  email,
  status,
  created_at,
  completed_at
FROM plan_contracts
WHERE email = 'mail@ejemplo.com'
ORDER BY created_at DESC;
```

```sql
SELECT
  p.id,
  p.contract_id,
  p.client_id,
  p.plan_id,
  p.preference_id,
  p.status,
  p.provider,
  p.provider_mode,
  p.external_reference,
  p.created_at
FROM payments p
JOIN plan_contracts pc ON pc.id = p.contract_id
WHERE pc.email = 'mail@ejemplo.com'
ORDER BY p.created_at DESC;
```

```sql
SELECT
  id,
  plan_id,
  client_id,
  form_data,
  submitted_at
FROM onboarding_submissions
WHERE form_data->>'email' = 'mail@ejemplo.com'
ORDER BY submitted_at DESC;
```

```sql
SELECT
  u.id AS user_id,
  u.email,
  u.role,
  u.client_id,
  c.name,
  c.phone,
  c.goal,
  c.status
FROM users u
JOIN clients c ON c.id = u.client_id
WHERE u.email = 'mail@ejemplo.com';
```

```sql
SELECT
  ae.event_type,
  ae.aggregate_type,
  ae.aggregate_id,
  ae.actor_user_id,
  ae.client_id,
  ae.payload,
  ae.created_at
FROM audit_events ae
LEFT JOIN plan_contracts pc
  ON pc.id = ae.aggregate_id
  OR pc.payment_id = ae.aggregate_id
  OR pc.onboarding_id = ae.aggregate_id
  OR pc.user_id = ae.aggregate_id
WHERE pc.email = 'mail@ejemplo.com'
   OR ae.payload::text ILIKE '%mail@ejemplo.com%'
ORDER BY ae.created_at DESC;
```
