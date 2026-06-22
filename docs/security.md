# Seguridad - AV Fitness App

Actualizado: 2026-06-17

## Estado actual

La aplicacion usa backend real con Spring Security y cookies httpOnly. El frontend no debe guardar tokens, usuario ni datos de negocio en `localStorage` o `sessionStorage`.

## Reglas obligatorias

- Auth administrada por backend.
- Cookies httpOnly para sesion/JWT.
- `AUTH_COOKIE_SECURE=true` en produccion.
- `SameSite=None` si frontend y backend estan en dominios Railway separados.
- CORS limitado a dominios conocidos.
- Nada de secrets en repo.
- Nada de tokens, passwords, auth headers ni PII sensible en logs.
- La auditoria no debe guardar passwords, tokens, cookies, CVV ni numero completo de tarjeta.
- Endpoints `/api/coach/*` requieren rol coach.
- Endpoints `/api/me/*` requieren usuario autenticado cliente.
- Endpoints publicos permitidos: auth, plans, products, onboarding, payment public flow, health y Swagger segun politica vigente.
- Endpoints publicos de contratacion permitidos: `/api/plan-contracts/start`, `/api/plan-contracts/{id}/mock-payment`, `/api/plan-contracts/{id}/complete-onboarding`.

## Storage navegador

Permitido:

- Estado React en memoria.
- Preferencias no sensibles solo si se aprueba explicitamente.

Prohibido:

- JWT/access tokens.
- refresh tokens.
- usuario autenticado.
- clientes, rutinas, dietas, notas, progreso, asignaciones, pagos, threads.
- seed fallback de negocio.

## Cookies

- SameSite=None configurado via auth.cookie-secure=true en produccion para soportar cross-origin entre av-frontend-production.up.railway.app y av-backend-production.up.railway.app.

## Swagger

Actualmente:

- `/v3/api-docs` publico.
- `/swagger-ui/index.html` publico.

Riesgo pendiente:

- Decidir si Swagger debe quedar publico en produccion o restringirse por perfil/rol.

## CI security gates

- `npm audit --audit-level=high` bloqueante en frontend.
- Backend compila y testea con Maven Wrapper.
- GitHub secret requerido: `RAILWAY_TOKEN`; no documentar nunca su valor.
- Workflow manual `tenable-scan.yml` para Tenable.io / Tenable Vulnerability Management.
- Secrets requeridos para Tenable: `TENABLE_ACCESS_KEY`, `TENABLE_SECRET_KEY`, `TENABLE_SCAN_ID`; no documentar nunca sus valores.
- El gate Tenable falla por defecto con hallazgos `critical` o `high`.
- Branch protection recomendada para `master`.

## Tenable.io

El scan productivo debe configurarse en Tenable.io y guardarse como un scan reutilizable. El workflow de GitHub Actions solo lanza el scan, espera finalizacion, exporta resultados CSV y aplica el gate de severidad.

Uso recomendado:

1. Configurar en Tenable.io los targets productivos que correspondan a Railway.
2. Guardar el ID del scan en el secret `TENABLE_SCAN_ID`.
3. Ejecutar manualmente `Tenable Vulnerability Scan` desde GitHub Actions.
4. Revisar el summary del job y el artefacto `tenable-results-*`.

Inputs del workflow:

- `scan_id`: override opcional del secret `TENABLE_SCAN_ID`.
- `launch_scan`: si esta activo, dispara el scan antes de exportar.
- `wait_for_completion`: si esta activo, espera el resultado antes del export.
- `alt_targets`: override opcional de targets separados por coma.
- `fail_on_severities`: severidades que bloquean el job, por defecto `critical,high`.

## Pendientes

- Activar branch protection en `master`.
- Revisar resultado remoto de `npm audit --audit-level=high` si cambian dependencias.
- Agregar tests de autorizacion por rol en backend.
- Definir politica productiva de Swagger.
- Agregar secret scanning en CI si se decide exigirlo como gate.
- Email verification tokens con expiracion de 10 minutos y limpieza programada cada 1 hora. (COMPLETADO)
