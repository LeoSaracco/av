# Componentes UI — Patrones y lineamientos

Actualizado: 2026-06-17

Guia de referencia para todos los componentes y patrones de UI usados en
AV Fitness. Cada seccion describe el proposito, cuando usarlo, y un
ejemplo de codigo.

---

## 1. Spinner inline (`inlineSpinnerStyle`)

**Ubicacion:** `src/utils/spinnerStyle.js`

Spinner CSS inline para usar dentro de botones durante operaciones async
(save, delete, loading). No usa el componente `Loader` — es un div
minimo que gira con animacion CSS.

### Variantes

| Contexto | Color (arco) | Fondo (track) | Tamaño | Ejemplo |
|----------|-------------|---------------|--------|---------|
| Boton verde (`.btn-primary`) | `#000` negro | `rgba(0,0,0,0.25)` | 18px | Guardar, Crear |
| Boton rojo (`.btn-danger`) | `#fff` blanco | `rgba(255,255,255,0.25)` | 16px | Eliminar |

### Cuando usarlo

- En botones de **Guardar / Crear / Editar** dentro de modales (spinner negro)
- En botones de **Eliminar** dentro de `ConfirmModal` (spinner blanco)
- NUNCA como texto "Guardando..." o "Eliminando..."

### Ejemplo — Boton guardar

```jsx
import { inlineSpinnerStyle } from '../../utils/spinnerStyle';

<button
  className="btn btn-primary"
  onClick={handleSave}
  disabled={saving}
  style={saving ? { minWidth: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 } : {}}
>
  {saving ? <div style={inlineSpinnerStyle(18, '#000', 'rgba(0,0,0,0.25)')} /> : 'Guardar'}
</button>
```

### Ejemplo — Boton eliminar (ConfirmModal)

```jsx
<ConfirmModal
  confirmDisabled={deleting}
  confirmLabel={deleting
    ? <div style={inlineSpinnerStyle(16, '#fff', 'rgba(255,255,255,0.25)')} />
    : 'Eliminar'
  }
/>
```

---

## 2. Modal

**Ubicacion:** `src/components/ui/Modals.jsx`

Contenedor overlay para formularios CRUD o vistas de detalle.

### Estructura

```
┌──────────────────────────────────────┐
│  TITULO                          [X] │  ← header
├──────────────────────────────────────┤
│                                      │
│  BODY (form inputs / contenido)      │  ← children
│                                      │
├──────────────────────────────────────┤
│  [msg error]  [Cancelar] [Guardar]   │  ← footer
└──────────────────────────────────────┘
```

### Estados obligatorios

Todo Modal debe tener estos estados:

| Estado | Hook | Efecto |
|--------|------|--------|
| `saving` | `useState(false)` | Spinner en boton save, botones disabled |
| `saveError` | `useState('')` | Mensaje rojo en footer si falla |

### Patron handleSave

```jsx
const handleSave = async () => {
  if (!form.name.trim()) return;
  setSaving(true);
  setSaveError('');
  try {
    await saveFunction(form);
    setModalOpen(false);
  } catch (err) {
    setSaveError(err.message || 'Error al guardar');
  } finally {
    setSaving(false);
  }
};
```

### Patron footer

```jsx
footer={
  <>
    {saveError && <span style={{ fontSize: 12, color: 'var(--color-danger)', marginRight: 'auto' }}>{saveError}</span>}
    <button className="btn btn-ghost" onClick={() => setModalOpen(false)} disabled={saving}>Cancelar</button>
    <button className="btn btn-primary" onClick={handleSave} disabled={saving}
      style={saving ? { minWidth: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 } : {}}>
      {saving ? <div style={inlineSpinnerStyle(18, '#000', 'rgba(0,0,0,0.25)')} /> : 'Guardar'}
    </button>
  </>
}
```

---

## 3. ConfirmModal

**Ubicacion:** `src/components/ui/Modals.jsx`

Dialogo de confirmacion para acciones destructivas (eliminar).

### Props

| Prop | Tipo | Descripcion |
|------|------|-------------|
| `open` | boolean | Controla visibilidad |
| `onClose` | function | Cierra sin confirmar |
| `onConfirm` | function | Ejecuta la accion |
| `title` | string | Titulo del dialogo |
| `message` | string | Cuerpo del mensaje |
| `confirmDisabled` | boolean | Deshabilita boton confirmar |
| `confirmLabel` | ReactNode | Contenido del boton (texto o spinner) |

### Estados obligatorios

| Hook | Efecto |
|------|--------|
| `deleting` | `useState(false)` — spinner blanco en boton, botones disabled |

### Patron completo

```jsx
const [confirmId, setConfirmId] = useState(null);
const [deleting, setDeleting] = useState(false);

<ConfirmModal
  open={!!confirmId}
  onClose={() => { if (!deleting) setConfirmId(null); }}
  onConfirm={async () => {
    setDeleting(true);
    try { await deleteFunction(confirmId); } catch { /* toast shown by context */ }
    setDeleting(false);
    setConfirmId(null);
  }}
  title="Eliminar"
  message="Esta accion no se puede deshacer."
  confirmDisabled={deleting}
  confirmLabel={deleting
    ? <div style={inlineSpinnerStyle(16, '#fff', 'rgba(255,255,255,0.25)')} />
    : 'Eliminar'
  }
/>
```

### Anti-patron (NO hacer)

```jsx
// ❌ Sin spinner, sin disabled — posible doble click
<ConfirmModal
  onConfirm={() => { deleteItem(id); setConfirmId(null); }}
/>
```

---

## 4. Form inputs

### Estructura

```jsx
<div className="form-group">
  <label className="form-label">Nombre del campo</label>
  <input className="form-input" value={val} onChange={...} placeholder="..." />
</div>
```

### Clases CSS

| Clase | Elemento | Uso |
|-------|----------|-----|
| `form-group` | `<div>` | Agrupa label + input |
| `form-label` | `<label>` | Etiqueta del campo |
| `form-input` | `<input>`, `<textarea>`, `<select>` | Campo de entrada |
| `form-input-sm` | `<input>` | Variante compacta |

### Validacion

```jsx
<input className="form-input" ... />
{error && <span style={{ fontSize: 12, color: 'var(--color-error)' }}>{error}</span>}
```

---

## 5. Cards

| Clase | Uso |
|-------|-----|
| `.card` | Contenedor base: `display:flex`, `flex-direction:column`, `background:var(--color-surface)`, `border:1px solid var(--color-border)`, `border-radius:var(--radius-lg)`, `padding:20px` |
| `.card-hover` | Agrega `:hover` translateY(-2px) y sombra |
| `.stat-card` | Card para metricas (valor grande + label). Ya tiene `display:flex;flex-direction:column;gap:8px` |
| `.exercise-card` | Card de ejercicio con header y params |
| `.product-card` | Card de producto en store |

### Gap

Todas las `.card` usan `gap` inline para espaciado entre hijos. Ejemplos:
- `gap: 14` para cards del dashboard
- `gap: 12` para cards de lista
- `gap: 10` para cards de notas

---

## 6. Buttons

| Clase | Apariencia | Uso |
|-------|-----------|-----|
| `.btn` | Base inline-flex | Todos los botones |
| `.btn-primary` | Verde `var(--color-accent)`, texto negro | Accion principal (Guardar, Crear) |
| `.btn-ghost` | Fondo transparente, borde | Accion secundaria (Cancelar, Editar) |
| `.btn-danger` | Rojo, texto blanco | Accion destructiva (Eliminar) |
| `.btn-secondary` | Gris | Accion terciaria |
| `.btn-sm` | Padding reducido | Botones compactos |
| `.btn-neutral` | Neutro | Sin enfasis |

### Estado disabled

Todos los botones deben deshabilitarse durante operaciones async:

```jsx
<button className="btn btn-primary" disabled={saving}>Guardar</button>
```

---

## 7. Loader

**Ubicacion:** `src/components/ui/Loader.jsx`

Spinner verde a nivel pagina o seccion.

| Prop | Tipo | Default | Descripcion |
|------|------|---------|-------------|
| `fullPage` | boolean | false | Overlay que ocupa 100vh |
| `inline` | boolean | false | Flex row centrado con texto al lado |
| `size` | string | 'md' | 'sm' (20px), 'md' (32px), 'lg' (48px) |
| `text` | string | — | Texto opcional debajo del spinner |

---

## 8. Toast

**Ubicacion:** `src/components/ui/Modals.jsx` (export `Toast`)

Notificacion flotante temporal. Se controla via `showToast(message, type)` desde AppContext.

| Type | Color |
|------|-------|
| `'success'` | Verde |
| `'error'` | Rojo |
| `'info'` | Neutro |

---

## 9. Empty state

Patron para cuando una lista no tiene elementos:

```jsx
<div className="empty-state">
  <span style={{ fontSize: 48 }}>📊</span>
  <h3>Sin registros</h3>
  <p>Descripcion de lo que el usuario deberia hacer.</p>
  <button className="btn btn-primary" onClick={openCreate}>+ Crear</button>
</div>
```

---

## 10. Search bar

```jsx
<div className="search-bar" style={{ maxWidth: 380 }}>
  <svg width="16" height="16" viewBox="0 0 24 24" ...>...</svg>
  <input placeholder="Buscar..." value={search} onChange={...} />
</div>
```

---

## 11. Badge

| Clase | Uso |
|-------|-----|
| `.badge` | Base inline-flex, border-radius full, uppercase |
| `.badge-success` | Verde, para estados positivos |
| `.badge-neutral` | Gris, para conteos (ej: "5 ej.") |

---

## 12. Page header

Encabezado estandar de pagina con titulo + boton de accion:

```jsx
<div className="page-header">
  <div>
    <h1>Titulo</h1>
    <p>Subtitulo o descripcion</p>
  </div>
  <button className="btn btn-primary" onClick={...}>+ Accion</button>
</div>
```

---

## 13. Progress bar

```jsx
<div className="progress-bar">
  <div className="progress-bar-fill" style={{ width: '100%' }} />
</div>
```

---

## 14. Global exception handler (Backend)

**Ubicacion:** `av-backend/.../exception/GlobalExceptionHandler.java`

Convierte `RuntimeException` en JSON 400 con campo `message`. El frontend
`apiClient.js` lee `err.message` del body para mostrar errores al usuario.

### Respuesta esperada

```json
{
  "message": "Credenciales invalidas",
  "status": 400,
  "timestamp": "2026-06-17T16:00:00"
}
```

---

## Resumen de reglas obligatorias

| Regla | Descripcion |
|-------|-------------|
| Spinner, no texto | Botones muestran `inlineSpinnerStyle`, nunca "Guardando..." |
| Botones disabled | Durante async: `disabled={saving}` o `disabled={deleting}` |
| Error visible | `saveError` en footer del modal en rojo |
| onClose bloqueado | `onClose` de ConfirmModal no cierra si `deleting` |
| Gap en cards | Siempre declarar `gap` inline (14, 12, o 10) |
| No catch vacio | Usar `catch { /* ignore */ }` con comentario |
| SearchSelect | Usar en vez de `<select>` cuando hay mas de 10 opciones |
| Steps | Usar modal con steps cuando el flujo tiene 2+ campos relacionados |
| Mobile-first | Todo modal nuevo debe soportar mobile con `useIsMobile()` |

---

## 15. SearchSelect

**Ubicacion:** componente interno en `Assign.jsx`. Reutilizable copiando
el codigo a otros archivos (no es un export compartido todavia).

Buscador + dropdown custom sin dependencias. Reemplaza `<select>` cuando
hay mas de ~10 opciones y el usuario necesita buscar/filtrar.

### Props

| Prop | Tipo | Descripcion |
|------|------|-------------|
| `options` | `{ id: string, label: string }[]` | Lista de opciones |
| `value` | `string` | ID seleccionado |
| `onChange` | `(id: string) => void` | Callback al seleccionar |
| `placeholder` | `string` | Texto cuando esta vacio |
| `disabled` | `boolean` | Deshabilita el campo (sin dropdown, solo lectura) |
| `mobile` | `boolean` | Ajusta altura de input/opciones y touch targets |

### Comportamiento

| Accion | Efecto |
|--------|--------|
| Focus / click | Abre dropdown con todas las opciones |
| Tipear | Filtra opciones por `label` en tiempo real, resetea seleccion previa |
| Click en opcion | Selecciona, cierra dropdown, muestra nombre en input |
| Click fuera | Cierra dropdown (`mousedown` listener en `document`) |
| `dropUp` | En mobile, si no hay espacio abajo, el dropdown aparece **arriba** del input |

### Mobile vs Desktop

| Aspecto | Mobile (<480px) | Desktop |
|---------|-----------------|---------|
| Altura input | 48px | 42px |
| Altura opcion | 44px | 36px |
| Max-height | 280px | 220px |
| Scroll | `-webkit-overflow-scrolling: touch` | Normal |
| `dropUp` | Si (calcula espacio disponible) | No (siempre abajo) |

### Implementacion

```jsx
function SearchSelect({ options, value, onChange, placeholder, disabled, mobile }) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const [dropUp, setDropUp] = useState(false);
  const containerRef = useRef(null);

  // Cerrar al click fuera
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Dropdown: position absolute, z-index 60, max-height dinamico
  // ...
}
```

---

## 16. Modal con Steps

Patron para flujos de 2-3 pasos dentro de un modal. Usado en el modal
de Asignar/Reasignar rutina en `#/coach/assign`.

### StepIndicator

```
●━━━━━━━━○━━━━━━━━○
Socio     Rutina    Motivo
```

- `●` = step actual (verde `--color-accent`)
- `○` = step completado (gris `--color-text-2`)
- `○` = step futuro (gris claro `--color-text-3`)
- `━━` = linea: verde si completada, gris si pendiente

### Footer por step

| Step | Botones |
|------|---------|
| Primero (0) | `Cancelar` + `Siguiente →` |
| Intermedio (1) | `← Anterior` + `Siguiente →` |
| Ultimo (2) | `← Anterior` + `Guardar` con spinner |

### Navegacion

```js
const nextStep = () => setStep(s => Math.min(s + 1, totalSteps - 1));
const prevStep = () => setStep(s => Math.max(s - 1, 0));
```

### Mobile vs Desktop

| Aspecto | Mobile (<480px) | Desktop |
|---------|-----------------|---------|
| Modal | Full-screen, `border-radius: 16px 16px 0 0` | 520px centrado, `border-radius: 16px`, max 80vh |
| Footer | Botones stacked `column` | Botones side-by-side `row` |
| Animacion | `slideUp 0.25s` | `scaleIn 0.2s` |
| Padding | 16px | 24px |

### Estados del componente

```js
step           → 0 | 1 | 2
modalClientId  → string
modalRoutineId → string
reason         → string (solo step 2 en modo reassign)
observations   → string
assigning      → boolean
mode           → 'assign' (2 steps) | 'reassign' (3 steps)
isCambiar      → boolean (cliente fijo)
```

---

## 17. `useIsMobile()` hook

Hook interno que detecta `window.innerWidth < 480` y se actualiza
en cada `resize`. Usado para condicionales de layout en modales
y componentes.

```jsx
function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 480);
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 480);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return mobile;
}
```

---

## Mockups obligatorios para cambios visuales

Ante cualquier ajuste de UI/UX (formularios, navegacion, estados de carga,
componentes visuales), se debe presentar un mockup ASCII **antes** de implementar.

**Formato:**
- Usar bordes `┌┐└┘├┤┬┴┼│─` para diagramar la UI
- Etiquetar `ANTES → AHORA` para mostrar el delta visual
- Marcar comportamientos nuevos con `←` y el cambio (hover, onClick, spinner)
- Mantener los mockups proporcionales al layout real (mobile/desktop segun corresponda)
- Incluir en los mockups: colores, estados (hover/disabled/loading), y navegacion

**Ejemplo:**
```
┌─────────────────────────┐
│  ANTES                  │
│  ┌────────────────────┐ │
│  │  Ingresando...     │ │  ← texto gris, sin animacion
│  └────────────────────┘ │
│                         │
│  AHORA                  │
│  ┌────────────────────┐ │
│  │        ◌           │ │  ← spinner blanco girando
│  └────────────────────┘ │
└─────────────────────────┘
```

Esta regla es de cumplimiento obligatorio. No se aceptan cambios visuales
sin mockup previo aprobado.
