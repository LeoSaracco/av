# Definition of Done

Actualizado: 2026-06-16

Ningun cambio se considera terminado solo porque compila. Debe estar alineado con arquitectura, seguridad, CI/CD y documentacion.

## Gates generales

- El cambio esta limitado al alcance pedido.
- No introduce secrets.
- Los procesos de negocio nuevos se comunican via API y persisten estado en base.
- Si toca contratacion/pagos/onboarding, debe auditar eventos clave sin datos sensibles.
- No introduce mocks/seed runtime en produccion.
- No usa `localStorage` o `sessionStorage` para auth o datos de negocio.
- Incluye estados de carga/error/vacio cuando toca datos remotos.
- Actualiza docs relevantes si cambia arquitectura, API, pipeline, seguridad o comportamiento publico.

## Frontend

Comandos:

```powershell
cd av-frontend
npm run lint
npm run build
npm test
npm audit --audit-level=high
```

Requisitos:

- Landing no llama endpoints privados.
- Store carga productos solo en rutas de store.
- Coach carga `/api/coach/*` solo en rutas coach autenticadas.
- Cliente carga `/api/me/*` solo en rutas cliente autenticadas.
- Bundle productivo no contiene `localhost:8080`.

## Backend

Comandos:

```powershell
cd av-backend
.\mvnw.cmd test --batch-mode
.\mvnw.cmd package -DskipTests --batch-mode
docker build -t av-backend-audit .
```

En Linux/GitHub Actions:

```bash
chmod +x ./mvnw
./mvnw --batch-mode test
./mvnw --batch-mode package -DskipTests
```

Requisitos:

- `/actuator/health` responde OK.
- Flyway aplica migraciones.
- Swagger responde si la politica vigente lo permite.
- Endpoints privados requieren rol correcto.

## Pipeline

- CI corre en `push` y PR contra `main`.
- Deploy corre en `push` a `main` y manual `workflow_dispatch`.
- Workflows usan `working-directory` correcto:
  - `av-frontend`
  - `av-backend`
- Deploy Railway usa `--path-as-root`.
- Secret requerido: `RAILWAY_TOKEN`.
- Si falla Railway con `Unauthorized`, verificar primero `gh secret list --repo LeoSaracco/av` y que `RAILWAY_TOKEN` exista.

## Documentacion

Actualizar segun corresponda:

- `docs/backlog.md`
- `docs/architecture.md`
- `docs/frontend.md`
- `docs/backend.md`
- `docs/railway.md`
- `docs/pipeline.md`
- `docs/security.md`
- `README.md`

## Pendientes aceptables solo si quedan documentados

- Integraciones externas sin credenciales reales.
- E2E faltantes.
- Politica productiva de Swagger.
- Branch protection no configurable desde el repo local.
