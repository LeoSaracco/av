# Frontend - Arquitectura y lineamientos

Actualizado: 2026-06-17

## Stack

| Capa | Tecnologia |
|---|---|
| UI | React 19 |
| Build | Vite 8 |
| Routing | react-router-dom HashRouter |
| Charts | Recharts |
| Tests | Vitest + Testing Library |
| Runtime Railway | Nginx |

## Principios

- El backend es la fuente de verdad.
- No usar `localStorage` ni `sessionStorage` para auth o datos de negocio.
- No importar seed/mocks en runtime productivo.
- Los componentes de pagina no deben llamar `fetch` directo; deben usar `apiClient` o funciones expuestas por contexto.
- La landing publica no debe cargar datos privados.
- Los errores de API deben mostrarse como estados de carga/error/vacio, no con fallback seed.
- El pago mock debe comunicarse por API y persistirse; no debe ser una simulacion solo local.

## Capas

```text
pages/components -> context -> apiClient -> backend
```

- `apiClient.js`: cliente HTTP unico, normaliza modelos API.
- `AuthContext.jsx`: login/register/logout y rol actual.
- `AppContext.jsx`: estado en memoria y operaciones de negocio.
- `CoachLayout.jsx`: dispara carga coach.
- `ClientLayout.jsx`: dispara carga cliente.
- `Store.jsx`/`ProductDetail.jsx`: disparan carga de productos.
- `PaymentSimulator.jsx`: inicia contrato y confirma pago mock por API.
- `Onboarding.jsx`: completa contrato, crea usuario/cliente y guarda formulario por API.

## Componentes

### Loader.jsx

Loader.jsx: spinner reutilizable con color verde (--color-accent). Soporta 3 modos: fullPage (overlay centrado), inline (flex row), y default (solo spinner). Tamanos: sm (20px), md (32px), lg (48px).

### SearchSelect

Componente interno en `Assign.jsx`. Buscador + dropdown custom sin dependencias.
Reemplaza `<select>` cuando hay mas de ~10 opciones y el usuario necesita
buscar/filtrar. Props: `options`, `value`, `onChange`, `placeholder`, `disabled`,
`mobile`. Dropdown con `position: absolute`, `z-index: 60`, `max-height` dinamico.
En mobile hace `dropUp` si no hay espacio abajo. Cierre al click fuera via
`mousedown` listener en `document`.

### StepIndicator

Indicador visual de pasos (`●━━○━━○`) para flujos multi-etapa dentro de modales.
Usado en el modal de Asignar/Reasignar rutina.

### `useIsMobile()` hook

Hook que detecta `window.innerWidth < 480` y se actualiza en `resize`.
Usado en modales y componentes para adaptar layout mobile vs desktop.

## Fix visuales - Junio 2026

- word-break en titulo de rutina (ClientDashboard)
- display:flex column en .card para que gap funcione
- borde verde consistente en todas las cards de historial
- boton Crear cuenta deshabilitado hasta codeSent

## Variables

`av-frontend/.env.local.example`:

```env
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
```

En Railway:

```env
VITE_API_URL=https://av-backend-production.up.railway.app/api
VITE_WS_URL=wss://av-backend-production.up.railway.app/ws
```

Servicio Railway productivo:

- Proyecto: `av` (`d4fdeffd-14ee-4284-b3aa-327f328e706d`)
- Servicio: `av-frontend`
- URL: `https://av-frontend-production.up.railway.app`
- Deploy desde repo: `railway up ./av-frontend --path-as-root --project d4fdeffd-14ee-4284-b3aa-327f328e706d --environment production --service av-frontend --detach`

## Build Docker

El Dockerfile debe pasar variables Vite antes de `npm run build`:

```dockerfile
ARG VITE_API_URL
ARG VITE_WS_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL
```

## Validacion

```powershell
cd av-frontend
npm ci
npm run lint
npm run build
npm test
npm audit --audit-level=high
```

Estado validado:

- lint OK
- build OK
- 25 tests OK

## Pendientes frontend (actualizado 2026-06-17)

- Agregar E2E que capture requests del home y falle si aparecen `/api/coach/*` o `/api/me/*`.
- Mejorar code splitting: el bundle supera 500 KB y Vite emite warning.
- Revisar vulnerabilidades de `npm audit --audit-level=high` en CI.
- Documentar componentes con JSDoc (COMPLETADO).
- Reemplazar stubs restantes de UI, por ejemplo upload real de avatar y reconexion WebSocket.
