# Seguridad - AV Fitness App

Actualizado: 2026-06-16

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
- Branch protection recomendada para `main`.

## Pendientes

- Activar branch protection en `main`.
- Revisar resultado remoto de `npm audit --audit-level=high` si cambian dependencias.
- Agregar tests de autorizacion por rol en backend.
- Definir politica productiva de Swagger.
- Agregar secret scanning en CI si se decide exigirlo como gate.
