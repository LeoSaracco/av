# Backlog — AV Fitness App

## Prioridad: P0 — Crítico (bloquea producción)

| ID | Tarea | Estado | Archivos |
|----|-------|--------|----------|
| B-01 | Crear backend Spring Boot (hexagonal) | Pendiente | `backend/` (nuevo) |
| B-02 | Migrar `localStorage` a PostgreSQL | Pendiente | `backend/`, `AppContext.jsx` |
| B-03 | Implementar JWT auth (reemplazar mock) | Pendiente | `backend/`, `AuthContext.jsx` |
| B-04 | Integrar MercadoPago real (webhook + Checkout Pro) | Pendiente | `backend/`, `PaymentSimulator.jsx` |
| B-05 | Email verification real (Resend/SendGrid) | Pendiente | `backend/`, `Step5Account.jsx` |
| B-06 | Configurar Railway + GitHub Actions CI/CD | Pendiente | `.github/workflows/`, `railway.toml` |

## Prioridad: P1 — Alta (próximo sprint)

| ID | Tarea | Estado | Archivos |
|----|-------|--------|----------|
| B-07 | Agregar test framework (Vitest + Testing Library) | Pendiente | `src/` tests |
| B-08 | Unit tests para componentes onboarding | Pendiente | `src/components/onboarding/__tests__/` |
| B-09 | E2E tests con Playwright (flujo completo) | Pendiente | `e2e/` (nuevo) |
| B-10 | Reemplazar `PaymentSimulator` con integración MP real | Pendiente | `PaymentSimulator.jsx` → MP redirect |
| B-11 | Mover estilos inline a CSS classes (Onboarding) | Pendiente | `onboarding/` components |
| B-12 | Code splitting con `React.lazy` (rutas coach/client) | Pendiente | `App.jsx` |
| B-13 | Agregar `react-helmet-async` para meta tags SEO | Pendiente | Layouts |

## Prioridad: P2 — Media (mejoras)

| ID | Tarea | Estado | Archivos |
|----|-------|--------|----------|
| B-14 | Dashboard coach: gráficos con Recharts | Pendiente | `CoachDashboard.jsx` |
| B-15 | Notificaciones push (WebSocket) | Pendiente | `backend/`, layouts |
| B-16 | Subida de avatar para clientes | Pendiente | `ClientDetail.jsx`, backend |
| B-17 | Planes con precios dinámicos desde backend | Pendiente | `Landing.jsx`, `seed.js` |
| B-18 | IA real (OpenAI/Claude) en lugar de mock | Pendiente | `ClientAIAssistant.jsx`, backend |
| B-19 | Panel admin para multi-coach | Pendiente | Nuevo rol + rutas |
| B-20 | i18n: soporte inglés + español | Pendiente | Todo el frontend |

## Prioridad: P3 — Baja (nice to have)

| ID | Tarea | Estado | Archivos |
|----|-------|--------|----------|
| B-21 | PWA: service worker, offline support | Pendiente | `vite.config.js` |
| B-22 | Dark/light theme toggle | Pendiente | `global.css`, layouts |
| B-23 | Exportar datos a PDF (progreso, rutinas) | Pendiente | `ClientProgress.jsx` |
| B-24 | Integración con Apple Health / Google Fit | Pendiente | `ClientProgress.jsx`, backend |
| B-25 | Videos de ejercicios embebidos | Pendiente | `ClientRoutine.jsx` |

## Deuda Técnica

| ID | Tarea | Estado | Archivos |
|----|-------|--------|----------|
| DT-01 | Remover `App.css` y `index.css` (legacy, no importados) | Completado | `src/App.css`, `src/index.css` |
| DT-02 | Limpiar assets legacy (`react.svg`, `vite.svg`) | Completado | `src/assets/` |
| DT-03 | Documentar todos los componentes con JSDoc | En progreso | `src/pages/`, `src/components/` |
| DT-04 | Migrar estilos inline a `global.css` donde sea posible | Pendiente | Varios |
| DT-05 | Agregar `.editorconfig` para consistencia de tabs/espacios | Completado | Raíz |
| DT-06 | Configurar `husky` + `lint-staged` para pre-commit hooks | Completado | `.husky/`, `package.json` |

## Completado

| ID | Tarea | Commit |
|----|-------|--------|
| B-00a | Onboarding flow: planes → pago → formulario 6 pasos | `1ea4436` |
| B-00b | PaymentSimulator estilo MercadoPago | `1ea4436` |
| B-00c | Refactor Onboarding en componentes separados | `1ea4436` |
| B-00d | A11y: aria attributes en todos los forms | `1ea4436` |
| B-00e | Docs: architecture, frontend, backend, security, pipeline, dod | `1ea4436` |
| B-00f | Lint fixes: 16 pre-existing errors corregidos | `1ea4436` |
| B-00g | Responsive: breakpoints 380/400/640/700/768/1024px | `1ea4436` |
| F1-01 | DT-01 + DT-02: archivos legacy removidos | `pendiente` |
| F1-02 | DT-05: `.editorconfig` creado | `pendiente` |
| F1-03 | DT-06: husky + lint-staged configurados | `pendiente` |

## Reporte de Quality Gates — Último check

```
✅ Build:        PASS (vite build)
✅ Lint:         PASS (0 errors, 0 warnings)
✅ Tests:        PASS (26/26, 3 suites)
✅ Secrets:      PASS (0 hardcoded secrets found)
✅ TODO/FIXME:   PASS (0 stubs found)
✅ Componentes:  PASS (todos < 200 líneas)
✅ Husky:        PASS (pre-commit hook: lint-staged)
✅ EditorConfig: PASS (.editorconfig presente)
✅ JSDoc:        PASS (37 files documentados)
⬜ E2E:          NOT CONFIGURED
⬜ Backend:      NOT STARTED
⬜ CI/CD:        NOT CONFIGURED
```
