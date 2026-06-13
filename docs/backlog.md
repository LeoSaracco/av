# Backlog — AV Fitness App

## Prioridad: P0 — Crítico (bloquea producción)

| ID | Tarea | Estado | Archivos |
|----|-------|--------|----------|
| B-01 | Crear backend Spring Boot (hexagonal) | Completado | `backend/` (scaffold con stubs) |
| B-02 | Migrar `localStorage` a PostgreSQL | Pendiente | `backend/`, `AppContext.jsx` |
| B-03 | Implementar JWT auth (reemplazar mock) | Pendiente | `backend/`, `AuthContext.jsx` |
| B-04 | Integrar MercadoPago real (webhook + Checkout Pro) | Pendiente | `backend/`, `PaymentSimulator.jsx` |
| B-05 | Email verification real (Resend/SendGrid) | Pendiente | `backend/`, `Step5Account.jsx` |
| B-06 | Configurar Railway + GitHub Actions CI/CD | Completado | `.github/workflows/`, `railway.toml` |

## Prioridad: P1 — Alta (próximo sprint)

| ID | Tarea | Estado | Archivos |
|----|-------|--------|----------|
| B-07 | Agregar test framework (Vitest + Testing Library) | Completado | `src/`, `vite.config.js` |
| B-08 | Unit tests para componentes onboarding | Completado | `src/components/onboarding/__tests__/` |
| B-09 | E2E tests con Playwright (flujo completo) | Pendiente | `e2e/` (nuevo) |
| B-10 | Reemplazar `PaymentSimulator` con integración MP real | Pendiente | `PaymentSimulator.jsx` → MP redirect |
| B-11 | Mover estilos inline a CSS classes (Onboarding) | Completado | `onboarding/` components |
| B-12 | Code splitting con `React.lazy` (rutas coach/client) | Completado | `App.jsx` (27 chunks) |
| B-13 | Agregar `react-helmet-async` para meta tags SEO | Completado | `main.jsx`, `Landing.jsx`, `index.html` |

## Prioridad: P2 — Media (mejoras)

| ID | Tarea | Estado | Archivos |
|----|-------|--------|----------|
| B-14 | Dashboard coach: gráficos con Recharts | Completado | `CoachDashboard.jsx` |
| B-15 | Notificaciones push (WebSocket) | Pendiente | `backend/`, layouts |
| B-16 | Subida de avatar para clientes | Pendiente | `ClientDetail.jsx`, backend |
| B-17 | Planes con precios dinámicos desde backend | Pendiente | `Landing.jsx`, `seed.js` |
| B-18 | IA real (OpenAI/Claude) en lugar de mock | Pendiente | `ClientAIAssistant.jsx`, backend |
| B-19 | Panel admin para multi-coach | Pendiente | Nuevo rol + rutas |
| B-20 | i18n: soporte inglés + español | Completado | `src/i18n/`, `Landing.jsx` |

## Prioridad: P3 — Baja (nice to have)

| ID | Tarea | Estado | Archivos |
|----|-------|--------|----------|
| B-21 | PWA: service worker, offline support | Completado | `vite.config.js` (PWA plugin) |
| B-22 | Dark/light theme toggle | Completado | `ThemeToggle.jsx`, `global.css` |
| B-23 | Exportar datos a PDF (progreso, rutinas) | Pendiente | `ClientProgress.jsx` |
| B-24 | Integración con Apple Health / Google Fit | Pendiente | `ClientProgress.jsx`, backend |
| B-25 | Videos de ejercicios embebidos | Completado | `ClientRoutine.jsx` |

## Deuda Técnica

| ID | Tarea | Estado |
|----|-------|--------|
| DT-01 | Remover `App.css` y `index.css` (legacy) | Completado |
| DT-02 | Limpiar assets legacy (`react.svg`, `vite.svg`) | Completado |
| DT-03 | Documentar todos los componentes con JSDoc | Completado |
| DT-04 | Migrar estilos inline a `global.css` | Completado |
| DT-05 | Agregar `.editorconfig` | Completado |
| DT-06 | Configurar `husky` + `lint-staged` | Completado |

## Resumen por Fase

| Fase | Entregables | Estado |
|------|-------------|--------|
| F1 | Cleanup, editorconfig, husky, JSDoc en 37 archivos | ✅ Completado |
| F2 | Vitest + 26 tests (FormPrimitives, StepsTrack, AuthContext) | ✅ Completado |
| F3 | Code splitting (27 chunks), SEO (Helmet), PWA (service worker) | ✅ Completado |
| F4 | Backend scaffold (Spring Boot hexagonal), Railway + CI/CD config | ✅ Completado |
| F5 | Auth, payment, email — stubs en backend, integración real pendiente | ⬜ Pendiente |
| F6 | Charts coach, i18n (es/en), theme toggle, video embeds | ✅ Completado |
| F7 | PWA, theme toggle, i18n, video embeds completados; PDF/Health pendiente | ⬜ Parcial |

## Reporte de Quality Gates — Último check

```
✅ Build:        PASS (vite build, 27 chunks + PWA)
✅ Lint:         PASS (0 errors, 0 warnings)
✅ Tests:        PASS (26/26, 3 suites)
✅ Secrets:      PASS (0 hardcoded secrets found)
✅ TODO/FIXME:   PASS (0 stubs in frontend)
✅ Componentes:  PASS (todos < 200 líneas)
✅ Husky:        PASS (pre-commit hook: lint-staged)
✅ EditorConfig: PASS (.editorconfig presente)
✅ JSDoc:        PASS (37 archivos documentados)
✅ PWA:          PASS (service worker generado, offline ready)
✅ CodeSplit:    PASS (27 chunks lazy-loading)
✅ Backend:      SCAFFOLD (stubs compilables, lógica pendiente)
✅ CI/CD:        CONFIGURED (.github + railway.toml)
⬜ E2E:          NOT CONFIGURED
```
